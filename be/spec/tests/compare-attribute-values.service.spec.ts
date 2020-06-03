import {
    compareDate,
    convertToCm,
    convertToCm2,
    convertToG,
    convertToMl
} from "../../src/service/compare-attribute-values.service";
import moment = require("moment");


describe(`compare-attribute-values.service.spec`, () => {

    it (`convertToCm`, () => {
        expect(convertToCm(1, 'm')).toBe(100);
        expect(convertToCm(1, 'mm')).toBe(0.1);
        expect(convertToCm(1, 'cm')).toBe(1);
    });


    it(`convertToG`, () => {
        expect(convertToG(1, 'kg')).toBe(1000);
        expect(convertToG(1, 'g')).toBe(1);
    });

    it(`convertToCm2`, () => {
        expect(convertToCm2(1, 'cm2')).toBe(1);
        expect(convertToCm2(1, 'm2')).toBe(10000);
        expect(convertToCm2(1, 'mm2')).toBe(100);
    });

    it(`convertToml`, () => {
        expect(convertToMl(1, 'ml')).toBe(1);
        expect(convertToMl(1, 'l')).toBe(1000);
    });

    it(`compareDate empty`, () => {
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('12-12-2009', 'DD-MM-YYYY'), 'empty')).toBe(false);
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), null, 'empty')).toBe(true);
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), undefined, 'empty')).toBe(true);
        expect(compareDate(null, moment('12-12-2009', 'DD-MM-YYYY'), 'empty')).toBe(false);
        expect(compareDate(undefined, moment('12-12-2009', 'DD-MM-YYYY'), 'empty')).toBe(false);
    });

    it(`compareDate eq`, () => {
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('12-12-2009', 'DD-MM-YYYY'), 'eq')).toBe(true)
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('13-12-2009', 'DD-MM-YYYY'), 'eq')).toBe(false)
    });

    it(`compareDate gt`, () => {
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('12-12-2009', 'DD-MM-YYYY'), 'gt')).toBe(false)
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('13-12-2009', 'DD-MM-YYYY'), 'gt')).toBe(true)
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('11-12-2009', 'DD-MM-YYYY'), 'gt')).toBe(false)
    });

    it(`compareDate gte`, () => {
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('12-12-2009', 'DD-MM-YYYY'), 'gte')).toBe(true)
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('13-12-2009', 'DD-MM-YYYY'), 'gte')).toBe(true)
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('11-12-2009', 'DD-MM-YYYY'), 'gte')).toBe(false)
    });
});
