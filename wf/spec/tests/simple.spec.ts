import {Argument, createEngine, createState, EngineResponse, State} from "../../src";
import {InternalEngine} from "../../src/engine-impl";

describe('simple', () => {
    it('test #1', async () => {
        /**
         *     <start> -> step1 -> step2 -> step3 -> <end>
         */
        const state1 = createState(`step1`, (args) => Promise.resolve(`e1`));
        const state2 = createState(`step2`, (args) => Promise.resolve(`e2`));
        const state3 = createState(`step3`, (args) => Promise.resolve(`e3`));
        const state4 = createState(`step4`, (args) => Promise.resolve(`e4`));
        const state5 = createState(`step5`, (args) => Promise.resolve(`e5`));

        state1.on().to(state2);
        state2.on().to(state3);
        state3.on().to(state4);
        state4.on().to(state5);

        const engine = createEngine()
            .startsWith(state1)
            .register(state2)
            .register(state3)
            .register(state4)
            .endsWith(state5)
            .init({} as Argument)
        ;

        while(!(await engine.next()).end) {}
    });

    it('test #2', async () => {
        /**
         *  <start> -> step1  +-(event1)->  step2 +-> step5 -> <end>
         *                    \-(event3)->  step3 +
         *                    \-(*)------>  step4 +
         */
        const state1 = createState(`step1`, (args) => Promise.resolve('e1'));
        const state2 = createState(`step2`, (args) => Promise.resolve('e2'));
        const state3 = createState(`step3`, (args) => Promise.resolve('e3'));
        const state4 = createState(`step4`, (args) => Promise.resolve('e4'));
        const state5 = createState(`step5`, (args) => Promise.resolve('e5'));

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

        while(!(await engine.next()).end) {}
    });

    fit('test #3', async () => {
        const state1 = createState(`step1`, (args) => Promise.resolve(`e1`));
        const state2 = createState(`step2`, (args) => Promise.resolve(`e2`));
        const state3 = createState(`step3`, (args) => Promise.resolve(`e3`));
        const state4 = createState(`step4`, (args) => Promise.resolve(`e4`));
        const state5 = createState(`step5`, (args) => Promise.resolve(`e5`));

        state1.on().to(state2);
        state2.on().to(state3);
        state3.on().to(state4);
        state4.on().to(state5);

        const engine = createEngine()
            .startsWith(state1)
            .register(state2)
            .register(state3)
            .register(state4)
            .endsWith(state5)
            .init({} as Argument)
        ;


        const _engine: InternalEngine = engine as InternalEngine;
        
        {   // initial
            console.log('***** initial ******');
            const data: string = _engine.serialize();
            console.log('data', data);
            engine.deserialize(data);
            console.log('startState', _engine.startState?.name);
            console.log('states', _engine.states.map((s: State) => s.name));
            console.log('endState', _engine.endState?.name);
            console.log('args', _engine.args);
            console.log('stateMap', _engine.stateMap.keys());
            console.log('status', _engine.status);
            console.log('currentState', _engine.currentState?.name);
        }
        
        {   // step 1
            console.log('***** step 1 ******');
            const r: EngineResponse = await engine.next();
            const data: string = _engine.serialize();
            console.log('data', data);
            engine.deserialize(data);
            console.log('startState', _engine.startState?.name);
            console.log('states', _engine.states.map((s: State) => s.name));
            console.log('endState', _engine.endState?.name);
            console.log('args', _engine.args);
            console.log('stateMap', _engine.stateMap.keys());
            console.log('status', _engine.status);
            console.log('currentState', _engine.currentState?.name);
        }
        
        {   // step 2
            console.log('***** step 2 ******');
            const r: EngineResponse = await engine.next();
            const data: string = _engine.serialize();
            console.log('data', data);
            engine.deserialize(data);
            console.log('startState', _engine.startState?.name);
            console.log('states', _engine.states.map((s: State) => s.name));
            console.log('endState', _engine.endState?.name);
            console.log('args', _engine.args);
            console.log('stateMap', _engine.stateMap.keys());
            console.log('status', _engine.status);
            console.log('currentState', _engine.currentState?.name);
        }


        {   // step 3
            console.log('***** step 3 ******');
            const r: EngineResponse = await engine.next();
            const data: string = _engine.serialize();
            console.log('data', data);
            engine.deserialize(data);
            console.log('startState', _engine.startState?.name);
            console.log('states', _engine.states.map((s: State) => s.name));
            console.log('endState', _engine.endState?.name);
            console.log('args', _engine.args);
            console.log('stateMap', _engine.stateMap.keys());
            console.log('status', _engine.status);
            console.log('currentState', _engine.currentState?.name);
        }

        {   // step 4
            console.log('***** step 4 ******');
            const r: EngineResponse = await engine.next();
            const data: string = _engine.serialize();
            console.log('data', data);
            engine.deserialize(data);
            console.log('startState', _engine.startState?.name);
            console.log('states', _engine.states.map((s: State) => s.name));
            console.log('endState', _engine.endState?.name);
            console.log('args', _engine.args);
            console.log('stateMap', _engine.stateMap.keys());
            console.log('status', _engine.status);
            console.log('currentState', _engine.currentState?.name);
        }

        {   // step 5
            console.log('***** step 5 ******');
            const r: EngineResponse = await engine.next();
            const data: string = _engine.serialize();
            console.log('data', data);
            engine.deserialize(data);
            console.log('startState', _engine.startState?.name);
            console.log('states', _engine.states.map((s: State) => s.name));
            console.log('endState', _engine.endState?.name);
            console.log('args', _engine.args);
            console.log('stateMap', _engine.stateMap.keys());
            console.log('status', _engine.status);
            console.log('currentState', _engine.currentState?.name);
        }
    });
});
