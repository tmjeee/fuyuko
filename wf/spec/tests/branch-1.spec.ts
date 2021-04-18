import {Argument, createEngine, createState, Engine, EngineResponse, State} from '../../src';
import {InternalEngine} from "../../src/engine-impl";

describe('simple', () => {

    let engine: Engine;

    beforeEach(async () => {

        /*
         *  Flow Diagram
         * --------------
         *
         *  state1  +--(e1)-->  state2  --(*)-->  state5
         *          \--(e2)-->  state3  --(*)--/
         *          \--(*)--->  state4  --(*)--/
         *
         */
        const state1 = createState(`state1`, {
            initFn: async (args) => {},
            processFn: async (prev, args) => Promise.resolve(args.EVENT)
        });
        const state2 = createState(`state2`, {
            initFn: async args => {},
            processFn: async (prev, args) => Promise.resolve(args.EVENT)
        });
        const state3 = createState(`state3`, {
            initFn: async (args) => {},
            processFn: async (prev, args) => Promise.resolve(args.EVENT)
        });
        const state4 = createState(`state4`, {
            initFn: async (args) => { },
            processFn: async (prev, args) => Promise.resolve(args.EVENT)
        });
        const state5 = createState(`state5`, {
            initFn: async args => { },
            processFn: async (prev, args) => Promise.resolve(args.EVENT)
        });

        // spell out all possible transitions for each state
        state1
            .on('e1').to(state2)
            .on('e2').to(state3)
            .on().to(state4);
        state2.on().to(state5);
        state3.on().to(state5);
        state4.on().to(state5);

        // register all states with engine
        engine = createEngine()
            .startsWith(state1)
            .register(state2)
            .register(state3)
            .register(state4)
            .endsWith(state5)
            .init({
                "ARG1": "VALUE1"
            });
    });


    it('test #1', async () => {

        // === #1
        const data1 = engine.serializeData();
        const dataJson1 = JSON.parse(data1);
        // console.log(dataJson1);

        expect(dataJson1.args.ARG1).toEqual('VALUE1');
        expect(dataJson1.status).toEqual('INIT');
        expect(dataJson1.previousState).toBeUndefined();
        expect(dataJson1.currentState.name).toEqual('state1');
        expect(dataJson1.initedStateNames).toEqual(['state1', 'state2', 'state3', 'state4', 'state5']);


        // === #2
        const r2 = await engine.next({
            "ARG2": "VALUE2",
            "EVENT": 'e1'
        });
        const data2 = engine.serializeData();
        const dataJson2 = JSON.parse(data2);
        // console.log(dataJson2);

        expect(r2.status).toEqual('STARTED');
        expect(r2.end).toBeFalse();
        expect(dataJson2.args.ARG1).toEqual('VALUE1');
        expect(dataJson2.args.ARG2).toEqual('VALUE2');
        expect(dataJson2.args.EVENT).toEqual('e1');
        expect(dataJson2.status).toEqual('STARTED');
        expect(dataJson2.previousState.name).toEqual('state1');
        expect(dataJson2.currentState.name).toBe('state2');
        expect(dataJson2.initedStateNames).toEqual(['state1', 'state2', 'state3', 'state4', 'state5']);

        // === #3
        const r3 = await engine.next({
            "ARG3": "VALUE3",
            "EVENT": "xxx"
        });
        const data3 = engine.serializeData();
        const dataJson3 = JSON.parse(data3);
        console.log(dataJson3);

        expect(r3.status).toEqual('ENDED');
        expect(r3.end).toBeTrue();
        expect(dataJson3.args.ARG1).toEqual('VALUE1');
        expect(dataJson3.args.ARG2).toEqual('VALUE2');
        expect(dataJson3.args.ARG3).toEqual('VALUE3');
        expect(dataJson3.args.EVENT).toEqual('xxx');
        expect(dataJson3.status).toEqual('ENDED');
        expect(dataJson3.previousState.name).toEqual('state2');
        expect(dataJson3.currentState.name).toBe('state5');
        expect(dataJson3.initedStateNames).toEqual(['state1', 'state2', 'state3', 'state4', 'state5']);
    });

    it('test #2', async () => {

        // === #1
        const data1 = engine.serializeData();
        const dataJson1 = JSON.parse(data1);
        // console.log(dataJson1);

        expect(dataJson1.args.ARG1).toEqual('VALUE1');
        expect(dataJson1.status).toEqual('INIT');
        expect(dataJson1.previousState).toBeUndefined();
        expect(dataJson1.currentState.name).toEqual('state1');
        expect(dataJson1.initedStateNames).toEqual(['state1', 'state2', 'state3', 'state4', 'state5']);


        // === #2
        const r2 = await engine.next({
            "ARG2": "VALUE2",
            "EVENT": 'e2'
        });
        const data2 = engine.serializeData();
        const dataJson2 = JSON.parse(data2);
        console.log(dataJson2);

        expect(r2.status).toEqual('STARTED');
        expect(r2.end).toBeFalse();
        expect(dataJson2.args.ARG1).toEqual('VALUE1');
        expect(dataJson2.args.ARG2).toEqual('VALUE2');
        expect(dataJson2.args.EVENT).toEqual('e2');
        expect(dataJson2.status).toEqual('STARTED');
        expect(dataJson2.previousState.name).toEqual('state1');
        expect(dataJson2.currentState.name).toBe('state3');
        expect(dataJson2.initedStateNames).toEqual(['state1', 'state2', 'state3', 'state4', 'state5']);

        // === #3
        const r3 = await engine.next({
            "ARG3": "VALUE3",
            "EVENT": "xxx"
        });
        const data3 = engine.serializeData();
        const dataJson3 = JSON.parse(data3);
        console.log(dataJson3);

        expect(r3.status).toEqual('ENDED');
        expect(r3.end).toBeTrue();
        expect(dataJson3.args.ARG1).toEqual('VALUE1');
        expect(dataJson3.args.ARG2).toEqual('VALUE2');
        expect(dataJson3.args.ARG3).toEqual('VALUE3');
        expect(dataJson3.args.EVENT).toEqual('xxx');
        expect(dataJson3.status).toEqual('ENDED');
        expect(dataJson3.previousState.name).toEqual('state3');
        expect(dataJson3.currentState.name).toBe('state5');
        expect(dataJson3.initedStateNames).toEqual(['state1', 'state2', 'state3', 'state4', 'state5']);
    });
});
