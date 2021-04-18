import {Attribute} from '@fuyuko-common/model/attribute.model';
import {
    AREA_OPERATOR_TYPES,
    CURRENCY_OPERATOR_TYPES,
    DATE_OPERATOR_TYPES,
    DIMENSION_OPERATOR_TYPES,
    DOUBLE_SELECT_OPERATOR_TYPES,
    HEIGHT_OPERATOR_TYPES,
    LENGTH_OPERATOR_TYPES,
    NUMBER_OPERATOR_TYPES,
    OPERATORS_WITHOUT_CONFIGURATBLE_VALUES,
    OperatorType,
    SELECT_OPERATOR_TYPES,
    STRING_OPERATOR_TYPES,
    TEXT_OPERATOR_TYPES,
    VOLUME_OPERATOR_TYPES,
    WIDTH_OPERATOR_TYPES
} from '@fuyuko-common/model/operator.model';

export const operatorNeedsItemValue = (operator: OperatorType) => {
    return (OPERATORS_WITHOUT_CONFIGURATBLE_VALUES.findIndex((o: OperatorType) => o === operator) < 0);
};

export const operatorsForAttribute = (attribute: Attribute): OperatorType[] => {
    let operators: OperatorType[] = [];
    switch (attribute.type) {
        case 'string':
            operators = STRING_OPERATOR_TYPES;
            break;
        case 'text':
            operators = TEXT_OPERATOR_TYPES;
            break;
        case 'number':
            operators = NUMBER_OPERATOR_TYPES;
            break;
        case 'date':
            operators = DATE_OPERATOR_TYPES;
            break;
        case 'currency':
            operators = CURRENCY_OPERATOR_TYPES;
            break;
        case 'area':
            operators = AREA_OPERATOR_TYPES;
            break;
        case 'volume':
            operators = VOLUME_OPERATOR_TYPES;
            break;
        case 'width':
            operators = WIDTH_OPERATOR_TYPES;
            break;
        case 'length':
            operators = LENGTH_OPERATOR_TYPES;
            break;
        case 'height':
            operators = HEIGHT_OPERATOR_TYPES;
            break;
        case 'dimension':
            operators = DIMENSION_OPERATOR_TYPES;
            break;
        case 'select':
            operators = SELECT_OPERATOR_TYPES;
            break;
        case 'doubleselect':
            operators = DOUBLE_SELECT_OPERATOR_TYPES;
            break;
    }
    return operators;
};
