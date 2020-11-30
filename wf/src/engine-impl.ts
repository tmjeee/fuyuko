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

interface SerializedState {
    name: string,
    currentEvent: string,
    transition: {[k:string]: any}
}


export class InternalState implements State, NextState {

    name: string;
    fn: StateProcessFn;   // perform state operation and return next an event optionally

    // transition map, indicating when 'event' occurred we proceed to the given State
    map: Map<string /* event */, State> = new Map();

    currentEvent: string;

    constructor(name: string, fn: StateProcessFn) {
        this.name = name;
        this.fn = fn ? fn : () => null ;
    }

    on(event?: string): NextState {
        this.currentEvent = event ? event : '*';
        return this;
    }

    to(nextState: State): State {
        this.map.set(this.currentEvent, nextState);
        this.currentEvent = null;
        return this;
    }

    serialize(): string {
        return JSON.stringify({
            name: this.name,
            currentEvent: this.currentEvent,
            transition: [...this.map.entries()].reduce((acc: {[k: string]: any}, e: [string, State]) => {
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
            this.map.get(t).deserialize(d.transition[t]);
        }
    }
}

export class InternalEngine implements Engine {

    startState: State;
    states: State[] = [];
    endState: State;
    args: Argument;

    transitionMap: Map<string /* from_state_name_event */, string /* to_state_name */>;
    stateMap: Map<string /* state name */, State>;

    status: EngineStatus;
    currentState: State;

    constructor() {
        this.transitionMap = new Map();
        this.stateMap = new Map();
        this.status = 'UNIITIALIZED';
    }

    serialize(): string {
       return JSON.stringify({
          startState: this.startState.serialize(),
          states: this.states.map((s: State) => s.serialize()),
          endState: this.endState.serialize(),
          arg: serializeArgument(this.args),
          transitionMap: [...this.transitionMap.entries()].reduce((acc: {[k: string]: any}, e: [string, string]) => {
              return acc;
          }, {}),
          stateMap: [...this.stateMap.entries()].reduce((acc: {[k: string]: State}, e: [string, State]) => {
              return acc;
          }, {}),
          status: this.status,
          currentState: this.currentState.serialize(),
       });
    }

    deserialize(data: string) {
        const d: {
           startState: string,
           states: string[],
           endState: string,
           args: string,
           transitionMap: {[k: string]: string},
           stateMap: {[k: string]: string},
           status: string,
           currentState: string
        } = JSON.parse(data);

        // startState
        this.startState.deserialize(d.startState);
        
        // states
        for (const s in d.states) {
           const _st: SerializedState = JSON.parse(s);
           const sta: State = this.states.find((st: State) => st.name === _st.name);
           if (sta) {
               sta.deserialize(s);
           }
        }
        
        // endState
        this.endState.deserialize(d.endState);
        
        // args
        this.args = deserializeArgument(d.args);
        for (const t in d.transitionMap) {
            this.transitionMap.set(t, d.transitionMap[t]);
        }
        
        // stateMap
        for (const t in d.stateMap) {
            if (this.stateMap.has(t)) {
                this.stateMap.get(t).deserialize(d.stateMap[t]);
            }
        }
        
        // status
        this.status = d.status as EngineStatus;
        
        // currentState
        this.currentState.deserialize(d.currentState);
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
        this.args = arg;
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
            const event: string = await currentState.fn(this.args);
            console.log('**', currentState.name);

            if (currentState.name === (this.endState as InternalState).name) { // end
                this.status = 'ENDED';
                return {end: true, status: this.status} as EngineResponse;
            }

            const nextStateName: string = this.transitionMap.get(`${currentState.name}_${event}`);
            let nextState: InternalState = this.stateMap.get(nextStateName) as InternalState;

            if (!nextState) {
                // try to find a generic transition
                const nextWildcardStateName: string = this.transitionMap.get(`${currentState.name}_*`);
                nextState = this.stateMap.get(nextWildcardStateName) as InternalState;

                if (!nextState) {
                    this.status = 'ERROR';
                    throw new Error(`current state named ${currentState.name} fired event ${event} result in no possible next state`);
                }
            }

            this.currentState = nextState;

            return {end: false, status: this.status } as EngineResponse;
        } catch (e) {
            this.status = 'ERROR';
            throw e;
        }
    }
}
