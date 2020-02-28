import {Engine, State, StateProcessFn} from "./engine-interface";
import {InternalEngine, InternalState} from "./engine-impl";

export const createState = (name: string, fn?: StateProcessFn): State => {
    return  new InternalState(name, fn);
}

export const createEngine = (): Engine => {
    return new InternalEngine();
}
