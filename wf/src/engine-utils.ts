import {Argument, Engine, State, StateProcessFn} from "./engine-interface";
import {InternalEngine, InternalState} from "./engine-impl";

export const createState = (name: string, fn?: StateProcessFn): State => {
    return  new InternalState(name, fn);
};

export const createEngine = (): Engine => {
    return new InternalEngine();
};

export const serializeArgument = (arg: Argument): string => {
    return JSON.stringify(arg);
};

export const deserializeArgument = (d: string): Argument => {
    return (!d || d.trim().length == 0) ? {} : JSON.parse(d);
};

