export type EngineStatus = 'UNIITIALIZED' | 'INIT' | 'STARTED' | 'ENDED' | 'ERROR';

export interface Engine {
    startsWith(state: State): Engine;
    register(state: State): Engine;
    endsWith(state: State): Engine;
    init(arg: Argument): Engine;
    next(): Promise<EngineResponse>;
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

export interface StateProcessFn  {
    ():  Promise<string> | null | undefined;
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
