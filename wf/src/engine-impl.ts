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
import {StateInitFn} from "./engine-interface";

interface SerializedState {
    name: string,
    currentEvent: string,
    transition: {[k:string]: any}
}


/**
 * =======================
 * === InternalState
 * =======================
 */
export class InternalState implements State, NextState {

    name: string;
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

    serialize(): string {
        return JSON.stringify({
            name: this.name,
            currentEvent: this.currentEvent,
            transition: [...this.eventToStateMap.entries()].reduce((acc: {[k: string]: any}, e: [string, State]) => {
                acc[e[0]] = e[1].serialize();
                return acc;
            }, {})
        });
    }

    deserialize(data: string): void {
        const d: SerializedState = JSON.parse(data);
        this.name = d.name;
        this.currentEvent = d.currentEvent;
        for (const t in d.transition) {
            const r = this.eventToStateMap.get(t);
            if (r) {
                r.deserialize(d.transition[t]);
            }
        }
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
    args: Argument | undefined;

    private transitionMap: Map<string /* from_state_name_event */, string /* to_state_name */>;
    private stateMap: Map<string /* state name */, State>;

    status: EngineStatus;
    private previousState: State | undefined;
    currentState: State | undefined;
    private initedStateNames: string[] = [];

    constructor() {
        this.transitionMap = new Map();
        this.stateMap = new Map();
        this.status = 'UNIITIALIZED';
    }

    serialize(): string {
       return JSON.stringify({
          startState: this.startState ? this.startState.serialize(): this.startState,
          states: this.states.map((s: State) => s.serialize()),
          endStates: this.endStates.map((s: State) => s.serialize()),
          arg: this.args ? serializeArgument(this.args) : this.args,
          transitionMap: [...this.transitionMap.entries()].reduce((acc: {[k: string]: any}, e: [string, string]) => {
              return acc;
          }, {}),
          stateMap: [...this.stateMap.entries()].reduce((acc: {[k: string]: State}, e: [string, State]) => {
              return acc;
          }, {}),
          status: this.status,
          currentState: this.currentState ? this.currentState.serialize() : this.currentState,
       });
    }

    deserialize(data: string) {
        const d: {
           startState: string,
           states: string[],
           endStates: string[],
           args: string,
           transitionMap: {[k: string]: string},
           stateMap: {[k: string]: string},
           status: string,
           currentState: string
        } = JSON.parse(data);

        // startState
        if (this.startState) {
            this.startState.deserialize(d.startState);
        }

        // states
        for (const s in d.states) {
           const _st: SerializedState = JSON.parse(s);
           const sta: State | undefined = this.states.find((st: State) => st.name === _st.name);
           if (sta) {
               sta.deserialize(s);
           }
        }
        
        // endStates
        for (const s in d.endStates) {
            const _st: SerializedState = JSON.parse(s);
            const sta: State | undefined = this.states.find((st: State) => st.name === _st.name);
            if (sta) {
                sta.deserialize(s);
            }
        }

        // args
        this.args = deserializeArgument(d.args);
        for (const t in d.transitionMap) {
            this.transitionMap.set(t, d.transitionMap[t]);
        }
        
        // stateMap
        for (const t in d.stateMap) {
            if (this.stateMap.has(t)) {
                this.stateMap.get(t)!.deserialize(d.stateMap[t]);
            }
        }
        
        // status
        this.status = d.status as EngineStatus;
        
        // currentState
        if (this.currentState) {
            this.currentState.deserialize(d.currentState);
        }
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

    init(arg: Argument): Engine {
        this.args = arg;
        for (const state of this.states) {
            const fromState: InternalState = state as InternalState;
            this.stateMap.set(fromState.name, fromState);
            const eventToStateMap: Map<string /* event */, InternalState> = fromState.eventToStateMap as Map<string, InternalState>;
            for (const fromStateEvent of eventToStateMap.keys()) {
                const toState: InternalState | undefined = eventToStateMap.get(fromStateEvent);
                if (toState) {
                    this.transitionMap.set(`${fromState.name}_${fromStateEvent}`, `${toState.name}`);
                    this.stateMap.set(toState.name, toState);
                }
            }
            this.runInitFn(state);
        }
        this.status = 'INIT';
        this.currentState = this.startState;
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
            const event: string | undefined = await currentState.processFn(this.previousState, this.args || {});
            console.log('**', currentState.name);

            if (this.endStates.map((s) => s.name).includes(currentState.name)) { // end
                this.status = 'ENDED';
                return {end: true, status: this.status} as EngineResponse;
            }

            const nextStateName: string | undefined = this.transitionMap.get(`${currentState.name}_${event}`);
            if (nextStateName) {
                let nextState: InternalState = this.stateMap.get(nextStateName) as InternalState;

                if (!nextState) {
                    // try to find a generic transition
                    const nextWildcardStateName: string | undefined = this.transitionMap.get(`${currentState.name}_*`);
                    if (nextWildcardStateName) {
                        nextState = this.stateMap.get(nextWildcardStateName) as InternalState;

                        if (!nextState) {
                            this.status = 'ERROR';
                            throw new Error(`current state named ${currentState.name} fired event ${event} result in no possible next state`);
                        }
                    }
                }

                this.previousState = this.currentState;
                this.currentState = nextState;
            }

            return {end: false, status: this.status };
        } catch (e) {
            this.status = 'ERROR';
            throw e;
        }
    }

    private runInitFn(state: State | undefined) {
        if (state && this.initedStateNames.includes(state.name)) {
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
