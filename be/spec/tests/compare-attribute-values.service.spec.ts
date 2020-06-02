import {convertToCm} from "../../src/service/compare-attribute-values.service";


describe(`compare-attribute-values.service.spec`, () => {

    it (`convertToCm`, () => {
        expect(convertToCm(1, 'm')).toBe(100);
        expect(convertToCm(1, 'mm')).toBe(0.1);
        expect(convertToCm(1, 'cm')).toBe(1);
    });

});