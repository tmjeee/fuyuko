export type EngineStatus = 'UNIITIALIZED' | 'INIT' | 'STARTED' | 'ENDED' | 'ERROR';

export interface Engine {
    readonly args: Argument | undefined;
    readonly currentState: State | undefined;
    readonly status: EngineStatus;
    startsWith(state: State): Engine;
    register(state: State): Engine;
    endsWith(...states: State[]): Engine;
    init(arg: Argument): Engine;
    next(arg?: Argument): Promise<EngineResponse>;
    serialize(): string;
    deserialize(d: string): void;
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
    serialize(): string;
    deserialize(data: string): void;
}

export interface NextState {
    to(nextState: State): State;
    serialize(): string;
    deserialize(data: string): void;
}
