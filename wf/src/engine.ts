import {Argument, Engine, EngineResponse, NextState, State} from "./index";

export class InternalState implements State, NextState {

    map: Map<string, State> = new Map();

    currentEvent: string;

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

    map: Map<string, State>;


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
            for (const e of (state as InternalState).map.keys()) {
            }
        }
        return this;
    }

    next(): EngineResponse {
        // todo:
        return { end: false } as EngineResponse;
    }
}
