import {Argument, Engine, State, StateInitFn, StateProcessFn} from "./engine-interface";
import {InternalEngine, InternalState} from "./engine-impl";

export const createState2 = (name: string, obj: { initFn?: StateInitFn, processFn?: StateProcessFn }) => {
    return new InternalState(name,
        obj.initFn ? obj.initFn.bind(obj): undefined,
        obj.processFn ? obj.processFn.bind(obj): undefined);
};
export const createState = (name: string, initFn?: StateInitFn, processFn?: StateProcessFn): State => {
    return  new InternalState(name, initFn, processFn);
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

