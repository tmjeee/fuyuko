
export interface Engine {
    startsWith: (state: State) => Engine;
    register: (state: State) => Engine;
    endsWith: (state: State) => Engine;
    init: () => Engine;
    next: () => EngineResponse;
}

export interface EngineResponse {
    end: boolean;
}

export interface Argument {
    [key: string]: any;
}

export interface StepProcessFn  {
    ():  Promise<string> | null | undefined;
}

export abstract class Step {
    abstract arguments(): Argument;
    abstract process(): StepProcessFn
}

export interface Index {
    next(): Step;
}


export interface State {
    on: (event?: string) => InternalState1;
}

export interface InternalState1 {
    to: (nextState: State) => State;
}


export const createState = (step: Step): State => {
    return {} as State;
}

export const createStep = (processFn?: StepProcessFn): Step => {
    return {} as Step;
}

export const createEngine = (): Engine => {
   return {} as Engine;
}

/**
 *     <start> -> step1 -> step2 -> step3 -> <end>
 */
{
    const step1 = createStep();
    const step2 = createStep();
    const step3 = createStep();

    const state1 = createState(step1)
    const state2 = createState(step2)
    const state3 = createState(step3)

    state1.on().to(state2);
    state2.on().to(state3);

    const engine = createEngine()
        .startsWith(state1)
        .register(state2)
        .endsWith(state3)
        .init()
    ;

    while(engine.next().end) {}
}


/**
 *  <start> -> step1  +-(event1)->  step2 +-> step5 -> <end>
 *                    \-(event3)->  step3 +
 *                    \-(*)------>  step4 +
 */
{
    const step1 = createStep();
    const step2 = createStep();
    const step3 = createStep();
    const step4 = createStep();
    const step5 = createStep();

    const state1 = createState(step1);
    const state2 = createState(step2);
    const state3 = createState(step3);
    const state4 = createState(step4);
    const state5 = createState(step5);

    state1
        .on('event1').to(state2)
        .on('event2').to(state2)
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
        .init()
    ;
}
