import {InternalEngine} from "../../src/engine-impl";
import {createState} from "../../src";

describe('test', () => {
    it('test 1', () => {

        const approval1Stage = createState('approval1Stage', async (arg) => {
            return '';
        });
        const approval2Stage = createState('approval2Stage', async (arg) => {
            return '';
        });
        const approval3Stage = createState('approval3Stage', async (arg) => {
            return '';
        });
        const engine = new InternalEngine()
            .startsWith(approval1Stage)
            .register(approval2Stage)
            .endsWith(approval3Stage)
            .init({})

    });
})