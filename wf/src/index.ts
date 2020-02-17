
export interface Engine {
    startsWith(state: State): Engine;
    register(state: State): Engine;
    endsWith(state: State): Engine;
    init(arg: Argument): Engine;
    next(): Promise<EngineResponse>;
}

export interface EngineResponse {
    end: boolean;
}

export interface Argument {
    [key: string]: any;
}

export interface StateProcessFn  {
    ():  Promise<string> | null | undefined;
}

export abstract class Step {
    abstract arguments(): Argument;
    abstract process(): StateProcessFn
}

export interface Index {
    next(): Step;
}


export interface State {
    on(event?: string): NextState;
}

export interface NextState {
    to(nextState: State): State;
}


export const createState = (name: string, fn?: StateProcessFn): State => {
    // todo:
    return {} as State;
}


export const createEngine = (): Engine => {
   // todo:
   return {} as Engine;
}

/**
 *     <start> -> step1 -> step2 -> step3 -> <end>
 */
(async ()=>{
    const state1 = createState(`step1`, () => Promise.resolve(`e1`));
    const state2 = createState(`step2`, () => Promise.resolve(`e2`));
    const state3 = createState(`step3`, () => Promise.resolve(`e3`));

    state1.on().to(state2);
    state2.on().to(state3);

    const engine = createEngine()
        .startsWith(state1)
        .register(state2)
        .endsWith(state3)
        .init({} as Argument)
    ;

    while(!(await engine.next()).end) {}
})();


/**
 *  <start> -> step1  +-(event1)->  step2 +-> step5 -> <end>
 *                    \-(event3)->  step3 +
 *                    \-(*)------>  step4 +
 */
{
    const state1 = createState(`step1`, () => Promise.resolve('e1'));
    const state2 = createState(`step2`, () => Promise.resolve('e2'));
    const state3 = createState(`step3`, () => Promise.resolve('e3'));
    const state4 = createState(`step4`, () => Promise.resolve('e4'));
    const state5 = createState(`step5`, () => Promise.resolve('e5'));

    state1
        .on('e1').to(state2)
        .on('e2').to(state2)
        .on().to(state4);
    state2.on().to(state5);
    state3.on().to(state5);
    state4.on().to(state5);

    const engine = createEngine()
        .startsWith(state1)
        .register(state2)
        .register(state3)
        .register(state4)
        .endsWith(state5)
        .init({} as Argument)
    ;
}
