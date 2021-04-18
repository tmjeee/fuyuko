import {Argument, createEngine, createState, Engine, State} from '../../src';

describe('data-serialization-1', () => {

    const buildEngine = (
        reg: {
            state1InitFn: (arg: Argument) => void,
            state2InitFn: (arg: Argument) => void,
            state3InitFn: (arg: Argument) => void,
            state4InitFn: (arg: Argument) => void,
            state5InitFn: (arg: Argument) => void,
            state1ProcessFn: (prev: State | undefined, arg: Argument) => void,
            state2ProcessFn: (prev: State | undefined, arg: Argument) => void,
            state3ProcessFn: (prev: State | undefined, arg: Argument) => void,
            state4ProcessFn: (prev: State | undefined, arg: Argument) => void,
            state5ProcessFn: (prev: State | undefined, arg: Argument) => void,
        },
        serializedData?: string): Engine => {
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
            initFn: async (args) => { reg.state1InitFn(args); },
            processFn: async (prev, args) => {
                reg.state1ProcessFn(prev, args);
                return Promise.resolve(args.EVENT);
            }
        });
        const state2 = createState(`state2`, {
            initFn: async args => { reg.state2InitFn(args); },
            processFn: async (prev, args) => {
                reg.state2ProcessFn(prev, args);
                return Promise.resolve(args.EVENT)
            }
        });
        const state3 = createState(`state3`, {
            initFn: async (args) => { reg.state3InitFn(args); },
            processFn: async (prev, args) => {
                reg.state3ProcessFn(prev, args);
                return Promise.resolve(args.EVENT)
            }
        });
        const state4 = createState(`state4`, {
            initFn: async (args) => { reg.state4InitFn(args); },
            processFn: async (prev, args) => {
                reg.state4ProcessFn(prev, args);
                return Promise.resolve(args.EVENT)
            }
        });
        const state5 = createState(`state5`, {
            initFn: async args => { reg.state5InitFn(args); },
            processFn: async (prev, args) => {
                reg.state5ProcessFn(prev, args);
                return Promise.resolve(args.EVENT)
            }
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
        return createEngine()
            .startsWith(state1)
            .register(state2)
            .register(state3)
            .register(state4)
            .endsWith(state5)
            .init({
                "ARG1": "VALUE1"
            }, serializedData);
    }

    it('test', async () => {
        const reg1 = {
            state1InitFn: jasmine.createSpy(),
            state2InitFn: jasmine.createSpy(),
            state3InitFn: jasmine.createSpy(),
            state4InitFn: jasmine.createSpy(),
            state5InitFn: jasmine.createSpy(),
            state1ProcessFn: jasmine.createSpy(),
            state2ProcessFn: jasmine.createSpy(),
            state3ProcessFn: jasmine.createSpy(),
            state4ProcessFn: jasmine.createSpy(),
            state5ProcessFn: jasmine.createSpy(),
        };
        const engine1 = buildEngine(reg1);
        const r1 = await engine1.next({ EVENT: 'e2'});
        const serializedData = engine1.serializeData();
        const serializedDataJson = JSON.parse(serializedData);

        // console.log(JSON.parse(serializedData));
        expect(r1.end).toBeFalse();
        expect(r1.status).toBe('STARTED');
        expect(serializedDataJson.args.ARG1).toEqual('VALUE1');
        expect(serializedDataJson.args.EVENT).toEqual('e2');
        expect(serializedDataJson.status).toEqual('STARTED');
        expect(serializedDataJson.previousState.name).toEqual('state1');
        expect(serializedDataJson.currentState.name).toEqual('state3');
        expect(serializedDataJson.initedStateNames).toEqual(['state1', 'state2', 'state3', 'state4', 'state5']);
        expect(reg1.state1InitFn).toHaveBeenCalledTimes(1);
        expect(reg1.state2InitFn).toHaveBeenCalledTimes(1);
        expect(reg1.state3InitFn).toHaveBeenCalledTimes(1);
        expect(reg1.state4InitFn).toHaveBeenCalledTimes(1);
        expect(reg1.state5InitFn).toHaveBeenCalledTimes(1);
        expect(reg1.state1ProcessFn).toHaveBeenCalledTimes(1);
        expect(reg1.state2ProcessFn).toHaveBeenCalledTimes(0);
        expect(reg1.state3ProcessFn).toHaveBeenCalledTimes(0);
        expect(reg1.state4ProcessFn).toHaveBeenCalledTimes(0);
        expect(reg1.state5ProcessFn).toHaveBeenCalledTimes(0);



        // see if we can deserialize it back to state3
        const reg2 = {
            state1InitFn: jasmine.createSpy(),
            state2InitFn: jasmine.createSpy(),
            state3InitFn: jasmine.createSpy(),
            state4InitFn: jasmine.createSpy(),
            state5InitFn: jasmine.createSpy(),
            state1ProcessFn: jasmine.createSpy(),
            state2ProcessFn: jasmine.createSpy(),
            state3ProcessFn: jasmine.createSpy(),
            state4ProcessFn: jasmine.createSpy(),
            state5ProcessFn: jasmine.createSpy(),
        };
        const engine2 = buildEngine(reg2, serializedData);
        const serializedData2 = engine2.serializeData();
        const serializedDataJson2 = JSON.parse(serializedData2);
        expect(serializedDataJson2.args.ARG1).toEqual('VALUE1');
        expect(serializedDataJson2.status).toEqual('STARTED');
        expect(serializedDataJson2.previousState.name).toEqual('state1');
        expect(serializedDataJson2.currentState.name).toEqual('state3');
        expect(serializedDataJson2.initedStateNames).toEqual(['state1', 'state2', 'state3', 'state4', 'state5']);
        expect(reg2.state1InitFn).toHaveBeenCalledTimes(0);
        expect(reg2.state2InitFn).toHaveBeenCalledTimes(0);
        expect(reg2.state3InitFn).toHaveBeenCalledTimes(0);
        expect(reg2.state4InitFn).toHaveBeenCalledTimes(0);
        expect(reg2.state5InitFn).toHaveBeenCalledTimes(0);
        expect(reg2.state1ProcessFn).toHaveBeenCalledTimes(0);
        expect(reg2.state2ProcessFn).toHaveBeenCalledTimes(0);
        expect(reg2.state3ProcessFn).toHaveBeenCalledTimes(0);
        expect(reg2.state4ProcessFn).toHaveBeenCalledTimes(0);
        expect(reg2.state5ProcessFn).toHaveBeenCalledTimes(0);


        // see if we can now advance to state5 from the deserialized state3
        const r3 = await engine2.next({
            EVENT: 'xxx'
        });
        const serializedData3 = engine2.serializeData();
        const serializedDataJson3 = JSON.parse(serializedData3);
        expect(r3.end).toBeTrue();
        expect(r3.status).toBe('ENDED');
        expect(serializedDataJson3.args.ARG1).toEqual('VALUE1');
        expect(serializedDataJson3.args.EVENT).toEqual('xxx');
        expect(serializedDataJson3.status).toEqual('ENDED');
        expect(serializedDataJson3.previousState.name).toEqual('state3');
        expect(serializedDataJson3.currentState.name).toEqual('state5');
        expect(serializedDataJson3.initedStateNames).toEqual(['state1', 'state2', 'state3', 'state4', 'state5']);
        expect(reg2.state1InitFn).toHaveBeenCalledTimes(0);
        expect(reg2.state2InitFn).toHaveBeenCalledTimes(0);
        expect(reg2.state3InitFn).toHaveBeenCalledTimes(0);
        expect(reg2.state4InitFn).toHaveBeenCalledTimes(0);
        expect(reg2.state5InitFn).toHaveBeenCalledTimes(0);
        expect(reg2.state1ProcessFn).toHaveBeenCalledTimes(0);
        expect(reg2.state2ProcessFn).toHaveBeenCalledTimes(0);
        expect(reg2.state3ProcessFn).toHaveBeenCalledTimes(1);
        expect(reg2.state4ProcessFn).toHaveBeenCalledTimes(0);
        expect(reg2.state5ProcessFn).toHaveBeenCalledTimes(1);

    });

});