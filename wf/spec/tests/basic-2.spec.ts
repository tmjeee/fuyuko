import {Argument, createEngine, createState} from '../../src';

describe('basic-2', () => {

    let engine;

    beforeEach(async () => {
        /*
         * Flow Diagram:
         * -------------
         *
         * state1 --(*)--> state2 --(*)--> state3 --(*)--> state4 --(*)--> state5
         *
         */
        const state1 = createState(`state1`, {
            initFn: async(args) => {},
            processFn: (args) => Promise.resolve(`e1`)
        });
        const state2 = createState(`state2`, {
            initFn: async (args) => {},
            processFn: (args) => Promise.resolve(`e2`)
        });
        const state3 = createState(`state3`, {
            initFn: async (args) => {},
            processFn: async (args) => Promise.resolve(`e3`)
        });
        const state4 = createState(`state4`, {
            initFn: async (args) => {},
            processFn: async (args) => Promise.resolve(`e4`)
        });
        const state5 = createState(`state5`, {
            initFn: async (arg) => {},
            processFn: async (args) => Promise.resolve(`e5`)
        });

        // spell out all the possible transition events for each state
        state1.on().to(state2);    // implies * event
        state2.on().to(state3);    // implies * event
        state3.on().to(state4);    // implies * event
        state4.on().to(state5);    // implies * event

        // register state
        engine = createEngine()
            .startsWith(state1)
            .register(state2)
            .register(state3)
            .register(state4)
            .endsWith(state5)
            .init({} as Argument)
        ;
    })

    it(`test`, () => {

    });

});