import {
    AreaUnits,
    CountryCurrencyUnits,
    DimensionUnits,
    HeightUnits,
    LengthUnits,
    VolumeUnits, WeightUnits,
    WidthUnits
} from "../model/unit.model";
import moment from "moment";
import {OperatorType} from "../model/operator.model";


class CompareAttributeValuesService {

    notNullOrUndefined(v: any): boolean {
        return (v !== null && v !== undefined);
    }

    convertToCm(v: number, u: DimensionUnits | WidthUnits | LengthUnits | HeightUnits): number {
        if (v == null || v == undefined) {
            return v;
        }
        switch (u) {
            case "cm":
                return v;
            case "mm":
                return parseFloat((v / 10).toFixed(3));
            case "m":
                return parseFloat((v * 100).toFixed(2));
            default:
                return v;
        }
    }

    convertToG(v: number, u: WeightUnits): number {
        if (v == null || v == undefined) {
            return v;
        }
        switch(u) {
            case 'g':
                return v;
            case 'kg':
                return parseFloat((v * 1000).toFixed(2));
            default:
                return v;
        }
    }

    convertToCm2(v: number, u: AreaUnits): number {
        if (v == null || v == undefined) {
            return v;
        }
        switch(u) {
            case "cm2":
                return v;
            case "m2":
                return parseFloat((v * (100 * 100)).toFixed(10));
            case "mm2":
                return parseFloat((v  * (10 * 10)).toFixed(2));
            default:
                return v;
        }
    }

    convertToMl(v: number, u: VolumeUnits): number {
        if (v == null || v == undefined) {
            return v;
        }
        switch(u) {
            case "l":
                return parseFloat((v * 1000).toFixed(2));
            case "ml":
                return v;
            default:
                return v;
        }
    }

    compareDate(condition: moment.Moment,  /* from REST Api */
                                actual: moment.Moment,  /* from actual item attribute value */
                                operator: OperatorType): boolean {
        switch (operator) {
            case "empty":
                return (!!!actual); // when a is falsy
            case "eq":
                return actual && actual.isSame(condition);
            case "gt":
                return actual && actual.isAfter(condition);
            case "gte":
                return actual && actual.isSameOrAfter(condition);
            case "lt":
                return actual && actual.isBefore(condition);
            case "lte":
                return actual && actual.isSameOrBefore(condition);
            case "not empty":
                return (!!actual);
            case "not eq":
                return (actual && (!actual.isSame(condition)));
            case "not gt":
                return (actual && (!actual.isAfter(condition)));
            case "not gte":
                return (actual && (!actual.isSameOrAfter(condition)));;
            case "not lt":
                return (actual && (!actual.isBefore(condition)));
            case "not lte":
                return (actual && (!actual.isSameOrBefore(condition)));
            case 'contain':
                throw new Error(`Unsupported operation on ${operator} for value of type date`);
            case 'not contain':
                throw new Error(`Unsupported operation on ${operator} for value of type date`);
            case 'regexp':
                throw new Error(`Unsupported operation on ${operator} for value of type date`);
            default:
                throw new Error(`unrecognised operator ${operator} for date ${actual} and condition ${condition} comparison`);
        }
    }

    compareNumber(condition: number, /* from REST api */
                                  actual: number, /* from actual item attribute value */
                                  operator: OperatorType): boolean {
        switch (operator) {
            case "empty":
                return (!!!actual);
            case "eq":
                return (this.notNullOrUndefined(actual) && actual == condition);
            case "gt":
                return (this.notNullOrUndefined(actual) && actual > condition);
            case "gte":
                return (this.notNullOrUndefined(actual) && actual >= condition);
            case "lt":
                return (this.notNullOrUndefined(actual) && actual < condition);
            case "lte":
                return (this.notNullOrUndefined(actual) && actual <= condition);
            case "not empty":
                return (!!actual)
            case "not eq":
                return (this.notNullOrUndefined(actual) && actual != condition);
            case "not gt":
                return (this.notNullOrUndefined(actual) && !(actual > condition));
            case "not gte":
                return (this.notNullOrUndefined(actual) && !(actual >= condition));
            case "not lt":
                return (this.notNullOrUndefined(actual) && !(actual < condition));
            case "not lte":
                return (this.notNullOrUndefined(actual) && !(actual <= condition));
            case 'contain':
                throw new Error(`Unsupported operation on ${operator} for value of type number`);
            case 'not contain':
                throw new Error(`Unsupported operation on ${operator} for value of type number`);
            case 'regexp':
                throw new Error(`Unsupported operation on ${operator} for value of type number`);
            default:
                throw new Error(`unrecognised operator ${operator} for number ${actual} and condition ${condition} comparison`);
        }
    }

    compareString(condition: string /* from REST Api */,
                                  actual: string /* from actual item attribute value */,
                                  operator: OperatorType): boolean {
        switch (operator) {
            case "empty":
                return (!!!actual);
            case "eq":
                return !!((actual == condition));
            case "gt":
                throw new Error(`Unsupported operation on ${operator} for value of type string`);
            case "gte":
                throw new Error(`Unsupported operation on ${operator} for value of type string`);
            case "lt":
                throw new Error(`Unsupported operation on ${operator} for value of type string`);
            case "lte":
                throw new Error(`Unsupported operation on ${operator} for value of type string`);
            case "not empty":
                return (!!actual);
            case "not eq":
                return !!((actual != condition));
            case "not gt":
                throw new Error(`Unsupported operation on ${operator} for value of type string`);
            case "not gte":
                throw new Error(`Unsupported operation on ${operator} for value of type string`);
            case "not lt":
                throw new Error(`Unsupported operation on ${operator} for value of type string`);
            case "not lte":
                throw new Error(`Unsupported operation on ${operator} for value of type string`);
            case 'contain':
                return !!(actual && actual.indexOf(condition) >= 0);
            case 'not contain':
                return !!(actual && actual.indexOf(condition) < 0);
            case 'regexp':
                return !!(actual && (!!actual.match(condition)));
            default:
                throw new Error(`unrecognised operator ${operator} for string ${actual} and condition ${condition} comparison`);
        }
    }

    // currency
    compareCurrency(condition: number /* from REST Api */,
                                    conditionUnit: CountryCurrencyUnits,
                                    actual: number /* from actual item attribute value */,
                                    actualUnit: CountryCurrencyUnits,
                                    operator: OperatorType): boolean {
        if (operator !== 'empty' && operator !== 'not empty' && conditionUnit !== actualUnit) {
            return false;
        }
        switch (operator) {
            case "empty":
                return (!!!actual);
            case "eq":
                return (this.notNullOrUndefined(actual) && actual == condition);
            case "gt":
                return (this.notNullOrUndefined(actual) && actual > condition);
            case "gte":
                return (this.notNullOrUndefined(actual) && actual >= condition);
            case "lt":
                return (this.notNullOrUndefined(actual) && actual < condition);
            case "lte":
                return (this.notNullOrUndefined(actual) && actual <= condition);
            case "not empty":
                return (!!actual)
            case "not eq":
                return (this.notNullOrUndefined(actual) && actual != condition);
            case "not gt":
                return (this.notNullOrUndefined(actual) && !(actual > condition));
            case "not gte":
                return (this.notNullOrUndefined(actual) && !(actual >= condition));
            case "not lt":
                return (this.notNullOrUndefined(actual) && !(actual < condition));
            case "not lte":
                return (this.notNullOrUndefined(actual) && !(actual <= condition));
            case 'contain':
                throw new Error(`Unsupported operation on ${operator} for value of type currency`);
            case 'not contain':
                throw new Error(`Unsupported operation on ${operator} for value of type currency`);
            case 'regexp':
                throw new Error(`Unsupported operation on ${operator} for value of type currency`);
            default:
                throw new Error(`unrecognised operator ${operator} for currency ${actual} ${actualUnit} and condition ${condition} ${conditionUnit} comparison`);
        }
    }

    // volume
    compareVolume(_condition: number /* from REST Api */,
                                  _conditionUnit: VolumeUnits,
                                  _actual: number /* from actual item attribute value */,
                                  _actualUnit: VolumeUnits,
                                  operator: OperatorType): boolean {
        const condition = convertToMl(_condition, _conditionUnit);
        const actual = convertToMl(_actual, _actualUnit);

        switch (operator) {
            case "empty":
                return (!!!actual);
            case "eq":
                return (this.notNullOrUndefined(actual) && actual == condition);
            case "gt":
                return (this.notNullOrUndefined(actual) && actual > condition);
            case "gte":
                return (this.notNullOrUndefined(actual) && actual >= condition);
            case "lt":
                return (this.notNullOrUndefined(actual) && actual < condition);
            case "lte":
                return (this.notNullOrUndefined(actual) && actual <= condition);
            case "not empty":
                return (!!actual)
            case "not eq":
                return (this.notNullOrUndefined(actual) && actual != condition);
            case "not gt":
                return (this.notNullOrUndefined(actual) && !(actual > condition));
            case "not gte":
                return (this.notNullOrUndefined(actual) && !(actual >= condition));
            case "not lt":
                return (this.notNullOrUndefined(actual) && !(actual < condition));
            case "not lte":
                return (this.notNullOrUndefined(actual) && !(actual <= condition));
            case 'contain':
                throw new Error(`Unsupported operation on ${operator} for value of type volume`);
            case 'not contain':
                throw new Error(`Unsupported operation on ${operator} for value of type volume`);
            case 'regexp':
                throw new Error(`Unsupported operation on ${operator} for value of type volume`);
            default:
                throw new Error(`unrecognised operator ${operator} for volume ${_actual} ${_actualUnit} and condition ${_condition} ${_conditionUnit} comparison`);
        }

    }
    // dimension
    compareDimension(_conditionLength: number /* from REST Api */,
                                     _conditionWidth: number,
                                     _conditionHeight: number,
                                     _conditionUnit: DimensionUnits,
                                     _actualLength: number /* from actual item attribute value */,
                                     _actualWidth: number,
                                     _actualHeight: number,
                                     _actualUnit: DimensionUnits,
                                     operator: OperatorType): boolean {
        const conditionLength = convertToCm(_conditionLength, _conditionUnit);
        const conditionWidth = convertToCm(_conditionWidth, _conditionUnit);
        const conditionHeight = convertToCm(_conditionHeight, _conditionUnit);
        const actualLength = convertToCm(_actualLength, _actualUnit);
        const actualWidth = convertToCm(_actualWidth, _actualUnit);
        const actualHeight = convertToCm(_actualHeight, _actualUnit);

        switch (operator) {
            case 'eq':
                return this.notNullOrUndefined(actualLength) && this.notNullOrUndefined(actualWidth) && this.notNullOrUndefined(actualHeight) &&
                    (Math.abs(actualLength) * Math.abs(actualWidth) * Math.abs(actualHeight)) == (Math.abs(conditionLength) * Math.abs(conditionWidth) * Math.abs(conditionHeight));
            case 'not eq':
                return this.notNullOrUndefined(actualLength) && this.notNullOrUndefined(actualWidth) && this.notNullOrUndefined(actualHeight) &&
                    (Math.abs(actualLength) * Math.abs(actualWidth) * Math.abs(actualHeight)) != (Math.abs(conditionLength) * Math.abs(conditionWidth) * Math.abs(conditionHeight));
            case 'lt':
                return this.notNullOrUndefined(actualLength) && this.notNullOrUndefined(actualWidth) && this.notNullOrUndefined(actualHeight) &&
                    (Math.abs(actualLength) * Math.abs(actualWidth) * Math.abs(actualHeight)) < (Math.abs(conditionLength) * Math.abs(conditionWidth) * Math.abs(conditionHeight));
            case 'not lt':
                return this.notNullOrUndefined(actualLength) && this.notNullOrUndefined(actualWidth) && this.notNullOrUndefined(actualHeight) &&
                    (!((Math.abs(actualLength) * Math.abs(actualWidth) * Math.abs(actualHeight)) < (Math.abs(conditionLength) * Math.abs(conditionWidth) * Math.abs(conditionHeight))));
            case 'gt':
                return this.notNullOrUndefined(actualLength) && this.notNullOrUndefined(actualWidth) && this.notNullOrUndefined(actualHeight) &&
                    (Math.abs(actualLength) * Math.abs(actualWidth) * Math.abs(actualHeight)) > (Math.abs(conditionLength) * Math.abs(conditionWidth) * Math.abs(conditionHeight));
            case 'not gt':
                return this.notNullOrUndefined(actualLength) && this.notNullOrUndefined(actualWidth) && this.notNullOrUndefined(actualHeight) &&
                    (!((Math.abs(actualLength) * Math.abs(actualWidth) * Math.abs(actualHeight)) > (Math.abs(conditionLength) * Math.abs(conditionWidth) * Math.abs(conditionHeight))));
            case 'gte':
                return this.notNullOrUndefined(actualLength) && this.notNullOrUndefined(actualWidth) && this.notNullOrUndefined(actualHeight) &&
                    (Math.abs(actualLength) * Math.abs(actualWidth) * Math.abs(actualHeight)) >= (Math.abs(conditionLength) * Math.abs(conditionWidth) * Math.abs(conditionHeight));
            case 'not gte':
                return this.notNullOrUndefined(actualLength) && this.notNullOrUndefined(actualWidth) && this.notNullOrUndefined(actualHeight) &&
                    (!((Math.abs(actualLength) * Math.abs(actualWidth) * Math.abs(actualHeight)) >= (Math.abs(conditionLength) * Math.abs(conditionWidth) * Math.abs(conditionHeight))));
            case 'lte':
                return this.notNullOrUndefined(actualLength) && this.notNullOrUndefined(actualWidth) && this.notNullOrUndefined(actualHeight) &&
                    (Math.abs(actualLength) * Math.abs(actualWidth) * Math.abs(actualHeight)) <= (Math.abs(conditionLength) * Math.abs(conditionWidth) * Math.abs(conditionHeight));
            case 'not lte':
                return this.notNullOrUndefined(actualLength) && this.notNullOrUndefined(actualWidth) && this.notNullOrUndefined(actualHeight) &&
                    (!((Math.abs(actualLength) * Math.abs(actualWidth) * Math.abs(actualHeight)) == (Math.abs(conditionLength) * Math.abs(conditionWidth) * Math.abs(conditionHeight))));
            case 'empty':
                return (!!!actualLength) && (!!!actualWidth) && (!!!actualHeight);
            case 'not empty':
                return (!!actualLength) && (!!actualWidth) && (!!actualHeight);
            case 'contain':
                throw new Error(`Unsupported operation on ${operator} for value of type dimension`);
            case 'not contain':
                throw new Error(`Unsupported operation on ${operator} for value of type dimension`);
            case 'regexp':
                throw new Error(`Unsupported operation on ${operator} for value of type dimension`);
            default:
                throw new Error(`unrecognised operator ${operator} for dimension length ${actualLength} width ${actualWidth} height ${actualHeight} unit ${_actualUnit} and condition length ${conditionLength} width ${conditionWidth} height ${conditionHeight} unit ${_conditionUnit} comparison`);
        }
    }
    // area
    compareArea(_condition: number /* from REST Api */,
                                _conditionUnit: AreaUnits,
                                _actual: number /* from actual item attribute value */,
                                _actualUnit: AreaUnits,
                                operator: OperatorType): boolean {
        const condition = convertToCm2(_condition, _conditionUnit);
        const actual = convertToCm2(_actual, _actualUnit);

        switch (operator) {
            case "empty":
                return (!!!actual);
            case "eq":
                return (this.notNullOrUndefined(actual) && actual == condition);
            case "gt":
                return (this.notNullOrUndefined(actual) && actual > condition);
            case "gte":
                return (this.notNullOrUndefined(actual) && actual >= condition);
            case "lt":
                return (this.notNullOrUndefined(actual) && actual < condition);
            case "lte":
                return (this.notNullOrUndefined(actual) && actual <= condition);
            case "not empty":
                return (!!actual)
            case "not eq":
                return (this.notNullOrUndefined(actual) && actual != condition);
            case "not gt":
                return (this.notNullOrUndefined(actual) && !(actual > condition));
            case "not gte":
                return (this.notNullOrUndefined(actual) && !(actual >= condition));
            case "not lt":
                return (this.notNullOrUndefined(actual) && !(actual < condition));
            case "not lte":
                return (this.notNullOrUndefined(actual) && !(actual <= condition));
            case 'contain':
                throw new Error(`Unsupported operation on ${operator} for value of type area`);
            case 'not contain':
                throw new Error(`Unsupported operation on ${operator} for value of type area`);
            case 'regexp':
                throw new Error(`Unsupported operation on ${operator} for value of type area`);
            default:
                throw new Error(`unrecognised operator ${operator} for area ${actual} ${_actualUnit} and condition ${condition} ${_conditionUnit} comparison`);
        }
    }
    // width
    compareWidth (_condition: number /* from REST Api */,
                                 _conditionUnit: WidthUnits,
                                 _actual: number /* from actual item attribute value */,
                                 _actualUnit: WidthUnits,
                                 operator: OperatorType): boolean {
        const condition = convertToCm(_condition, _conditionUnit);
        const actual = convertToCm(_actual, _actualUnit);

        /////////////////////////////////////
        switch (operator) {
            case "empty":
                return (!!!actual);
            case "eq":
                return (this.notNullOrUndefined(actual) && actual == condition);
            case "gt":
                return (this.notNullOrUndefined(actual) && actual > condition);
            case "gte":
                return (this.notNullOrUndefined(actual) && actual >= condition);
            case "lt":
                return (this.notNullOrUndefined(actual) && actual < condition);
            case "lte":
                return (this.notNullOrUndefined(actual) && actual <= condition);
            case "not empty":
                return (!!actual)
            case "not eq":
                return (this.notNullOrUndefined(actual) && actual != condition);
            case "not gt":
                return (this.notNullOrUndefined(actual) && !(actual > condition));
            case "not gte":
                return (this.notNullOrUndefined(actual) && !(actual >= condition));
            case "not lt":
                return (this.notNullOrUndefined(actual) && !(actual < condition));
            case "not lte":
                return (this.notNullOrUndefined(actual) && !(actual <= condition));
            case 'contain':
                throw new Error(`Unsupported operation on ${operator} for value of type width`);
            case 'not contain':
                throw new Error(`Unsupported operation on ${operator} for value of type width`);
            case 'regexp':
                throw new Error(`Unsupported operation on ${operator} for value of type width`);
            default:
                throw new Error(`unrecognised operator ${operator} for width ${actual} ${_actualUnit} and condition ${condition} ${_conditionUnit} comparison`);
        }
    }
    // weight
    compareWeight(_condition: number /* from REST Api */,
                                  _conditionUnit: WeightUnits,
                                  _actual: number /* from actual item attribute value */,
                                  _actualUnit: WeightUnits,
                                  operator: OperatorType): boolean {
        const condition = convertToG(_condition, _conditionUnit);
        const actual = convertToG(_actual, _actualUnit);

        /////////////////////////////////////
        switch (operator) {
            case "empty":
                return (!!!actual);
            case "eq":
                return (this.notNullOrUndefined(actual) && actual == condition);
            case "gt":
                return (this.notNullOrUndefined(actual) && actual > condition);
            case "gte":
                return (this.notNullOrUndefined(actual) && actual >= condition);
            case "lt":
                return (this.notNullOrUndefined(actual) && actual < condition);
            case "lte":
                return (this.notNullOrUndefined(actual) && actual <= condition);
            case "not empty":
                return (!!actual)
            case "not eq":
                return (this.notNullOrUndefined(actual) && actual != condition);
            case "not gt":
                return (this.notNullOrUndefined(actual) && !(actual > condition));
            case "not gte":
                return (this.notNullOrUndefined(actual) && !(actual >= condition));
            case "not lt":
                return (this.notNullOrUndefined(actual) && !(actual < condition));
            case "not lte":
                return (this.notNullOrUndefined(actual) && !(actual <= condition));
            case 'contain':
                throw new Error(`Unsupported operation on ${operator} for value of type weight`);
            case 'not contain':
                throw new Error(`Unsupported operation on ${operator} for value of type weight`);
            case 'regexp':
                throw new Error(`Unsupported operation on ${operator} for value of type weight`);
            default:
                throw new Error(`unrecognised operator ${operator} for weight ${actual} ${_actualUnit} and condition ${condition} ${_conditionUnit} comparison`);
        }
    }

    // height
    compareHeight(_condition: number /* from REST Api */,
                                  _conditionUnit: HeightUnits,
                                  _actual: number /* from actual item attribute value */,
                                  _actualUnit: HeightUnits,
                                  operator: OperatorType): boolean {
        const condition = convertToCm(_condition, _conditionUnit);
        const actual = convertToCm(_actual, _actualUnit);
        /////////////////////////////////
        switch (operator) {
            case "empty":
                return (!!!actual);
            case "eq":
                return (this.notNullOrUndefined(actual) && actual == condition);
            case "gt":
                return (this.notNullOrUndefined(actual) && actual > condition);
            case "gte":
                return (this.notNullOrUndefined(actual) && actual >= condition);
            case "lt":
                return (this.notNullOrUndefined(actual) && actual < condition);
            case "lte":
                return (this.notNullOrUndefined(actual) && actual <= condition);
            case "not empty":
                return (!!actual)
            case "not eq":
                return (this.notNullOrUndefined(actual) && actual != condition);
            case "not gt":
                return (this.notNullOrUndefined(actual) && !(actual > condition));
            case "not gte":
                return (this.notNullOrUndefined(actual) && !(actual >= condition));
            case "not lt":
                return (this.notNullOrUndefined(actual) && !(actual < condition));
            case "not lte":
                return (this.notNullOrUndefined(actual) && !(actual <= condition));
            case 'contain':
                throw new Error(`Unsupported operation on ${operator} for value of type height`);
            case 'not contain':
                throw new Error(`Unsupported operation on ${operator} for value of type height`);
            case 'regexp':
                throw new Error(`Unsupported operation on ${operator} for value of type height`);
            default:
                throw new Error(`unrecognised operator ${operator} for height ${actual} ${_actualUnit} and condition ${condition} ${_conditionUnit} comparison`);
        }
    }
    // length
    compareLength(_condition: number /* from REST Api */,
                                  _conditionUnit: LengthUnits,
                                  _actual: number /* from actual item attribute value */,
                                  _actualUnit: LengthUnits,
                                  operator: OperatorType): boolean {
        const condition = convertToCm(_condition, _conditionUnit);
        const actual = convertToCm(_actual, _actualUnit);
        ///////////////////////////
        switch (operator) {
            case "empty":
                return (!!!actual);
            case "eq":
                return (this.notNullOrUndefined(actual) && actual == condition);
            case "gt":
                return (this.notNullOrUndefined(actual) && actual > condition);
            case "gte":
                return (this.notNullOrUndefined(actual) && actual >= condition);
            case "lt":
                return (this.notNullOrUndefined(actual) && actual < condition);
            case "lte":
                return (this.notNullOrUndefined(actual) && actual <= condition);
            case "not empty":
                return (!!actual)
            case "not eq":
                return (this.notNullOrUndefined(actual) && actual != condition);
            case "not gt":
                return (this.notNullOrUndefined(actual) && !(actual > condition));
            case "not gte":
                return (this.notNullOrUndefined(actual) && !(actual >= condition));
            case "not lt":
                return (this.notNullOrUndefined(actual) && !(actual < condition));
            case "not lte":
                return (this.notNullOrUndefined(actual) && !(actual <= condition));
            case 'contain':
                throw new Error(`Unsupported operation on ${operator} for value of type length`);
            case 'not contain':
                throw new Error(`Unsupported operation on ${operator} for value of type length`);
            case 'regexp':
                throw new Error(`Unsupported operation on ${operator} for value of type length`);
            default:
                throw new Error(`unrecognised operator ${operator} for length ${actual} ${_actualUnit} and condition ${condition} ${_conditionUnit} comparison`);
        }
    }
    // select
    compareSelect(condition: string /* from REST Api */,
                                  actual: string /* from actual item attribute value */,
                                  operator: OperatorType): boolean {
        switch (operator) {
            case "empty":
                return (!!!actual);
            case "eq":
                return (actual == condition);
            case "gt":
                throw new Error(`Unsupported operation on ${operator} for value of type select`);
            case "gte":
                throw new Error(`Unsupported operation on ${operator} for value of type select`);
            case "lt":
                throw new Error(`Unsupported operation on ${operator} for value of type select`);
            case "lte":
                throw new Error(`Unsupported operation on ${operator} for value of type select`);
            case "not empty":
                return (!!actual);
            case "not eq":
                return (actual != condition);
            case "not gt":
                throw new Error(`Unsupported operation on ${operator} for value of type select`);
            case "not gte":
                throw new Error(`Unsupported operation on ${operator} for value of type select`);
            case "not lt":
                throw new Error(`Unsupported operation on ${operator} for value of type select`);
            case "not lte":
                throw new Error(`Unsupported operation on ${operator} for value of type select`);
            case 'contain':
                throw new Error(`Unsupported operation on ${operator} for value of type select`);
            case 'not contain':
                throw new Error(`Unsupported operation on ${operator} for value of type select`);
            case 'regexp':
                throw new Error(`Unsupported operation on ${operator} for value of type select`);
            default:
                throw new Error(`unrecognised operator ${operator} for select ${actual} and condition ${condition} comparison`);
        }
    }
    // doubleselect
    compareDoubleselect(_conditionkey1: string /* from REST Api */,
                                        _conditionkey2: string,
                                        _actualkey1: string /* from actual item attribute value */,
                                        _actualkey2: string,
                                        operator: OperatorType): boolean {
        switch (operator) {
            case 'eq':
                return ((_actualkey1 == _conditionkey1) && (_actualkey2 == _conditionkey2));
            case 'not eq':
                return (!(_actualkey1 == _conditionkey1 && _actualkey2 == _conditionkey2));
            case 'lt':
                throw new Error(`Unsupported operation on ${operator} for value of type doubleselect`);
            case 'not lt':
                throw new Error(`Unsupported operation on ${operator} for value of type doubleselect`);
            case 'gt':
                throw new Error(`Unsupported operation on ${operator} for value of type doubleselect`);
            case 'not gt':
                throw new Error(`Unsupported operation on ${operator} for value of type doubleselect`);
            case 'gte':
                throw new Error(`Unsupported operation on ${operator} for value of type doubleselect`);
            case 'not gte':
                throw new Error(`Unsupported operation on ${operator} for value of type doubleselect`);
            case 'lte':
                throw new Error(`Unsupported operation on ${operator} for value of type doubleselect`);
            case 'not lte':
                throw new Error(`Unsupported operation on ${operator} for value of type doubleselect`);
            case 'empty':
                return (!!!_actualkey1 && !!!_actualkey2);
            case 'not empty':
                return (!(!!!_actualkey1 && !!!_actualkey2));
            case 'contain':
                throw new Error(`Unsupported operation on ${operator} for value of type doubleselect`);
            case 'not contain':
                throw new Error(`Unsupported operation on ${operator} for value of type doubleselect`);
            case 'regexp':
                throw new Error(`Unsupported operation on ${operator} for value of type doubleselect`);
            default:
                throw new Error(`unrecognised operator ${operator} for doubleselect key1 ${_actualkey1} key2 ${_actualkey2} and condition key1 ${_conditionkey1} key2 ${_conditionkey2} comparison`);
        }
    }
}
const s = new CompareAttributeValuesService()
export const
    convertToCm = s.convertToCm.bind(s),
    convertToG = s.convertToG.bind(s),
    convertToCm2 = s.convertToCm2.bind(s),
    convertToMl = s.convertToMl.bind(s),
    compareDate = s.compareDate.bind(s),
    compareNumber = s.compareNumber.bind(s),
    compareString = s.compareString.bind(s),
    compareCurrency = s.compareCurrency.bind(s),
    compareVolume = s.compareVolume.bind(s),
    compareDimension = s.compareDimension.bind(s),
    compareArea = s.compareArea.bind(s),
    compareWidth = s.compareWidth.bind(s),
    compareWeight = s.compareWeight.bind(s),
    compareHeight = s.compareHeight.bind(s),
    compareLength = s.compareLength.bind(s),
    compareSelect = s.compareSelect.bind(s),
    compareDoubleselect = s.compareDoubleselect.bind(s);