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

    // ==============
    // ==== DATE ====
    // ==============
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

    it(`compareDate lt`, () => {
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('12-12-2009', 'DD-MM-YYYY'), 'lt')).toBe(false)
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('13-12-2009', 'DD-MM-YYYY'), 'lt')).toBe(false)
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('11-12-2009', 'DD-MM-YYYY'), 'lt')).toBe(true)
    });

    it (`compareDate lte`, () => {
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('12-12-2009', 'DD-MM-YYYY'), 'lte')).toBe(true)
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('13-12-2009', 'DD-MM-YYYY'), 'lte')).toBe(false)
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('11-12-2009', 'DD-MM-YYYY'), 'lte')).toBe(true)
    });

    it (`compareDate not empty`, () => {
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('12-12-2009', 'DD-MM-YYYY'), 'not empty')).toBe(true)
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('13-12-2009', 'DD-MM-YYYY'), 'not empty')).toBe(true)
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('11-12-2009', 'DD-MM-YYYY'), 'not empty')).toBe(true)
    });

    it (`compareDate not eq`, () => {
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('12-12-2009', 'DD-MM-YYYY'), 'not eq')).toBe(false)
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('13-12-2009', 'DD-MM-YYYY'), 'not eq')).toBe(true)
    });

    it (`compareDate not gt`, () => {
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('12-12-2009', 'DD-MM-YYYY'), 'not gt')).toBe(true)
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('13-12-2009', 'DD-MM-YYYY'), 'not gt')).toBe(false)
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('11-12-2009', 'DD-MM-YYYY'), 'not gt')).toBe(true)
    });

    it (`compareDate not gte`, () => {
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('12-12-2009', 'DD-MM-YYYY'), 'not gte')).toBe(false)
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('13-12-2009', 'DD-MM-YYYY'), 'not gte')).toBe(false)
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('11-12-2009', 'DD-MM-YYYY'), 'not gte')).toBe(true)
    });

    it (`compareDate not lt`, () => {
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('12-12-2009', 'DD-MM-YYYY'), 'not lt')).toBe(true)
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('13-12-2009', 'DD-MM-YYYY'), 'not lt')).toBe(true)
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('11-12-2009', 'DD-MM-YYYY'), 'not lt')).toBe(false)
    });

    it (`compareDate not lte`, () => {
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('12-12-2009', 'DD-MM-YYYY'), 'not lte')).toBe(false)
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('13-12-2009', 'DD-MM-YYYY'), 'not lte')).toBe(true)
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('11-12-2009', 'DD-MM-YYYY'), 'not lte')).toBe(false)
    });

    it (`compareDate contain`, () => {
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('12-12-2009', 'DD-MM-YYYY'), 'contain')).toBe(true)
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('13-12-2009', 'DD-MM-YYYY'), 'contain')).toBe(false)
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('11-12-2009', 'DD-MM-YYYY'), 'contain')).toBe(false)
    });

    it (`compareDate not contain`, () => {
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('12-12-2009', 'DD-MM-YYYY'), 'not contain')).toBe(false)
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('13-12-2009', 'DD-MM-YYYY'), 'not contain')).toBe(true)
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('11-12-2009', 'DD-MM-YYYY'), 'not contain')).toBe(true)
    });

    // ===============
    // ==== Number ===
    // ===============

    it (`compareNumber empty`, () => { });
    it (`compareNumber eq`, () => {})
    it (`compareNumber gt`, () => {})
    it (`compareNumber gte`, () => {})
    it (`compareNumber lt`, () => {})
    it (`compareNumber lte`, () => {})
    it (`compareNumber not empty`, () => {})
    it (`compareNumber not eq`, () => {})
    it (`compareNumber not gt`, () => {})
    it (`compareNumber not gte`, () => {})
    it (`compareNumber not lt`, () => {})
    it (`compareNumber not lte`, () => {})
    it (`compareNumber contain`, () => {})
    it (`compareNumber not contain`, () => {})
    it (`compareNumber regexp`, () => {})

    // ================
    // === String =====
    // ================

    it (`compareString empty`, () => { });
    it (`compareString eq`, () => {})
    it (`compareString gt`, () => {})
    it (`compareString gte`, () => {})
    it (`compareString lt`, () => {})
    it (`compareString lte`, () => {})
    it (`compareString not empty`, () => {})
    it (`compareString not eq`, () => {})
    it (`compareString not gt`, () => {})
    it (`compareString not gte`, () => {})
    it (`compareString not lt`, () => {})
    it (`compareString not lte`, () => {})
    it (`compareString contain`, () => {})
    it (`compareString not contain`, () => {})
    it (`compareString regexp`, () => {})


    // ============================
    // ==== Currency =============
    // ============================

    it (`compareCurrency empty`, () => { });
    it (`compareCurrency eq`, () => {})
    it (`compareCurrency gt`, () => {})
    it (`compareCurrency gte`, () => {})
    it (`compareCurrency lt`, () => {})
    it (`compareCurrency lte`, () => {})
    it (`compareCurrency not empty`, () => {})
    it (`compareCurrency not eq`, () => {})
    it (`compareCurrency not gt`, () => {})
    it (`compareCurrency not gte`, () => {})
    it (`compareCurrency not lt`, () => {})
    it (`compareCurrency not lte`, () => {})
    it (`compareCurrency contain`, () => {})
    it (`compareCurrency not contain`, () => {})
    it (`compareCurrency regexp`, () => {})

});
