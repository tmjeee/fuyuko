import * as moment from 'moment';
export const intValidator = (c) => {
    if (c.value) {
        const r = parseInt(c.value, 10);
        if (Number.isNaN(r)) {
            return { int: true };
        }
    }
    return null;
};
export const numberFormatValidator = (c) => {
    if (c.value) {
        const cVal = c.value.toString();
        if (cVal.indexOf('0') < 0 && cVal.indexOf('#') < 0) {
            return { numberFormat: true };
        }
    }
    return null;
};
export const dateFormatValidator = (c) => {
    if (c.value) {
        const cVal = c.value.toString();
        if (!moment(new Date(), cVal).isValid()) {
            return { dateFormat: true };
        }
    }
    return null;
};
export const timeFormatValidator = (c) => {
    return dateFormatValidator(c);
};
export const datetimeFormatValidator = (c) => {
    return dateFormatValidator(c);
};
//# sourceMappingURL=custom-validators.js.map