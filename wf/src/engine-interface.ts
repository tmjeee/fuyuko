export type EngineStatus = 'UNIITIALIZED' | 'INIT' | 'STARTED' | 'ENDED' | 'ERROR';

export interface EngineSerializedData {
    args: Argument,
    status: EngineStatus,
    previousState: {name: string} | undefined,
    currentState: {name: string} | undefined,
    initedStateNames: string[];
};

export interface Engine {
    readonly args: Argument;
    readonly currentState: State | undefined;
    readonly status: EngineStatus;
    startsWith(state: State): Engine;
    register(state: State): Engine;
    endsWith(...states: State[]): Engine;
    init(arg: Argument, serializedData?: string): Engine;
    next(arg?: Argument): Promise<EngineResponse>;
    serializeData(): string;
}


export interface EngineResponse {
    end: boolean;
    status: EngineStatus;
}

export interface Argument {
    [key: string]: any;
}

export interface StateInitFn {
    (arg: Argument): void;
}
export interface StateProcessFn  {
    (prevState: State | undefined, arg: Argument):  Promise<string> | undefined;
}

export interface State {
    name: string;
    on(event?: string): NextState;
}

export interface NextState {
    to(nextState: State): State;
}
