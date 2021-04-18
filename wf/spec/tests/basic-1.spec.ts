import {InternalEngine} from "../../src/engine-impl";
import {Argument, createEngine, createState, Engine} from '../../src';
import * as util from 'util';

describe('basic', () => {

    let engine: Engine;

    beforeEach(async () => {
        const approval1Stage = createState('approval1Stage', {
            initFn: async (arg) => {},
            processFn: async (prev, arg) => {
                return '*';
            },
        });
        const approval2Stage = createState('approval2Stage', {
            initFn: async (arg) => {},
            processFn: async (prev, arg) => {
                return '*';
            }
        });
        const approval3Stage = createState('approval3Stage', {
            initFn: async (arg) => {},
            processFn: async (prev, arg) => {
                return '*';
            }
        });


        // wire up all states' possible transitions
        approval1Stage.on().to(approval2Stage);
        approval2Stage.on().to(approval3Stage);

        // register all states with engine
        engine = new InternalEngine()
            .startsWith(approval1Stage)
            .register(approval2Stage)
            .endsWith(approval3Stage)
            .init({
                "ARG1": "VALUE1"
            });
    });


    it('test', async () => {

        const data1 = engine.serializeData();
        const dataJson1 = JSON.parse(data1);
        // console.log(dataJson1);

        expect(dataJson1.args.ARG1).toEqual('VALUE1');
        expect(dataJson1.status).toEqual('INIT');
        expect(dataJson1.previousState).toBeUndefined();
        expect(dataJson1.currentState.name).toEqual('approval1Stage');
        expect(dataJson1.initedStateNames).toEqual(['approval1Stage', 'approval2Stage', 'approval3Stage']);

        const r2 = await engine.next({
            "ARG2": "VALUE2"
        });

        const data2 = engine.serializeData();
        const dataJson2 = JSON.parse(data2);
        // console.log(dataJson2);

        expect(r2.status).toBe('STARTED');
        expect(r2.end).toBeFalse();
        expect(dataJson2.args.ARG1).toEqual('VALUE1');
        expect(dataJson2.args.ARG2).toEqual('VALUE2');
        expect(dataJson2.status).toEqual('STARTED');
        expect(dataJson2.previousState.name).toEqual('approval1Stage');
        expect(dataJson2.currentState.name).toEqual('approval2Stage');
        expect(dataJson2.initedStateNames).toEqual(['approval1Stage', 'approval2Stage', 'approval3Stage']);

        const r3 = await engine.next({
            "ARG3": "VALUE3"
        });
        const data3 = engine.serializeData();
        const dataJson3 = JSON.parse(data3);
        // console.log(data3Json);

        expect(r3.status).toBe('ENDED')
        expect(r3.end).toBeTrue();
        expect(dataJson3.args.ARG1).toEqual('VALUE1');
        expect(dataJson3.args.ARG2).toEqual('VALUE2');
        expect(dataJson3.args.ARG3).toEqual('VALUE3');
        expect(dataJson3.status).toEqual('ENDED');
        expect(dataJson3.previousState.name).toEqual('approval2Stage');
        expect(dataJson3.currentState.name).toEqual('approval3Stage');
        expect(dataJson3.initedStateNames).toEqual(['approval1Stage', 'approval2Stage', 'approval3Stage']);

        const r4 = await engine.next({
            "ARG4": "VALUE4"
        });
        const data4 = engine.serializeData();
        const dataJson4 = JSON.parse(data3);
        // console.log(dataJson4);

        expect(r4.status).toBe('ENDED');
        expect(r4.end).toBeTrue();
        expect(dataJson4.args.ARG1).toEqual('VALUE1');
        expect(dataJson4.args.ARG2).toEqual('VALUE2');
        expect(dataJson4.args.ARG3).toEqual('VALUE3');
        expect(dataJson4.args.ARG4).toBeUndefined();
        expect(dataJson4.status).toEqual('ENDED');
        expect(dataJson4.previousState.name).toEqual('approval2Stage');
        expect(dataJson4.currentState.name).toEqual('approval3Stage');
        expect(dataJson4.initedStateNames).toEqual(['approval1Stage', 'approval2Stage', 'approval3Stage']);
    });
});
