import {
    compareArea,
    compareCurrency,
    compareDate, compareDimension, compareNumber, compareString, compareVolume, compareWidth,
    convertToCm,
    convertToCm2,
    convertToG,
    convertToMl
} from "../../src/service/compare-attribute-values.service";
import moment = require("moment");


describe(`compare-attribute-values.service.spec`, () => {
    it(`convertToCm`, () => {
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
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('12-12-2009', 'DD-MM-YYYY'), 'eq')).toBe(true);
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('13-12-2009', 'DD-MM-YYYY'), 'eq')).toBe(false);
    });
    it(`compareDate gt`, () => {
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('12-12-2009', 'DD-MM-YYYY'), 'gt')).toBe(false);
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('13-12-2009', 'DD-MM-YYYY'), 'gt')).toBe(true);
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('11-12-2009', 'DD-MM-YYYY'), 'gt')).toBe(false);
    });
    it(`compareDate gte`, () => {
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('12-12-2009', 'DD-MM-YYYY'), 'gte')).toBe(true);
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('13-12-2009', 'DD-MM-YYYY'), 'gte')).toBe(true);
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('11-12-2009', 'DD-MM-YYYY'), 'gte')).toBe(false);
    });
    it(`compareDate lt`, () => {
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('12-12-2009', 'DD-MM-YYYY'), 'lt')).toBe(false);
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('13-12-2009', 'DD-MM-YYYY'), 'lt')).toBe(false);
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('11-12-2009', 'DD-MM-YYYY'), 'lt')).toBe(true);
    });
    it(`compareDate lte`, () => {
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('12-12-2009', 'DD-MM-YYYY'), 'lte')).toBe(true);
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('13-12-2009', 'DD-MM-YYYY'), 'lte')).toBe(false);
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('11-12-2009', 'DD-MM-YYYY'), 'lte')).toBe(true);
    });
    it(`compareDate not empty`, () => {
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('12-12-2009', 'DD-MM-YYYY'), 'not empty')).toBe(true);
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('13-12-2009', 'DD-MM-YYYY'), 'not empty')).toBe(true);
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('11-12-2009', 'DD-MM-YYYY'), 'not empty')).toBe(true);
    });
    it(`compareDate not eq`, () => {
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('12-12-2009', 'DD-MM-YYYY'), 'not eq')).toBe(false);
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('13-12-2009', 'DD-MM-YYYY'), 'not eq')).toBe(true);
    });
    it(`compareDate not gt`, () => {
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('12-12-2009', 'DD-MM-YYYY'), 'not gt')).toBe(true);
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('13-12-2009', 'DD-MM-YYYY'), 'not gt')).toBe(false);
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('11-12-2009', 'DD-MM-YYYY'), 'not gt')).toBe(true);
    });
    it(`compareDate not gte`, () => {
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('12-12-2009', 'DD-MM-YYYY'), 'not gte')).toBe(false);
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('13-12-2009', 'DD-MM-YYYY'), 'not gte')).toBe(false);
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('11-12-2009', 'DD-MM-YYYY'), 'not gte')).toBe(true);
    });
    it(`compareDate not lt`, () => {
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('12-12-2009', 'DD-MM-YYYY'), 'not lt')).toBe(true);
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('13-12-2009', 'DD-MM-YYYY'), 'not lt')).toBe(true);
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('11-12-2009', 'DD-MM-YYYY'), 'not lt')).toBe(false);
    });
    it(`compareDate not lte`, () => {
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('12-12-2009', 'DD-MM-YYYY'), 'not lte')).toBe(false);
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('13-12-2009', 'DD-MM-YYYY'), 'not lte')).toBe(true);
        expect(compareDate(moment('12-12-2009', 'DD-MM-YYYY'), moment('11-12-2009', 'DD-MM-YYYY'), 'not lte')).toBe(false);
    });
    // ===============
    // ==== Number ===
    // ===============
    it(`compareNumber empty`, () => {
        expect(compareNumber(1, 2, 'empty')).toBe(false);
        expect(compareNumber(1, null, 'empty')).toBe(true);
        expect(compareNumber(1, undefined, 'empty')).toBe(true);
        expect(compareNumber(null, null, 'empty')).toBe(true);
        expect(compareNumber(undefined, undefined, 'empty')).toBe(true);
    });
    it(`compareNumber eq`, () => {
        expect(compareNumber(1, 1, 'eq')).toBe(true);
        expect(compareNumber(1, 2, 'eq')).toBe(false);
        expect(compareNumber(2, 1, 'eq')).toBe(false);
    });
    it(`compareNumber gt`, () => {
        expect(compareNumber(1, 1, 'gt')).toBe(false);
        expect(compareNumber(1, 2, 'gt')).toBe(true);
        expect(compareNumber(2, 1, 'gt')).toBe(false);
    });
    it(`compareNumber gte`, () => {
        expect(compareNumber(1, 1, 'gte')).toBe(true);
        expect(compareNumber(1, 2, 'gte')).toBe(true);
        expect(compareNumber(2, 1, 'gte')).toBe(false);
    });
    it(`compareNumber lt`, () => {
        expect(compareNumber(1, 1, 'lt')).toBe(false);
        expect(compareNumber(1, 2, 'lt')).toBe(false);
        expect(compareNumber(2, 1, 'lt')).toBe(true);
    });
    it(`compareNumber lte`, () => {
        expect(compareNumber(1, 1, 'lte')).toBe(true);
        expect(compareNumber(1, 2, 'lte')).toBe(false);
        expect(compareNumber(2, 1, 'lte')).toBe(true);
    });
    it(`compareNumber not empty`, () => {
        expect(compareNumber(1, null, 'not empty')).toBe(false);
        expect(compareNumber(1, undefined, 'not empty')).toBe(false);
        expect(compareNumber(null, 1, 'not empty')).toBe(true);
        expect(compareNumber(undefined, 1, 'not empty')).toBe(true);
    });
    it(`compareNumber not eq`, () => {
        expect(compareNumber(1, 1, 'not eq')).toBe(false);
        expect(compareNumber(1, 2, 'not eq')).toBe(true);
        expect(compareNumber(2, 1, 'not eq')).toBe(true);
    });
    it(`compareNumber not gt`, () => {
        expect(compareNumber(1, 1, 'not gt')).toBe(true);
        expect(compareNumber(1, 2, 'not gt')).toBe(false);
        expect(compareNumber(2, 1, 'not gt')).toBe(true);
    });
    it(`compareNumber not gte`, () => {
        expect(compareNumber(1, 1, 'not gte')).toBe(false);
        expect(compareNumber(1, 2, 'not gte')).toBe(false);
        expect(compareNumber(2, 1, 'not gte')).toBe(true);
    });
    it(`compareNumber not lt`, () => {
        expect(compareNumber(1, 1, 'not lt')).toBe(true);
        expect(compareNumber(1, 2, 'not lt')).toBe(true);
        expect(compareNumber(2, 1, 'not lt')).toBe(false);
    });
    it(`compareNumber not lte`, () => {
        expect(compareNumber(1, 1, 'not lte')).toBe(false);
        expect(compareNumber(1, 2, 'not lte')).toBe(true);
        expect(compareNumber(2, 1, 'not lte')).toBe(false);
    });
    // ================
    // === String =====
    // ================
    it(`compareString empty`, () => {
        expect(compareString('asd', '', 'empty')).toBe(true);
        expect(compareString('asd', 'asd', 'empty')).toBe(false);
        expect(compareString('asd', null, 'empty')).toBe(true);
        expect(compareString('asd', undefined, 'empty')).toBe(true);
        expect(compareString('', 'asd', 'empty')).toBe(false);
        expect(compareString('asd', 'asd', 'empty')).toBe(false);
        expect(compareString(null, 'asd', 'empty')).toBe(false);
        expect(compareString(undefined, 'asd', 'empty')).toBe(false);
    });
    it(`compareString not empty`, () => {
        expect(compareString('asd', '', 'not empty')).toBe(false);
        expect(compareString('asd', 'asd', 'not empty')).toBe(true);
        expect(compareString('asd', null, 'not empty')).toBe(false);
        expect(compareString('asd', undefined, 'not empty')).toBe(false);
        expect(compareString('', 'asd', 'not empty')).toBe(true);
        expect(compareString('asd', 'asd', 'not empty')).toBe(true);
        expect(compareString(null, 'asd', 'not empty')).toBe(true);
        expect(compareString(undefined, 'asd', 'not empty')).toBe(true);
    });
    it(`compareString eq`, () => {
        expect(compareString('asd', 'asd', 'eq')).toBe(true);
        expect(compareString('asd', 'qwe', 'eq')).toBe(false);
        expect(compareString('', '', 'eq')).toBe(true);
        expect(compareString(undefined, 'asd', 'eq')).toBe(false);
        expect(compareString('asd', undefined, 'eq')).toBe(false);
        expect(compareString(null, 'asd', 'eq')).toBe(false);
        expect(compareString('asd', null, 'eq')).toBe(false);
    });
    it(`compareString not eq`, () => {
        expect(compareString('asd', 'asd', 'not eq')).toBe(false);
        expect(compareString('asd', 'qwe', 'not eq')).toBe(true);
        expect(compareString('', '', 'not eq')).toBe(false);
        expect(compareString(undefined, 'asd', 'not eq')).toBe(true);
        expect(compareString('asd', undefined, 'not eq')).toBe(true);
        expect(compareString(null, 'asd', 'not eq')).toBe(true);
        expect(compareString('asd', null, 'not eq')).toBe(true);
    });
    it(`compareString contain`, () => {
        expect(compareString('asd', 'asd', 'contain')).toBe(true);
        expect(compareString('asd', 'asdxxxxx', 'contain')).toBe(true);
        expect(compareString('asd', 'qweqwe', 'contain')).toBe(false);
        expect(compareString('asd', undefined, 'contain')).toBe(false);
        expect(compareString('asd', null, 'contain')).toBe(false);
        expect(compareString(null, 'asd', 'contain')).toBe(false);
        expect(compareString(undefined, 'asd', 'contain')).toBe(false);
    });
    it(`compareString not contain`, () => {
        expect(compareString('asd', 'asd', 'not contain')).toBe(false);
        expect(compareString('asd', 'asdxxxxx', 'not contain')).toBe(false);
        expect(compareString('asd', 'qweqwe', 'not contain')).toBe(true);
        expect(compareString('asd', undefined, 'not contain')).toBe(false);
        expect(compareString('asd', null, 'not contain')).toBe(false);
        expect(compareString(null, 'asd', 'not contain')).toBe(true);
        expect(compareString(undefined, 'asd', 'not contain')).toBe(true);
    });
    it(`compareString regexp`, () => {
        expect(compareString('[x]', 'asd', 'regexp')).toBe(false);
        expect(compareString('[x]', 'asdxxxxx', 'regexp')).toBe(true);
    });
    // ============================
    // ==== Currency =============
    // ============================
    it(`compareCurrency empty`, () => {
        expect(compareCurrency(1.10, 'MYR', 1.10, 'AUD', 'empty')).toBe(false);
        expect(compareCurrency(1.10, 'AUD', 1.10, 'AUD', 'empty')).toBe(false);
        expect(compareCurrency(1.10, 'AUD', 0, 'AUD', 'empty')).toBe(true);
        expect(compareCurrency(1.10, 'AUD', null, 'AUD', 'empty')).toBe(true);
        expect(compareCurrency(1.10, 'AUD', undefined, 'AUD', 'empty')).toBe(true);
        expect(compareCurrency(0, 'AUD', 1.10, 'AUD', 'empty')).toBe(false);
        expect(compareCurrency(null, 'AUD', 1.10, 'AUD', 'empty')).toBe(false);
        expect(compareCurrency(undefined, 'AUD', 1.10, 'AUD', 'empty')).toBe(false);
    });
    it(`compareCurrency not empty`, () => {
        expect(compareCurrency(1.10, 'MYR', 1.10, 'AUD', 'not empty')).toBe(true);
        expect(compareCurrency(1.10, 'AUD', 1.10, 'AUD', 'not empty')).toBe(true);
        expect(compareCurrency(1.10, 'AUD', 0, 'AUD', 'not empty')).toBe(false);
        expect(compareCurrency(1.10, 'AUD', null, 'AUD', 'not empty')).toBe(false);
        expect(compareCurrency(1.10, 'AUD', undefined, 'AUD', 'not empty')).toBe(false);
        expect(compareCurrency(0, 'AUD', 1.10, 'AUD', 'not empty')).toBe(true);
        expect(compareCurrency(null, 'AUD', 1.10, 'AUD', 'not empty')).toBe(true);
        expect(compareCurrency(undefined, 'AUD', 1.10, 'AUD', 'not empty')).toBe(true);
    });
    it(`compareCurrency eq`, () => {
        expect(compareCurrency(1.10, 'MYR', 1.10, 'AUD', 'eq')).toBe(false);
        expect(compareCurrency(1.10, 'AUD', 1.10, 'AUD', 'eq')).toBe(true);
        expect(compareCurrency(1.11, 'AUD', 1.10, 'AUD', 'eq')).toBe(false);
    });
    it(`compareCurrency not eq`, () => {
        expect(compareCurrency(1.10, 'MYR', 1.10, 'AUD', 'not eq')).toBe(false);
        expect(compareCurrency(1.10, 'AUD', 1.10, 'AUD', 'not eq')).toBe(false);
        expect(compareCurrency(1.11, 'AUD', 1.10, 'AUD', 'not eq')).toBe(true);
    });
    it(`compareCurrency gt`, () => {
        expect(compareCurrency(1.10, 'MYR', 1.10, 'AUD', 'gt')).toBe(false);
        expect(compareCurrency(1.10, 'AUD', 1.10, 'AUD', 'gt')).toBe(false);
        expect(compareCurrency(1.11, 'AUD', 1.10, 'AUD', 'gt')).toBe(false);
        expect(compareCurrency(1.10, 'AUD', 1.11, 'AUD', 'gt')).toBe(true);
    });
    it(`compareCurrency not gt`, () => {
        expect(compareCurrency(1.10, 'MYR', 1.10, 'AUD', 'not gt')).toBe(false);
        expect(compareCurrency(1.10, 'AUD', 1.10, 'AUD', 'not gt')).toBe(true);
        expect(compareCurrency(1.11, 'AUD', 1.10, 'AUD', 'not gt')).toBe(true);
        expect(compareCurrency(1.10, 'AUD', 1.11, 'AUD', 'not gt')).toBe(false);
    });
    it(`compareCurrency gte`, () => {
        expect(compareCurrency(1.10, 'MYR', 1.10, 'AUD', 'gte')).toBe(false);
        expect(compareCurrency(1.10, 'AUD', 1.10, 'AUD', 'gte')).toBe(true);
        expect(compareCurrency(1.11, 'AUD', 1.10, 'AUD', 'gte')).toBe(false);
        expect(compareCurrency(1.10, 'AUD', 1.11, 'AUD', 'gte')).toBe(true);
    });
    it(`compareCurrency not gte`, () => {
        expect(compareCurrency(1.10, 'MYR', 1.10, 'AUD', 'not gte')).toBe(false);
        expect(compareCurrency(1.10, 'AUD', 1.10, 'AUD', 'not gte')).toBe(false);
        expect(compareCurrency(1.11, 'AUD', 1.10, 'AUD', 'not gte')).toBe(true);
        expect(compareCurrency(1.10, 'AUD', 1.11, 'AUD', 'not gte')).toBe(false);
    });
    it(`compareCurrency lt`, () => {
        expect(compareCurrency(1.10, 'MYR', 1.10, 'AUD', 'lt')).toBe(false);
        expect(compareCurrency(1.10, 'AUD', 1.10, 'AUD', 'lt')).toBe(false);
        expect(compareCurrency(1.11, 'AUD', 1.10, 'AUD', 'lt')).toBe(true);
        expect(compareCurrency(1.10, 'AUD', 1.11, 'AUD', 'lt')).toBe(false);
    });
    it(`compareCurrency not lt`, () => {
        expect(compareCurrency(1.10, 'MYR', 1.10, 'AUD', 'not lt')).toBe(false);
        expect(compareCurrency(1.10, 'AUD', 1.10, 'AUD', 'not lt')).toBe(true);
        expect(compareCurrency(1.11, 'AUD', 1.10, 'AUD', 'not lt')).toBe(false);
        expect(compareCurrency(1.10, 'AUD', 1.11, 'AUD', 'not lt')).toBe(true);
    });
    it(`compareCurrency lte`, () => {
        expect(compareCurrency(1.10, 'MYR', 1.10, 'AUD', 'lte')).toBe(false);
        expect(compareCurrency(1.10, 'AUD', 1.10, 'AUD', 'lte')).toBe(true);
        expect(compareCurrency(1.11, 'AUD', 1.10, 'AUD', 'lte')).toBe(true);
        expect(compareCurrency(1.10, 'AUD', 1.11, 'AUD', 'lte')).toBe(false);
    });
    it(`compareCurrency not lte`, () => {
        expect(compareCurrency(1.10, 'MYR', 1.10, 'AUD', 'not lte')).toBe(false);
        expect(compareCurrency(1.10, 'AUD', 1.10, 'AUD', 'not lte')).toBe(false);
        expect(compareCurrency(1.11, 'AUD', 1.10, 'AUD', 'not lte')).toBe(false);
        expect(compareCurrency(1.10, 'AUD', 1.11, 'AUD', 'not lte')).toBe(true);
    });
    // ==============
    // === Volume ===
    // ==============
    it(`compareVolume empty`, () => {
        expect(compareVolume(1.1, 'ml', 1.1, 'ml', 'empty')).toBe(false);
        expect(compareVolume(1.1, 'ml', 1.2, 'l', 'empty')).toBe(false);
        expect(compareVolume(1.1, 'ml', undefined, 'ml', 'empty')).toBe(true);
        expect(compareVolume(1.1, 'ml', null, 'ml', 'empty')).toBe(true);
    });
    it(`compareVolume not empty`, () => {
        expect(compareVolume(1.1, 'ml', 1.1, 'ml', 'not empty')).toBe(true);
        expect(compareVolume(1.1, 'ml', 1.2, 'l', 'not empty')).toBe(true);
        expect(compareVolume(1.1, 'ml', undefined, 'ml', 'not empty')).toBe(false);
        expect(compareVolume(1.1, 'ml', null, 'ml', 'not empty')).toBe(false);
    });
    it(`compareVolume eq`, () => {
        expect(compareVolume(1.1, 'ml', 1.1, 'ml', 'eq')).toBe(true);
        expect(compareVolume(1.1, 'ml', 1.2, 'ml', 'eq')).toBe(false);
        expect(compareVolume(1.1, 'l', 1100, 'ml', 'eq')).toBe(true);
        expect(compareVolume(1.1, 'l', 1100, 'l', 'eq')).toBe(false);
    });
    it(`compareVolume not eq`, () => {
        expect(compareVolume(1.1, 'ml', 1.1, 'ml', 'not eq')).toBe(false);
        expect(compareVolume(1.1, 'ml', 1.2, 'ml', 'not eq')).toBe(true);
        expect(compareVolume(1.1, 'l', 1100, 'ml', 'not eq')).toBe(false);
        expect(compareVolume(1.1, 'l', 1100, 'l', 'not eq')).toBe(true);
    });
    it(`compareVolume gt`, () => {
        expect(compareVolume(1.1, 'ml', 1.1, 'ml', 'gt')).toBe(false);
        expect(compareVolume(1.1, 'ml', 1.2, 'ml', 'gt')).toBe(true);
        expect(compareVolume(1.2, 'ml', 1.1, 'ml', 'gt')).toBe(false);
        expect(compareVolume(1.1, 'l', 1100, 'ml', 'gt')).toBe(false);
        expect(compareVolume(1.1, 'l', 1100, 'l', 'gt')).toBe(true);
    });
    it(`compareVolume not gt`, () => {
        expect(compareVolume(1.1, 'ml', 1.1, 'ml', 'not gt')).toBe(true);
        expect(compareVolume(1.1, 'ml', 1.2, 'ml', 'not gt')).toBe(false);
        expect(compareVolume(1.2, 'ml', 1.1, 'ml', 'not gt')).toBe(true);
        expect(compareVolume(1.1, 'l', 1100, 'ml', 'not gt')).toBe(true);
        expect(compareVolume(1.1, 'l', 1100, 'l', 'not gt')).toBe(false);
    });
    it(`compareVolume gte`, () => {
        expect(compareVolume(1.1, 'ml', 1.1, 'ml', 'gte')).toBe(true);
        expect(compareVolume(1.1, 'ml', 1.2, 'ml', 'gte')).toBe(true);
        expect(compareVolume(1.2, 'ml', 1.1, 'ml', 'gte')).toBe(false);
        expect(compareVolume(1.1, 'l', 1100, 'ml', 'gte')).toBe(true);
        expect(compareVolume(1.1, 'l', 1100, 'l', 'gte')).toBe(true);
    });
    it(`compareVolume not gte`, () => {
        expect(compareVolume(1.1, 'ml', 1.1, 'ml', 'not gte')).toBe(false);
        expect(compareVolume(1.1, 'ml', 1.2, 'ml', 'not gte')).toBe(false);
        expect(compareVolume(1.2, 'ml', 1.1, 'ml', 'not gte')).toBe(true);
        expect(compareVolume(1.1, 'l', 1100, 'ml', 'not gte')).toBe(false);
        expect(compareVolume(1.1, 'l', 1100, 'l', 'not gte')).toBe(false);
    });
    it(`compareVolume lt`, () => {
        expect(compareVolume(1.1, 'ml', 1.1, 'ml', 'lt')).toBe(false);
        expect(compareVolume(1.1, 'ml', 1.2, 'ml', 'lt')).toBe(false);
        expect(compareVolume(1.2, 'ml', 1.1, 'ml', 'lt')).toBe(true);
        expect(compareVolume(1.1, 'l', 1100, 'ml', 'lt')).toBe(false);
        expect(compareVolume(1.1, 'l', 1100, 'l', 'lt')).toBe(false);
    });
    it(`compareVolume not lt`, () => {
        expect(compareVolume(1.1, 'ml', 1.1, 'ml', 'not lt')).toBe(true);
        expect(compareVolume(1.1, 'ml', 1.2, 'ml', 'not lt')).toBe(true);
        expect(compareVolume(1.2, 'ml', 1.1, 'ml', 'not lt')).toBe(false);
        expect(compareVolume(1.1, 'l', 1100, 'ml', 'not lt')).toBe(true);
        expect(compareVolume(1.1, 'l', 1100, 'l', 'not lt')).toBe(true);
    });
    it(`compareVolume lte`, () => {
        expect(compareVolume(1.1, 'ml', 1.1, 'ml', 'lte')).toBe(true);
        expect(compareVolume(1.1, 'ml', 1.2, 'ml', 'lte')).toBe(false);
        expect(compareVolume(1.2, 'ml', 1.1, 'ml', 'lte')).toBe(true);
        expect(compareVolume(1.1, 'l', 1100, 'ml', 'lte')).toBe(true);
        expect(compareVolume(1.1, 'l', 1100, 'l', 'lte')).toBe(false);
    });
    it(`compareVolume not lte`, () => {
        expect(compareVolume(1.1, 'ml', 1.1, 'ml', 'not lte')).toBe(false);
        expect(compareVolume(1.1, 'ml', 1.2, 'ml', 'not lte')).toBe(true);
        expect(compareVolume(1.2, 'ml', 1.1, 'ml', 'not lte')).toBe(false);
        expect(compareVolume(1.1, 'l', 1100, 'ml', 'not lte')).toBe(false);
        expect(compareVolume(1.1, 'l', 1100, 'l', 'not lte')).toBe(true);
    });
    // =================
    // === Dimension ===
    // =================
    it(`compareDimension empty`, () => {
        expect(compareDimension(1.1, 1.1, 1.1, 'cm', 1.1, 1.1, 1.1, 'cm', 'empty')).toBe(false);
        expect(compareDimension(1.1, 1.1, 1.1, 'cm', undefined, 1.1, 1.1, 'cm', 'empty')).toBe(false);
        expect(compareDimension(1.1, 1.1, 1.1, 'cm', 1.1, undefined, 1.1, 'cm', 'empty')).toBe(false);
        expect(compareDimension(1.1, 1.1, 1.1, 'cm', 1.1, 1.1, undefined, 'cm', 'empty')).toBe(false);
        expect(compareDimension(1.1, 1.1, 1.1, 'cm', undefined, undefined, undefined, 'cm', 'empty')).toBe(true);

        expect(compareDimension(undefined, 1.1, 1.1, 'cm', 1.1, 1.1, 1.1, 'cm', 'empty')).toBe(false);
        expect(compareDimension(undefined, 1.1, 1.1, 'cm', undefined, 1.1, 1.1, 'cm', 'empty')).toBe(false);
        expect(compareDimension(1.1, undefined, 1.1, 'cm', 1.1, undefined, 1.1, 'cm', 'empty')).toBe(false);
        expect(compareDimension(1.1, 1.1, undefined, 'cm', 1.1, 1.1, undefined, 'cm', 'empty')).toBe(false);
        expect(compareDimension(undefined, undefined, undefined, 'cm', undefined, undefined, undefined, 'cm', 'empty')).toBe(true);
    });
    it(`compareDimension not empty`, () => {
        expect(compareDimension(1.1, 1.1, 1.1, 'cm', 1.1, 1.1, 1.1, 'cm', 'not empty')).toBe(true);
        expect(compareDimension(1.1, 1.1, 1.1, 'cm', undefined, 1.1, 1.1, 'cm', 'not empty')).toBe(false);
        expect(compareDimension(1.1, 1.1, 1.1, 'cm', 1.1, undefined, 1.1, 'cm', 'not empty')).toBe(false);
        expect(compareDimension(1.1, 1.1, 1.1, 'cm', 1.1, 1.1, undefined, 'cm', 'not empty')).toBe(false);
        expect(compareDimension(1.1, 1.1, 1.1, 'cm', undefined, undefined, undefined, 'cm', 'not empty')).toBe(false);

        expect(compareDimension(undefined, 1.1, 1.1, 'cm', 1.1, 1.1, 1.1, 'cm', 'not empty')).toBe(true);
        expect(compareDimension(undefined, 1.1, 1.1, 'cm', undefined, 1.1, 1.1, 'cm', 'not empty')).toBe(false);
        expect(compareDimension(1.1, undefined, 1.1, 'cm', 1.1, undefined, 1.1, 'cm', 'not empty')).toBe(false);
        expect(compareDimension(1.1, 1.1, undefined, 'cm', 1.1, 1.1, undefined, 'cm', 'not empty')).toBe(false);
        expect(compareDimension(undefined, undefined, undefined, 'cm', undefined, undefined, undefined, 'cm', 'not empty')).toBe(false);
    });
    it(`compareDimension eq`, () => {
        expect(compareDimension(1.1, 1.1, 1.1, 'cm', 1.1, 1.1, 1.1, 'cm', 'eq')).toBe(true);
        expect(compareDimension(1.1, 1.1, 1.1, 'cm', 1.1, 1.1, 1.2, 'cm', 'eq')).toBe(false);
        expect(compareDimension(1.1, 1.1, 1.1, 'm', 110, 110, 110, 'cm', 'eq')).toBe(true);
        expect(compareDimension(1.1, 1.1, 1.1, 'm', 210, 110, 110, 'cm', 'eq')).toBe(false);
    });
    it(`compareDimension not eq`, () => {
        expect(compareDimension(1.1, 1.1, 1.1, 'cm', 1.1, 1.1, 1.1, 'cm', 'not eq')).toBe(false);
        expect(compareDimension(1.1, 1.1, 1.1, 'cm', 1.1, 1.1, 1.2, 'cm', 'not eq')).toBe(true);
        expect(compareDimension(1.1, 1.1, 1.1, 'm', 110, 110, 110, 'cm', 'not eq')).toBe(false);
        expect(compareDimension(1.1, 1.1, 1.1, 'm', 210, 110, 110, 'cm', 'not eq')).toBe(true);
    });
    it(`compareDimension gt`, () => {
        expect(compareDimension(1.1, 1.1, 1.1, 'cm', 1.1, 1.1, 1.1, 'cm', 'gt')).toBe(false);
        expect(compareDimension(1.1, 1.1, 1.1, 'cm', 1.2, 1.2, 1.2, 'cm', 'gt')).toBe(true);
        expect(compareDimension(1.1, 1.1, 1.1, 'cm', 1.1, 1.1, 1.2, 'cm', 'gt')).toBe(false);
        expect(compareDimension(1.1, 1.1, 1.1, 'm', 110, 110, 110, 'cm', 'gt')).toBe(false);
        expect(compareDimension(1.1, 1.1, 1.1, 'm', 210, 210, 210, 'cm', 'gt')).toBe(true);
        expect(compareDimension(1.1, 1.1, 1.1, 'm', 210, 110, 110, 'cm', 'gt')).toBe(false);
    });
    it(`compareDimension not gt`, () => {
        expect(compareDimension(1.1, 1.1, 1.1, 'cm', 1.1, 1.1, 1.1, 'cm', 'not gt')).toBe(true);
        expect(compareDimension(1.1, 1.1, 1.1, 'cm', 1.2, 1.2, 1.2, 'cm', 'not gt')).toBe(false);
        expect(compareDimension(1.1, 1.1, 1.1, 'cm', 1.1, 1.1, 1.2, 'cm', 'not gt')).toBe(true);
        expect(compareDimension(1.1, 1.1, 1.1, 'm', 110, 110, 110, 'cm', 'not gt')).toBe(true);
        expect(compareDimension(1.1, 1.1, 1.1, 'm', 210, 210, 210, 'cm', 'not gt')).toBe(false);
        expect(compareDimension(1.1, 1.1, 1.1, 'm', 210, 110, 110, 'cm', 'not gt')).toBe(true);
    });
    it(`compareDimension gte`, () => {
        expect(compareDimension(1.1, 1.1, 1.1, 'cm', 1.1, 1.1, 1.1, 'cm', 'gte')).toBe(true);
        expect(compareDimension(1.1, 1.1, 1.1, 'cm', 1.2, 1.2, 1.2, 'cm', 'gte')).toBe(true);
        expect(compareDimension(1.1, 1.1, 1.1, 'cm', 1.1, 1.1, 1.2, 'cm', 'gte')).toBe(true);
        expect(compareDimension(1.1, 1.1, 1.1, 'cm', 1.0, 1.0, 1.0, 'cm', 'gte')).toBe(false);
        expect(compareDimension(1.1, 1.1, 1.1, 'm', 110, 110, 110, 'cm', 'gte')).toBe(true);
        expect(compareDimension(1.1, 1.1, 1.1, 'm', 210, 210, 210, 'cm', 'gte')).toBe(true);
        expect(compareDimension(1.1, 1.1, 1.1, 'm', 210, 110, 110, 'cm', 'gte')).toBe(true);
        expect(compareDimension(1.1, 1.1, 1.1, 'm', 100, 100, 100, 'cm', 'gte')).toBe(false);
    });
    it(`compareDimension not gte`, () => {
        expect(compareDimension(1.1, 1.1, 1.1, 'cm', 1.1, 1.1, 1.1, 'cm', 'not gte')).toBe(false);
        expect(compareDimension(1.1, 1.1, 1.1, 'cm', 1.2, 1.2, 1.2, 'cm', 'not gte')).toBe(false);
        expect(compareDimension(1.1, 1.1, 1.1, 'cm', 1.1, 1.1, 1.2, 'cm', 'not gte')).toBe(false);
        expect(compareDimension(1.1, 1.1, 1.1, 'cm', 1.0, 1.0, 1.0, 'cm', 'not gte')).toBe(true);
        expect(compareDimension(1.1, 1.1, 1.1, 'm', 110, 110, 110, 'cm', 'not gte')).toBe(false);
        expect(compareDimension(1.1, 1.1, 1.1, 'm', 210, 210, 210, 'cm', 'not gte')).toBe(false);
        expect(compareDimension(1.1, 1.1, 1.1, 'm', 210, 110, 110, 'cm', 'not gte')).toBe(false);
        expect(compareDimension(1.1, 1.1, 1.1, 'm', 100, 100, 100, 'cm', 'not gte')).toBe(true);
    });
    it(`compareDimension lt`, () => {
        expect(compareDimension(1.1, 1.1, 1.1, 'cm', 1.1, 1.1, 1.1, 'cm', 'lt')).toBe(false);
        expect(compareDimension(1.1, 1.1, 1.1, 'cm', 1.2, 1.2, 1.2, 'cm', 'lt')).toBe(false);
        expect(compareDimension(1.1, 1.1, 1.1, 'cm', 1.1, 1.1, 1.2, 'cm', 'lt')).toBe(false);
        expect(compareDimension(1.1, 1.1, 1.1, 'cm', 1.0, 1.0, 1.0, 'cm', 'lt')).toBe(true);
        expect(compareDimension(1.1, 1.1, 1.1, 'm', 110, 110, 110, 'cm', 'lt')).toBe(false);
        expect(compareDimension(1.1, 1.1, 1.1, 'm', 210, 210, 210, 'cm', 'lt')).toBe(false);
        expect(compareDimension(1.1, 1.1, 1.1, 'm', 210, 110, 110, 'cm', 'lt')).toBe(false);
        expect(compareDimension(1.1, 1.1, 1.1, 'm', 100, 100, 100, 'cm', 'lt')).toBe(true);
    });
    it(`compareDimension not lt`, () => {
        expect(compareDimension(1.1, 1.1, 1.1, 'cm', 1.1, 1.1, 1.1, 'cm', 'not lt')).toBe(true);
        expect(compareDimension(1.1, 1.1, 1.1, 'cm', 1.2, 1.2, 1.2, 'cm', 'not lt')).toBe(true);
        expect(compareDimension(1.1, 1.1, 1.1, 'cm', 1.1, 1.1, 1.2, 'cm', 'not lt')).toBe(true);
        expect(compareDimension(1.1, 1.1, 1.1, 'cm', 1.0, 1.0, 1.0, 'cm', 'not lt')).toBe(false);
        expect(compareDimension(1.1, 1.1, 1.1, 'm', 110, 110, 110, 'cm', 'not lt')).toBe(true);
        expect(compareDimension(1.1, 1.1, 1.1, 'm', 210, 210, 210, 'cm', 'not lt')).toBe(true);
        expect(compareDimension(1.1, 1.1, 1.1, 'm', 210, 110, 110, 'cm', 'not lt')).toBe(true);
        expect(compareDimension(1.1, 1.1, 1.1, 'm', 100, 100, 100, 'cm', 'not lt')).toBe(false);
    });
    it(`compareDimension lte`, () => {
        expect(compareDimension(1.1, 1.1, 1.1, 'cm', 1.1, 1.1, 1.1, 'cm', 'lte')).toBe(true);
        expect(compareDimension(1.1, 1.1, 1.1, 'cm', 1.2, 1.2, 1.2, 'cm', 'lte')).toBe(false);
        expect(compareDimension(1.1, 1.1, 1.1, 'cm', 1.1, 1.1, 1.2, 'cm', 'lte')).toBe(false);
        expect(compareDimension(1.1, 1.1, 1.1, 'cm', 1.0, 1.0, 1.0, 'cm', 'lte')).toBe(true);
        expect(compareDimension(1.1, 1.1, 1.1, 'm', 110, 110, 110, 'cm', 'lte')).toBe(true);
        expect(compareDimension(1.1, 1.1, 1.1, 'm', 210, 210, 210, 'cm', 'lte')).toBe(false);
        expect(compareDimension(1.1, 1.1, 1.1, 'm', 210, 110, 110, 'cm', 'lte')).toBe(false);
        expect(compareDimension(1.1, 1.1, 1.1, 'm', 100, 100, 100, 'cm', 'lte')).toBe(true);
    });
    it(`compareDimension not lte`, () => {
        expect(compareDimension(1.1, 1.1, 1.1, 'cm', 1.1, 1.1, 1.1, 'cm', 'not lte')).toBe(false);
        expect(compareDimension(1.1, 1.1, 1.1, 'cm', 1.2, 1.2, 1.2, 'cm', 'not lte')).toBe(true);
        expect(compareDimension(1.1, 1.1, 1.1, 'cm', 1.1, 1.1, 1.2, 'cm', 'not lte')).toBe(true);
        expect(compareDimension(1.1, 1.1, 1.1, 'cm', 1.0, 1.0, 1.0, 'cm', 'not lte')).toBe(false);
        expect(compareDimension(1.1, 1.1, 1.1, 'm', 110, 110, 110, 'cm', 'not lte')).toBe(false);
        expect(compareDimension(1.1, 1.1, 1.1, 'm', 210, 210, 210, 'cm', 'not lte')).toBe(true);
        expect(compareDimension(1.1, 1.1, 1.1, 'm', 210, 110, 110, 'cm', 'not lte')).toBe(true);
        expect(compareDimension(1.1, 1.1, 1.1, 'm', 100, 100, 100, 'cm', 'not lte')).toBe(false);
    });


    // =================
    // === Area      ===
    // =================
    it(`compareArea empty`, () => {
        expect(compareArea(1.1, 'cm2', 1.1, 'cm2', 'empty')).toBe(false);
        expect(compareArea(1.1, 'cm2', undefined, 'cm2', 'empty')).toBe(true);
        expect(compareArea(1.1, 'cm2', null, 'cm2', 'empty')).toBe(true);
        expect(compareArea(1.1, 'cm2', 1.1, 'cm2', 'empty')).toBe(false);
        expect(compareArea(undefined, 'cm2', undefined, 'cm2', 'empty')).toBe(true);
        expect(compareArea(null, 'cm2', null, 'cm2', 'empty')).toBe(true);
    });
    it(`compareArea not empty`, () => {
        expect(compareArea(1.1, 'cm2', 1.1, 'cm2', 'not empty')).toBe(true);
        expect(compareArea(1.1, 'cm2', undefined, 'cm2', 'not empty')).toBe(false);
        expect(compareArea(1.1, 'cm2', null, 'cm2', 'not empty')).toBe(false);
        expect(compareArea(1.1, 'cm2', 1.1, 'cm2', 'not empty')).toBe(true);
        expect(compareArea(undefined, 'cm2', undefined, 'cm2', 'not empty')).toBe(false);
        expect(compareArea(null, 'cm2', null, 'cm2', 'not empty')).toBe(false);
    });
    it(`compareArea eq`, () => {
        expect(compareArea(1.1, 'cm2', 1.1, 'cm2', 'eq')).toBe(true);
        expect(compareArea(1.1, 'cm2', 1.2, 'cm2', 'eq')).toBe(false);
        expect(compareArea(1.1, 'm2', 11000, 'cm2', 'eq')).toBe(true);
        expect(compareArea(1.1, 'm2', 21000, 'cm2', 'eq')).toBe(false);
    });
    it(`compareArea not eq`, () => {
        expect(compareArea(1.1, 'cm2', 1.1, 'cm2', 'not eq')).toBe(false);
        expect(compareArea(1.1, 'cm2', 1.2, 'cm2', 'not eq')).toBe(true);
        expect(compareArea(1.1, 'm2', 11000, 'cm2', 'not eq')).toBe(false);
        expect(compareArea(1.1, 'm2', 21000, 'cm2', 'not eq')).toBe(true);
    });
    it(`compareArea gt`, () => {
        expect(compareArea(1.1, 'cm2', 1.1, 'cm2', 'gt')).toBe(false);
        expect(compareArea(1.1, 'cm2', 1.2, 'cm2', 'gt')).toBe(true);
        expect(compareArea(1.1, 'cm2', 1.0, 'cm2', 'gt')).toBe(false);
        expect(compareArea(1.1, 'm2', 11000, 'cm2', 'gt')).toBe(false);
        expect(compareArea(1.1, 'm2', 21000, 'cm2', 'gt')).toBe(true);
        expect(compareArea(1.1, 'm2', 10000, 'cm2', 'gt')).toBe(false);
    });
    it(`compareArea not gt`, () => {
        expect(compareArea(1.1, 'cm2', 1.1, 'cm2', 'not gt')).toBe(true);
        expect(compareArea(1.1, 'cm2', 1.2, 'cm2', 'not gt')).toBe(false);
        expect(compareArea(1.1, 'cm2', 1.0, 'cm2', 'not gt')).toBe(true);
        expect(compareArea(1.1, 'm2', 11000, 'cm2', 'not gt')).toBe(true);
        expect(compareArea(1.1, 'm2', 21000, 'cm2', 'not gt')).toBe(false);
        expect(compareArea(1.1, 'm2', 10000, 'cm2', 'not gt')).toBe(true);
    });
    it(`compareArea gte`, () => {
        expect(compareArea(1.1, 'cm2', 1.1, 'cm2', 'gte')).toBe(true);
        expect(compareArea(1.1, 'cm2', 1.2, 'cm2', 'gte')).toBe(true);
        expect(compareArea(1.1, 'cm2', 1.0, 'cm2', 'gte')).toBe(false);
        expect(compareArea(1.1, 'm2', 11000, 'cm2', 'gte')).toBe(true);
        expect(compareArea(1.1, 'm2', 21000, 'cm2', 'gte')).toBe(true);
        expect(compareArea(1.1, 'm2', 10000, 'cm2', 'gte')).toBe(false);
    });
    it(`compareArea not gte`, () => {
        expect(compareArea(1.1, 'cm2', 1.1, 'cm2', 'not gte')).toBe(false);
        expect(compareArea(1.1, 'cm2', 1.2, 'cm2', 'not gte')).toBe(false);
        expect(compareArea(1.1, 'cm2', 1.0, 'cm2', 'not gte')).toBe(true);
        expect(compareArea(1.1, 'm2', 11000, 'cm2', 'not gte')).toBe(false);
        expect(compareArea(1.1, 'm2', 21000, 'cm2', 'not gte')).toBe(false);
        expect(compareArea(1.1, 'm2', 10000, 'cm2', 'not gte')).toBe(true);
    });
    it(`compareArea lt`, () => {
        expect(compareArea(1.1, 'cm2', 1.1, 'cm2', 'lt')).toBe(false);
        expect(compareArea(1.1, 'cm2', 1.2, 'cm2', 'lt')).toBe(false);
        expect(compareArea(1.1, 'cm2', 1.0, 'cm2', 'lt')).toBe(true);
        expect(compareArea(1.1, 'm2', 11000, 'cm2', 'lt')).toBe(false);
        expect(compareArea(1.1, 'm2', 21000, 'cm2', 'lt')).toBe(false);
        expect(compareArea(1.1, 'm2', 10000, 'cm2', 'lt')).toBe(true);
    });
    it(`compareArea not lt`, () => {
        expect(compareArea(1.1, 'cm2', 1.1, 'cm2', 'not lt')).toBe(true);
        expect(compareArea(1.1, 'cm2', 1.2, 'cm2', 'not lt')).toBe(true);
        expect(compareArea(1.1, 'cm2', 1.0, 'cm2', 'not lt')).toBe(false);
        expect(compareArea(1.1, 'm2', 11000, 'cm2', 'not lt')).toBe(true);
        expect(compareArea(1.1, 'm2', 21000, 'cm2', 'not lt')).toBe(true);
        expect(compareArea(1.1, 'm2', 10000, 'cm2', 'not lt')).toBe(false);
    });
    it(`compareArea lte`, () => {
        expect(compareArea(1.1, 'cm2', 1.1, 'cm2', 'lte')).toBe(true);
        expect(compareArea(1.1, 'cm2', 1.2, 'cm2', 'lte')).toBe(false);
        expect(compareArea(1.1, 'cm2', 1.0, 'cm2', 'lte')).toBe(true);
        expect(compareArea(1.1, 'm2', 11000, 'cm2', 'lte')).toBe(true);
        expect(compareArea(1.1, 'm2', 21000, 'cm2', 'lte')).toBe(false);
        expect(compareArea(1.1, 'm2', 10000, 'cm2', 'lte')).toBe(true);
    });
    it(`compareArea not lte`, () => {
        expect(compareArea(1.1, 'cm2', 1.1, 'cm2', 'not lte')).toBe(false);
        expect(compareArea(1.1, 'cm2', 1.2, 'cm2', 'not lte')).toBe(true);
        expect(compareArea(1.1, 'cm2', 1.0, 'cm2', 'not lte')).toBe(false);
        expect(compareArea(1.1, 'm2', 11000, 'cm2', 'not lte')).toBe(false);
        expect(compareArea(1.1, 'm2', 21000, 'cm2', 'not lte')).toBe(true);
        expect(compareArea(1.1, 'm2', 10000, 'cm2', 'not lte')).toBe(false);
    });

    // =================
    // === Width     ===
    // =================
    it(`compareWidth empty`, () => {
        expect(compareWidth(1.1, 'cm', 1.1, 'cm', 'empty')).toBe(false);
        expect(compareWidth(1.1, 'cm', undefined, 'cm', 'empty')).toBe(true);
        expect(compareWidth(1.1, 'cm', null, 'cm', 'empty')).toBe(true);
        expect(compareWidth(1.1, 'cm', 1.1, 'cm', 'empty')).toBe(false);
        expect(compareWidth(undefined, 'cm', undefined, 'cm', 'empty')).toBe(true);
        expect(compareWidth(null, 'cm', null, 'cm', 'empty')).toBe(true);
    });
    it(`compareWidth not empty`, () => {
        expect(compareWidth(1.1, 'cm', 1.1, 'cm', 'not empty')).toBe(true);
        expect(compareWidth(1.1, 'cm', undefined, 'cm', 'not empty')).toBe(false);
        expect(compareWidth(1.1, 'cm', null, 'cm', 'not empty')).toBe(false);
        expect(compareWidth(1.1, 'cm', 1.1, 'cm', 'not empty')).toBe(true);
        expect(compareWidth(undefined, 'cm', undefined, 'cm', 'not empty')).toBe(false);
        expect(compareWidth(null, 'cm', null, 'cm', 'not empty')).toBe(false);
    });
    it(`compareWidth eq`, () => {
        expect(compareWidth(1.1, 'cm', 1.1, 'cm', 'eq')).toBe(true);
        expect(compareWidth(1.1, 'cm', 1.2, 'cm', 'eq')).toBe(false);
        expect(compareWidth(1.1, 'm', 110, 'cm', 'eq')).toBe(true);
        expect(compareWidth(1.1, 'm', 210, 'cm', 'eq')).toBe(false);
    });
    it(`compareWidth not eq`, () => {
        expect(compareWidth(1.1, 'cm', 1.1, 'cm', 'not eq')).toBe(false);
        expect(compareWidth(1.1, 'cm', 1.2, 'cm', 'not eq')).toBe(true);
        expect(compareWidth(1.1, 'm', 110, 'cm', 'not eq')).toBe(false);
        expect(compareWidth(1.1, 'm', 210, 'cm', 'not eq')).toBe(true);
    });
    it(`compareWidth gt`, () => {
        expect(compareWidth(1.1, 'cm', 1.1, 'cm', 'gt')).toBe(false);
        expect(compareWidth(1.1, 'cm', 1.2, 'cm', 'gt')).toBe(true);
        expect(compareWidth(1.1, 'cm', 1.0, 'cm', 'gt')).toBe(false);
        expect(compareWidth(1.1, 'm', 110, 'cm', 'gt')).toBe(false);
        expect(compareWidth(1.1, 'm', 210, 'cm', 'gt')).toBe(true);
        expect(compareWidth(1.1, 'm', 100, 'cm', 'gt')).toBe(false);
    });
    it(`compareWidth not gt`, () => {
        expect(compareWidth(1.1, 'cm', 1.1, 'cm', 'not gt')).toBe(true);
        expect(compareWidth(1.1, 'cm', 1.2, 'cm', 'not gt')).toBe(false);
        expect(compareWidth(1.1, 'cm', 1.0, 'cm', 'not gt')).toBe(true);
        expect(compareWidth(1.1, 'm', 110, 'cm', 'not gt')).toBe(true);
        expect(compareWidth(1.1, 'm', 210, 'cm', 'not gt')).toBe(false);
        expect(compareWidth(1.1, 'm', 100, 'cm', 'not gt')).toBe(true);
    });
    it(`compareWidth gte`, () => {
        expect(compareWidth(1.1, 'cm', 1.1, 'cm', 'gte')).toBe(true);
        expect(compareWidth(1.1, 'cm', 1.2, 'cm', 'gte')).toBe(true);
        expect(compareWidth(1.1, 'cm', 1.0, 'cm', 'gte')).toBe(false);
        expect(compareWidth(1.1, 'm', 110, 'cm', 'gte')).toBe(true);
        expect(compareWidth(1.1, 'm', 210, 'cm', 'gte')).toBe(true);
        expect(compareWidth(1.1, 'm', 100, 'cm', 'gte')).toBe(false);
    });
    it(`comapreWidth not gte`, () => {
        expect(compareWidth(1.1, 'cm', 1.1, 'cm', 'not gte')).toBe(false);
        expect(compareWidth(1.1, 'cm', 1.2, 'cm', 'not gte')).toBe(false);
        expect(compareWidth(1.1, 'cm', 1.0, 'cm', 'not gte')).toBe(true);
        expect(compareWidth(1.1, 'm', 110, 'cm', 'not gte')).toBe(false);
        expect(compareWidth(1.1, 'm', 210, 'cm', 'not gte')).toBe(false);
        expect(compareWidth(1.1, 'm', 100, 'cm', 'not gte')).toBe(true);
    });
    it(`compareWidth lt`, () => {
        expect(compareWidth(1.1, 'cm', 1.1, 'cm', 'lt')).toBe(false);
        expect(compareWidth(1.1, 'cm', 1.2, 'cm', 'lt')).toBe(false);
        expect(compareWidth(1.1, 'cm', 1.0, 'cm', 'lt')).toBe(true);
        expect(compareWidth(1.1, 'm', 110, 'cm', 'lt')).toBe(false);
        expect(compareWidth(1.1, 'm', 210, 'cm', 'lt')).toBe(false);
        expect(compareWidth(1.1, 'm', 100, 'cm', 'lt')).toBe(true);
    });
    it(`comapreWidth not lt`, () => {
        expect(compareWidth(1.1, 'cm', 1.1, 'cm', 'not lt')).toBe(true);
        expect(compareWidth(1.1, 'cm', 1.2, 'cm', 'not lt')).toBe(true);
        expect(compareWidth(1.1, 'cm', 1.0, 'cm', 'not lt')).toBe(false);
        expect(compareWidth(1.1, 'm', 110, 'cm', 'not lt')).toBe(true);
        expect(compareWidth(1.1, 'm', 210, 'cm', 'not lt')).toBe(true);
        expect(compareWidth(1.1, 'm', 100, 'cm', 'not lt')).toBe(false);
    });
    it(`compareWidth lte`, () => {
        expect(compareWidth(1.1, 'cm', 1.1, 'cm', 'lte')).toBe(true);
        expect(compareWidth(1.1, 'cm', 1.2, 'cm', 'lte')).toBe(false);
        expect(compareWidth(1.1, 'cm', 1.0, 'cm', 'lte')).toBe(true);
        expect(compareWidth(1.1, 'm', 110, 'cm', 'lte')).toBe(true);
        expect(compareWidth(1.1, 'm', 210, 'cm', 'lte')).toBe(false);
        expect(compareWidth(1.1, 'm', 100, 'cm', 'lte')).toBe(true);
    });
    it(`compareWidth not lte`, () => {
        expect(compareWidth(1.1, 'cm', 1.1, 'cm', 'not lte')).toBe(false);
        expect(compareWidth(1.1, 'cm', 1.2, 'cm', 'not lte')).toBe(true);
        expect(compareWidth(1.1, 'cm', 1.0, 'cm', 'not lte')).toBe(false);
        expect(compareWidth(1.1, 'm', 110, 'cm', 'not lte')).toBe(false);
        expect(compareWidth(1.1, 'm', 210, 'cm', 'not lte')).toBe(true);
        expect(compareWidth(1.1, 'm', 100, 'cm', 'not lte')).toBe(false);
    });
    // =================
    // === Height    ===
    // =================
    it(`compareVolume empty`, () => { });
    it(`compareVolume not empty`, () => { });
    it(`compareVolume eq`, () => { });
    it(`compareVolume not eq`, () => { });
    it(`compareVolume gt`, () => { });
    it(`compareVolume not gt`, () => { });
    it(`compareVolume gte`, () => { });
    it(`compareVolume not gte`, () => { });
    it(`compareVolume lt`, () => { });
    it(`compareVolume not lt`, () => { });
    it(`compareVolume lte`, () => { });
    it(`compareVolume not lte`, () => { });
    // =================
    // === Length    ===
    // =================
    it(`compareVolume empty`, () => { });
    it(`compareVolume not empty`, () => { });
    it(`compareVolume eq`, () => { });
    it(`compareVolume not eq`, () => { });
    it(`compareVolume gt`, () => { });
    it(`compareVolume not gt`, () => { });
    it(`compareVolume gte`, () => { });
    it(`compareVolume not gte`, () => { });
    it(`compareVolume lt`, () => { });
    it(`compareVolume not lt`, () => { });
    it(`compareVolume lte`, () => { });
    it(`compareVolume not lte`, () => { });
    // =================
    // === Weight    ===
    // =================
    it(`compareVolume empty`, () => { });
    it(`compareVolume not empty`, () => { });
    it(`compareVolume eq`, () => { });
    it(`compareVolume not eq`, () => { });
    it(`compareVolume gt`, () => { });
    it(`compareVolume not gt`, () => { });
    it(`compareVolume gte`, () => { });
    it(`compareVolume not gte`, () => { });
    it(`compareVolume lt`, () => { });
    it(`compareVolume not lt`, () => { });
    it(`compareVolume lte`, () => { });
    it(`compareVolume not lte`, () => { });
    // =================
    // === Select    ===
    // =================
    it(`compareVolume empty`, () => { });
    it(`compareVolume not empty`, () => { });
    it(`compareVolume eq`, () => { });
    it(`compareVolume not eq`, () => { });
    // =====================
    // === Doubleselect  ===
    // =====================
    it(`compareVolume empty`, () => { });
    it(`compareVolume not empty`, () => { });
    it(`compareVolume eq`, () => { });
    it(`compareVolume not eq`, () => { });
});
