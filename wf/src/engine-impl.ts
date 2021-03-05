import {
    Argument, deserializeArgument,
    Engine,
    EngineResponse,
    EngineStatus,
    NextState,
    serializeArgument,
    State,
    StateProcessFn
} from "./index";
import {EngineSerializedData, StateInitFn} from './engine-interface';

interface SerializedState {
    name: string,
    currentEvent: string,
    // transition: {[k:string]: any}
}


/**
 * =======================
 * === InternalState
 * =======================
 */
export class InternalState implements State, NextState {

    name: string; /* saved state */
    initFn: StateInitFn;         // perform state init operation
    processFn: StateProcessFn;   // perform state operation and return next an event optionally

    // transition map, indicating when 'event' occurred we proceed to the given State
    eventToStateMap: Map<string /* event */, State> = new Map();

    currentEvent: string | undefined;

    constructor(name: string, initFn?: StateInitFn, processFn?: StateProcessFn) {
        this.name = name;
        this.initFn = initFn ? initFn : async ()=>{};
        this.processFn = processFn ? processFn : async () => '*' ;
    }

    on(event?: string): NextState {
        this.currentEvent = event ? event : '*';
        return this;
    }

    to(nextState: State): State {
        if (!this.currentEvent) {
            throw Error('Bad usage need to call on(...) before to(...)')
        }
        this.eventToStateMap.set(this.currentEvent, nextState);
        this.currentEvent = undefined;
        return this;
    }
}

/**
 * =======================
 * === InternalEngine
 * =======================
 */
export class InternalEngine implements Engine {

    private startState: State | undefined;
    private states: State[] = [];
    private endStates: State[] = [];

    private transitionMap: Map<string /* <from_state_name>_<event> */, string /* <to_state_name> */>;
    private stateMap: Map<string /* state name */, State>;

    args: Argument;                                 /* saved state */
    status: EngineStatus;                           /* saved state */
    private previousState: State | undefined;       /* saved state */
    currentState: State | undefined;                /* saved state */
    private initedStateNames: string[] = [];        /* saved state */

    constructor() {
        this.args = {};
        this.transitionMap = new Map();
        this.stateMap = new Map();
        this.status = 'UNIITIALIZED';
    }

    serializeData(): string {
       const engineSerializedData: EngineSerializedData = {
           args: this.args,
           status: this.status,
           previousState: this.previousState ? { name: this.previousState.name } : undefined,
           currentState: this.currentState ? { name: this.currentState.name } : undefined,
           initedStateNames: this.initedStateNames
       };
       return JSON.stringify(engineSerializedData);
    }

    startsWith(state: State): Engine {
        if (this.startState) {
            throw Error(`A start state was already defined`);
        }
        this.startState = state;
        if (!this.states.includes(state)) {
            this.states.push(state);
        }
        return this;
    }

    register(state: State): Engine {
        if (this.states.includes(state)) {
           throw Error(`State already registered`);
        }
        this.states.push(state);
        return this;
    }

    endsWith(...states: State[]): Engine {
        if (this.endStates && this.endStates.length) {
            throw Error(`End state(s) was / were already defined`);
        }
        for (const state of states) {
            if (!this.states.includes(state)) {
                this.states.push(state);
            }
        }
        this.endStates = [...states];
        return this;
    }

    init(arg: Argument, serializedData?: string): Engine {
        this.combineArgs(arg);
        for (const state of this.states) {
            const fromState: InternalState = state as InternalState;
            this.stateMap.set(fromState.name, fromState);
            const eventToStateMap: Map<string /* event */, InternalState> = fromState.eventToStateMap as Map<string, InternalState>;
            for (const [fromStateEvent, toState] of eventToStateMap.entries()) {
                if (toState) {
                    console.log(`init() call: mapping ${fromState.name}_${fromStateEvent} -> ${toState.name}`);
                    this.transitionMap.set(`${fromState.name}_${fromStateEvent}`, `${toState.name}`);
                    this.stateMap.set(toState.name, toState);
                }
            }
        }
        this.status = 'INIT';
        this.currentState = this.startState;

        // deserialize data
        const hasSerializedData = !!serializedData;
        const serializedDataObj: EngineSerializedData | undefined = hasSerializedData ? JSON.parse(serializedData!) : undefined;
        if( hasSerializedData) {
            this.combineArgs(serializedDataObj!.args);
            this.status = serializedDataObj!.status;
            this.initedStateNames = serializedDataObj!.initedStateNames;
            if (serializedDataObj!.previousState) {
                this.previousState = this.stateMap.get(serializedDataObj!.previousState.name)
            }
            if (serializedDataObj!.currentState) {
                this.currentState = this.stateMap.get(serializedDataObj!.currentState.name);
            }
        }

        // init fn
        for (const state of this.states) {
            this.runInitFn(state);
        }

        return this;
    }

    async next(inputArg?: Argument): Promise<EngineResponse> {
        if (this.status === 'INIT') {
            this.status = 'STARTED';
        }
        if (this.status === 'ENDED') {
            return { end: true, status: this.status };
        }

        this.combineArgs(inputArg);
        const currentState: InternalState = this.currentState as InternalState;
        try {
            // get current state to processFn(..) and get back an event for transitioning to next state
            const event: string | undefined = await currentState.processFn(this.previousState, this.args || {});
            let nextStateName: string | undefined = this.transitionMap.get(`${currentState.name}_${event}`);

            // with the event returned, we can't find a state to transition to, try generic event
            if (!nextStateName) {
                nextStateName = this.transitionMap.get(`${currentState.name}_*`);
            }

            if (nextStateName) {
                let nextState: InternalState = this.stateMap.get(nextStateName) as InternalState;

                // the next state is not registered / found
                if (!nextState) {
                    throw new Error(`next transition state named ${nextStateName} is not registered / found`);
                }

                this.previousState = this.currentState;
                this.currentState = nextState;
            } else {
                // still can't find a state to transition to? stay in this state
                throw new Error(`current state named ${currentState.name} fired event ${event} result in no possible next state`);
            }


            console.log(`*** next() call: prev=${this.previousState ? this.previousState.name : 'no-previous-state'}, current=${this.currentState.name}, event=${event}`);
            if (this.endStates.map((s) => s.name).includes(this.currentState.name)) { // end
                this.status = 'ENDED';
                // if it is the end state, we want to call it's processFn anyways
                (this.currentState as InternalState).processFn(this.previousState, this.args || {});
            }
            return {end: (this.status === 'ENDED'), status: this.status };
        } catch (e) {
            this.status = 'ERROR';
            throw e;
        }
    }

    private runInitFn(state: State | undefined) {
        if (state && !this.initedStateNames.includes(state.name)) {
            this.initedStateNames.push(state.name);
            (state as InternalState).initFn(this.args || {});
        }
    }

    private combineArgs(inputArg?: Argument) {
        if (inputArg) {
            this.args = {...this.args, ...inputArg};
        }
    }
}