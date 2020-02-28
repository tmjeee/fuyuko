
import {Argument} from "./engine-interface";
import {createEngine, createState} from "./engine-utils";

console.log('test');
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
