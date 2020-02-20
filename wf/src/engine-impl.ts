import {Argument, Engine, EngineResponse, EngineStatus, NextState, State, StateProcessFn} from "./index";

export class InternalState implements State, NextState {

    name: string;
    fn: StateProcessFn;
    map: Map<string, State> = new Map();

    currentEvent: string;

    constructor(name: string, fn: StateProcessFn) {
        this.name = name;
        this.fn = fn ? fn : () => null ;
    }

    on(event?: string): NextState {
        this.currentEvent = event;
        return this;
    }

    to(nextState: State): State {
        this.map.set(this.currentEvent, nextState);
        this.currentEvent = null;
        return this;
    }
}

export class InternalEngine implements Engine {

    startState: State;
    states: State[] = [];
    endState: State;
    arg: Argument;

    transitionMap: Map<string /* from_state_name_event */, string /* to_state_name */>;
    stateMap: Map<string /* state name */, State>;

    status: EngineStatus;
    currentState: State;

    constructor() {
        this.transitionMap = new Map();
        this.stateMap = new Map();
        this.status = 'UNIITIALIZED';
    }


    startsWith(state: State): Engine {
        if (this.startState) {
            throw Error(`A start state was already defined`);
        }
        this.startState = state;
        this.states.push(state);
        return this;
    }

    register(state: State): Engine {
        if (this.states.includes(state)) {
           throw Error(`State already registered`);
        }
        this.states.push(state);
        return this;
    }

    endsWith(state: State): Engine {
        if (this.endState) {
            throw Error(`An end state was already defined`);
        }
        this.states.push(state);
        this.endState = state;
        return this;
    }

    init(arg: Argument): Engine {
        this.arg = arg;
        for (const state of this.states) {
            const fromState: InternalState = state as InternalState;
            this.stateMap.set(fromState.name, fromState);
            const m: Map<string, InternalState> = fromState.map as Map<string, InternalState>;
            for (const fromStateEvent of m.keys()) {
                const toState: InternalState = m.get(fromStateEvent);
                this.transitionMap.set(`${fromState.name}_${fromStateEvent}`, `${toState.name}`);
                this.stateMap.set(toState.name, toState);
            }
        }
        this.status = 'INIT';
        this.currentState = this.startState;
        return this;
    }

    async next(): Promise<EngineResponse> {
        if (this.status === 'INIT') {
            this.status = 'STARTED';
        }
        if (this.status === 'ENDED') {
            return { end: true } as EngineResponse;
        }

        const currentState: InternalState = this.currentState as InternalState;

        try {
            const event: string = await currentState.fn();

            if (currentState.name === (this.endState as InternalState).name) { // end
                this.status = 'ENDED';
                return {end: true, status} as EngineResponse;
            }

            const nextStateName: string = this.transitionMap.get(`${currentState.name}_${event}`);
            const nextState: InternalState = this.stateMap.get(nextStateName) as InternalState;

            if (!nextState) {
                this.status = 'ERROR';
                throw new Error(`current state named ${currentState.name} fired event ${event} result in no possible next state`);
            }

            this.currentState = nextState;

            return {end: false, status } as EngineResponse;
        } catch (e) {
            this.status = 'ERROR';
            throw e;
        }
    }
}
