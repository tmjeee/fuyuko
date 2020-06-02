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

export const convertToCm = (v: number, u: DimensionUnits | WidthUnits | LengthUnits | HeightUnits): number => {
    if (v == null || v == undefined) {
        return v;
    }
    switch (u) {
        case "cm":
            return v;
        case "mm":
            return (v / 10);
        case "m":
            return (v * 100);
        default:
            return v;
    }
}

export const convertToG = (v: number, u: WeightUnits): number => {
    if (v == null || v == undefined) {
        return v;
    }
    switch(u) {
        case 'g':
            return v;
        case 'kg':
            return (v * 1000);
        default:
            return v;
    }
}

export const convertToCm2 = (v: number, u: AreaUnits): number => {
    if (v == null || v == undefined) {
        return v;
    }
    switch(u) {
        case "cm2":
            return v;
        case "m2":
            return (v / (100 * 100));
        case "mm2":
            return (v * 10 * 10);
        default:
            return v;
    }
}

export const convertToMl = (v: number, u: VolumeUnits): number => {
    if (v == null || v == undefined) {
        return v;
    }
    switch(u) {
        case "l":
            return (v / 1000);
        case "ml":
            return v;
        default:
            return v;
    }
}

export const compareDate = (condition: moment.Moment,  /* from REST Api */
                            actual: moment.Moment,  /* from actual item attribute value */
                            operator: OperatorType): boolean => {
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
            return (actual && String(actual).indexOf(String(condition)) >= 0);
        case 'not contain':
            return (actual && String(actual).indexOf(String(condition)) < 0);
        case 'regexp':
            return (actual && (!!String(actual).match(String(condition))));
        default:
            throw new Error(`unrecognised operator ${operator} for date ${actual} and condition ${condition} comparison`);
    }
}

export const compareNumber = (condition: number, /* from REST api */
                              actual: number, /* from actual item attribute value */
                              operator: OperatorType): boolean => {
    switch (operator) {
        case "empty":
            return (!!!actual);
        case "eq":
            return (actual == condition);
        case "gt":
            return (actual > condition);
        case "gte":
            return (actual >= condition);
        case "lt":
            return (actual < condition);
        case "lte":
            return (actual <= condition);
        case "not empty":
            return (!!actual)
        case "not eq":
            return (actual != condition);
        case "not gt":
            return (!(actual > condition));
        case "not gte":
            return (!(actual >= condition));
        case "not lt":
            return (!(actual < condition));
        case "not lte":
            return (!(actual <= condition));
        case 'contain':
            return (actual && String(actual).indexOf(String(condition)) >= 0);
        case 'not contain':
            return (actual && String(actual).indexOf(String(condition)) < 0);
        case 'regexp':
            return (actual && (!!String(actual).match(String(condition))));
        default:
            throw new Error(`unrecognised operator ${operator} for number ${actual} and condition ${condition} comparison`);
    }
}

export const compareString = (condition: string /* from REST Api */,
                              actual: string /* from actual item attribute value */,
                              operator: OperatorType): boolean => {
    switch (operator) {
        case "empty":
            return (!!!actual);
        case "eq":
            return (actual == condition);
        case "gt":
            return (actual > condition);
        case "gte":
            return (actual >= condition);
        case "lt":
            return (actual <= condition);
        case "lte":
            return (actual <= condition);
        case "not empty":
            return (!!actual);
        case "not eq":
            return ( actual != condition);
        case "not gt":
            return (!(actual > condition));
        case "not gte":
            return (!(actual >= condition));
        case "not lt":
            return (!(actual < condition));
        case "not lte":
            return (!(actual <= condition));
        case 'contain':
            return (actual && actual.indexOf(condition) >= 0);
        case 'not contain':
            return (actual && actual.indexOf(condition) < 0);
        case 'regexp':
            return (actual && (!!actual.match(condition)));
        default:
            throw new Error(`unrecognised operator ${operator} for string ${actual} and condition ${condition} comparison`);
    }
}

// currency
export const compareCurrency = (condition: number /* from REST Api */,
                                conditionUnit: CountryCurrencyUnits,
                                actual: number /* from actual item attribute value */,
                                actualUnit: CountryCurrencyUnits,
                                operator: OperatorType): boolean => {
    if (operator !== 'empty' && operator !== 'not empty' && conditionUnit !== actualUnit) {
        return false;
    }
    switch (operator) {
        case "empty":
            return (!!!actual);
        case "eq":
            return (actual == condition);
        case "gt":
            return (actual > condition);
        case "gte":
            return (actual >= condition);
        case "lt":
            return (actual < condition);
        case "lte":
            return (actual <= condition);
        case "not empty":
            return (!!actual)
        case "not eq":
            return (actual != condition);
        case "not gt":
            return (!(actual > condition));
        case "not gte":
            return (!(actual >= condition));
        case "not lt":
            return (!(actual < condition));
        case "not lte":
            return (!(actual <= condition));
        case 'contain':
            return (actual && String(actual).indexOf(String(condition)) >= 0);
        case 'not contain':
            return (actual && String(actual).indexOf(String(condition)) < 0);
        case 'regexp':
            return (actual &&  (!!String(actual).match(String(condition))));
        default:
            throw new Error(`unrecognised operator ${operator} for currency ${actual} ${actualUnit} and condition ${condition} ${conditionUnit} comparison`);
    }
}
// volume
export const compareVolume = (_condition: number /* from REST Api */,
                              _conditionUnit: VolumeUnits,
                              _actual: number /* from actual item attribute value */,
                              _actualUnit: VolumeUnits,
                              operator: OperatorType): boolean => {
    const condition = convertToMl(_condition, _conditionUnit);
    const actual = convertToMl(_actual, _actualUnit);

    switch (operator) {
        case "empty":
            return (!!!actual);
        case "eq":
            return (actual == condition);
        case "gt":
            return (actual > condition);
        case "gte":
            return (actual >= condition);
        case "lt":
            return (actual < condition);
        case "lte":
            return (actual <= condition);
        case "not empty":
            return (!!actual)
        case "not eq":
            return (actual != condition);
        case "not gt":
            return (!(actual > condition));
        case "not gte":
            return (!(actual >= condition));
        case "not lt":
            return (!(actual < condition));
        case "not lte":
            return (!(actual <= condition));
        case 'contain':
            return (actual && String(actual).indexOf(String(condition)) >= 0);
        case 'not contain':
            return (actual && String(actual).indexOf(String(condition)) < 0);
        case 'regexp':
            return (actual && (!!String(actual).match(String(condition))));
        default:
            throw new Error(`unrecognised operator ${operator} for volume ${_actual} ${_actualUnit} and condition ${_condition} ${_conditionUnit} comparison`);
    }

}
// dimension
export const compareDimension = (_conditionLength: number /* from REST Api */,
                                _conditionWidth: number,
                                _conditionHeight: number,
                                _conditionUnit: DimensionUnits,
                                _actualLength: number /* from actual item attribute value */,
                                _actualWidth: number,
                                _actualHeight: number,
                                _actualUnit: DimensionUnits,
                                operator: OperatorType): boolean => {
    const conditionLength = convertToCm(_conditionLength, _conditionUnit);
    const conditionWidth = convertToCm(_conditionWidth, _conditionUnit);
    const conditionHeight = convertToCm(_conditionHeight, _conditionUnit);
    const actualLength = convertToCm(_actualLength, _actualUnit);
    const actualWidth = convertToCm(_actualWidth, _actualUnit);
    const actualHeight = convertToCm(_actualHeight, _actualUnit);

    switch (operator) {
        case 'eq':
            return (actualLength == conditionLength && actualWidth == conditionWidth && actualHeight == conditionHeight);
        case 'not eq':
            return (actualLength !== conditionLength && actualWidth !== conditionWidth && actualHeight !== conditionHeight);
        case 'lt':
            return (actualLength < conditionLength && actualWidth < conditionWidth && actualHeight < conditionHeight);
        case 'not lt':
            return !(actualLength < conditionLength && actualWidth < conditionWidth && actualHeight < conditionHeight);
        case 'gt':
            return (actualLength > conditionLength && actualWidth > conditionWidth && actualHeight > conditionHeight);
        case 'not gt':
            return !(actualLength > conditionLength && actualWidth > conditionWidth && actualHeight > conditionHeight);
        case 'gte':
            return (actualLength >= conditionLength && actualWidth >= conditionWidth && actualHeight >= conditionHeight);
        case 'not gte':
            return !(actualLength >= conditionLength && actualWidth >= conditionWidth && actualHeight >= conditionHeight);
        case 'lte':
            return (actualLength <= conditionLength && actualWidth <= conditionWidth && actualHeight<= conditionHeight);
        case 'not lte':
            return !(actualLength <= conditionLength && actualWidth <= conditionWidth && actualHeight<= conditionHeight);
        case 'empty':
            return (!!!actualLength) && (!!!actualWidth) && (!!!actualHeight);
        case 'not empty':
            return (!!actualLength) && (!!actualWidth) && (!!actualHeight);
        case 'contain':
            return (actualLength && String(actualLength).indexOf(String(conditionLength)) >= 0) && actualWidth && (String(actualWidth).indexOf(String(conditionWidth)) >= 0) && actualHeight && (String(actualHeight).indexOf(String(conditionHeight)) >= 0);
        case 'not contain':
            return (actualLength && String(actualLength).indexOf(String(conditionLength)) < 0) && actualWidth && (String(actualWidth).indexOf(String(conditionWidth)) < 0) && actualHeight && (String(actualHeight).indexOf(String(conditionHeight)) < 0);
        case 'regexp':
            return (actualLength  && (!!String(actualLength).match(String(conditionLength)))) && actualWidth && (!!String(actualWidth).match(String(conditionWidth))) && actualHeight && (!!String(actualHeight).match(String(conditionHeight)));
        default:
            throw new Error(`unrecognised operator ${operator} for dimension length ${actualLength} width ${actualWidth} height ${actualHeight} unit ${_actualUnit} and condition length ${conditionLength} width ${conditionWidth} height ${conditionHeight} unit ${_conditionUnit} comparison`);
    }
}
// area
export const compareArea = (_condition: number /* from REST Api */,
                            _conditionUnit: AreaUnits,
                            _actual: number /* from actual item attribute value */,
                            _actualUnit: AreaUnits,
                            operator: OperatorType): boolean => {
    const condition = convertToCm2(_condition, _conditionUnit);
    const actual = convertToCm2(_actual, _actualUnit);

    switch (operator) {
        case "empty":
            return (!!!actual);
        case "eq":
            return (actual == condition);
        case "gt":
            return (actual > condition);
        case "gte":
            return (actual >= condition);
        case "lt":
            return (actual < condition);
        case "lte":
            return (actual <= condition);
        case "not empty":
            return (!!actual)
        case "not eq":
            return (actual != condition);
        case "not gt":
            return (!(actual > condition));
        case "not gte":
            return (!(actual >= condition));
        case "not lt":
            return (!(actual < condition));
        case "not lte":
            return (!(actual <= condition));
        case 'contain':
            return actual && (String(actual).indexOf(String(condition)) >= 0);
        case 'not contain':
            return actual && (String(actual).indexOf(String(condition)) < 0);
        case 'regexp':
            return actual && (!!String(actual).match(String(condition)));
        default:
            throw new Error(`unrecognised operator ${operator} for area ${actual} ${_actualUnit} and condition ${condition} ${_conditionUnit} comparison`);
    }
}
// width
export const compareWidth = (_condition: number /* from REST Api */,
                             _conditionUnit: WidthUnits,
                             _actual: number /* from actual item attribute value */,
                             _actualUnit: WidthUnits,
                             operator: OperatorType): boolean => {
    const condition = convertToCm(_condition, _conditionUnit);
    const actual = convertToCm(_actual, _actualUnit);

    /////////////////////////////////////
    switch (operator) {
        case "empty":
            return (!!!actual);
        case "eq":
            return (actual == condition);
        case "gt":
            return (actual > condition);
        case "gte":
            return (actual >= condition);
        case "lt":
            return (actual < condition);
        case "lte":
            return (actual <= condition);
        case "not empty":
            return (!!actual)
        case "not eq":
            return (actual != condition);
        case "not gt":
            return (!(actual > condition));
        case "not gte":
            return (!(actual >= condition));
        case "not lt":
            return (!(actual < condition));
        case "not lte":
            return (!(actual <= condition));
        case 'contain':
            return actual && (String(actual).indexOf(String(condition)) >= 0);
        case 'not contain':
            return actual && (String(actual).indexOf(String(condition)) < 0);
        case 'regexp':
            return actual && (!!String(actual).match(String(condition)));
        default:
            throw new Error(`unrecognised operator ${operator} for width ${actual} ${_actualUnit} and condition ${condition} ${_conditionUnit} comparison`);
    }
}
// weight
export const compareWeight = (_condition: number /* from REST Api */,
                             _conditionUnit: WeightUnits,
                             _actual: number /* from actual item attribute value */,
                             _actualUnit: WeightUnits,
                             operator: OperatorType): boolean => {
    const condition = convertToG(_condition, _conditionUnit);
    const actual = convertToG(_actual, _actualUnit);

    /////////////////////////////////////
    switch (operator) {
        case "empty":
            return (!!!actual);
        case "eq":
            return (actual == condition);
        case "gt":
            return (actual > condition);
        case "gte":
            return (actual >= condition);
        case "lt":
            return (actual < condition);
        case "lte":
            return (actual <= condition);
        case "not empty":
            return (!!actual)
        case "not eq":
            return (actual != condition);
        case "not gt":
            return (!(actual > condition));
        case "not gte":
            return (!(actual >= condition));
        case "not lt":
            return (!(actual < condition));
        case "not lte":
            return (!(actual <= condition));
        case 'contain':
            return actual && (String(actual).indexOf(String(condition)) >= 0);
        case 'not contain':
            return actual && (String(actual).indexOf(String(condition)) < 0);
        case 'regexp':
            return actual && (!!String(actual).match(String(condition)));
        default:
            throw new Error(`unrecognised operator ${operator} for weight ${actual} ${_actualUnit} and condition ${condition} ${_conditionUnit} comparison`);
    }
}
// height
export const compareHeight = (_condition: number /* from REST Api */,
                              _conditionUnit: HeightUnits,
                              _actual: number /* from actual item attribute value */,
                              _actualUnit: HeightUnits,
                              operator: OperatorType): boolean => {
    const condition = convertToCm(_condition, _conditionUnit);
    const actual = convertToCm(_actual, _actualUnit);
    /////////////////////////////////
    switch (operator) {
        case "empty":
            return (!!!actual);
        case "eq":
            return (actual == condition);
        case "gt":
            return (actual > condition);
        case "gte":
            return (actual >= condition);
        case "lt":
            return (actual < condition);
        case "lte":
            return (actual <= condition);
        case "not empty":
            return (!!actual)
        case "not eq":
            return (actual != condition);
        case "not gt":
            return (!(actual > condition));
        case "not gte":
            return (!(actual >= condition));
        case "not lt":
            return (!(actual < condition));
        case "not lte":
            return (!(actual <= condition));
        case 'contain':
            return actual && (String(actual).indexOf(String(condition)) >= 0);
        case 'not contain':
            return actual && (String(actual).indexOf(String(condition)) < 0);
        case 'regexp':
            return actual && (!!String(actual).match(String(condition)));
        default:
            throw new Error(`unrecognised operator ${operator} for height ${actual} ${_actualUnit} and condition ${condition} ${_conditionUnit} comparison`);
    }
}
// length
export const compareLength = (_condition: number /* from REST Api */,
                              _conditionUnit: LengthUnits,
                              _actual: number /* from actual item attribute value */,
                              _actualUnit: LengthUnits,
                              operator: OperatorType): boolean => {
    const condition = convertToCm(_condition, _conditionUnit);
    const actual = convertToCm(_actual, _actualUnit);
    ///////////////////////////
    switch (operator) {
        case "empty":
            return (!!!actual);
        case "eq":
            return (actual == condition);
        case "gt":
            return (actual > condition);
        case "gte":
            return (actual >= condition);
        case "lt":
            return (actual < condition);
        case "lte":
            return (actual <= condition);
        case "not empty":
            return (!!actual)
        case "not eq":
            return (actual != condition);
        case "not gt":
            return (!(actual > condition));
        case "not gte":
            return (!(actual >= condition));
        case "not lt":
            return (!(actual < condition));
        case "not lte":
            return (!(actual <= condition));
        case 'contain':
            return actual && (String(actual).indexOf(String(condition)) >= 0);
        case 'not contain':
            return actual && (String(actual).indexOf(String(condition)) < 0);
        case 'regexp':
            return actual && (!!String(actual).match(String(condition)));
        default:
            throw new Error(`unrecognised operator ${operator} for length ${actual} ${_actualUnit} and condition ${condition} ${_conditionUnit} comparison`);
    }
}
// select
export const compareSelect = (condition: string /* from REST Api */,
                              actual: string /* from actual item attribute value */,
                              operator: OperatorType): boolean => {
    switch (operator) {
        case "empty":
            return (!!!actual);
        case "eq":
            return (actual == condition);
        case "gt":
            return (actual > condition);
        case "gte":
            return (actual >= condition);
        case "lt":
            return (actual <= condition);
        case "lte":
            return (actual <= condition);
        case "not empty":
            return (!!actual);
        case "not eq":
            return ( actual != condition);
        case "not gt":
            return (!(actual > condition));
        case "not gte":
            return (!(actual >= condition));
        case "not lt":
            return (!(actual < condition));
        case "not lte":
            return (!(actual <= condition));
        case 'contain':
            return actual && (actual.indexOf(condition) >= 0);
        case 'not contain':
            return actual && (actual.indexOf(condition) < 0);
        case 'regexp':
            return actual && (!!actual.match(condition));
        default:
            throw new Error(`unrecognised operator ${operator} for select ${actual} and condition ${condition} comparison`);
    }
}
// doubleselect
export const compareDoubleselect = (_conditionkey1: string /* from REST Api */,
                                    _conditionkey2: string,
                                    _actualkey1: string /* from actual item attribute value */,
                                    _actualkey2: string,
                                    operator: OperatorType): boolean => {
    switch (operator) {
        case 'eq':
            return (_actualkey1 == _conditionkey1 && _actualkey2 == _conditionkey2);
        case 'not eq':
            return (_actualkey1 !== _conditionkey1 && _actualkey2 !== _conditionkey2);
        case 'lt':
            return (_actualkey1 == _conditionkey1 && _actualkey2 < _conditionkey2);
        case 'not lt':
            return (_actualkey1 == _conditionkey1 && !(_actualkey2 < _conditionkey2));
        case 'gt':
            return (_actualkey1 == _conditionkey1 && _actualkey2 > _conditionkey2);
        case 'not gt':
            return (_actualkey1 == _conditionkey1 && !(_actualkey2 > _conditionkey2));
        case 'gte':
            return (_actualkey1 == _conditionkey1 && _actualkey2 >= _conditionkey2);
        case 'not gte':
            return (_actualkey1 == _conditionkey1 && !(_actualkey2 >= _conditionkey2));
        case 'lte':
            return (_actualkey1 == _conditionkey1 && _actualkey2 <= _conditionkey2);
        case 'not lte':
            return (_actualkey1 == _conditionkey1 && !(_actualkey2 <= _conditionkey2));
        case 'empty':
            return (!!!_actualkey1 && !!!_actualkey2);
        case 'not empty':
            return (!!_actualkey1 && !!_actualkey2);
        case 'contain':
            return _actualkey1 && (_actualkey1.indexOf(_conditionkey1) >= 0) && (_actualkey2.indexOf(_conditionkey2) >= 0);
        case 'not contain':
            return _actualkey1 && (_actualkey1.indexOf(_conditionkey1) < 0) && (_actualkey2.indexOf(_conditionkey2) < 0);
        case 'regexp':
            return _actualkey1 && (!!_actualkey1.match(_conditionkey1)) && (!!_actualkey2.match(_conditionkey2));
        default:
            throw new Error(`unrecognised operator ${operator} for doubleselect key1 ${_actualkey1} key2 ${_actualkey2} and condition key1 ${_conditionkey1} key2 ${_conditionkey2} comparison`);
    }
}

