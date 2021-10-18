import {createUnionType} from "type-graphql";
import {
    GqlAreaValue,
    GqlCurrencyValue,
    GqlDateValue,
    GqlDimensionValue, GqlDoubleSelectValue,
    GqlHeightValue,
    GqlLengthValue,
    GqlNoWorkflowConfigured,
    GqlNumberValue,
    GqlSelectValue,
    GqlStringValue,
    GqlTextValue,
    GqlVolumeValue, GqlWeightValue,
    GqlWidthValue,
    GqlWorkflowInstanceCreated,
    GqlWorkflowTriggerError
} from './common-gql-classes';
import {GraphQLScalarType, Kind} from "graphql";
import { ResponseStatus } from "@fuyuko-common/model/api-response-status.model";
import {AttributeType} from "@fuyuko-common/model/attribute.model";
import {
    NoWorkflowConfiguredType,
    Workflow,
    WorkflowInstanceCreatedType,
    WorkflowTriggerErrorType
} from "@fuyuko-common/model/workflow.model";
import {CustomBulkEditScriptInputType} from "@fuyuko-common/model/custom-bulk-edit.model";
import {ExportScriptInputType, ExportScriptInputValueType} from "@fuyuko-common/model/custom-export.model";
import {ImportScriptInputType, ImportScriptInputValueType} from "@fuyuko-common/model/custom-import.model";
import {Status} from "@fuyuko-common/model/status.model";
import {DataExportType} from "@fuyuko-common/model/data-export.model";
import {
    AreaValue,
    AreaValueType,
    CurrencyValue,
    CurrencyValueType,
    DateValue,
    DateValueType,
    DimensionValue,
    DimensionValueType,
    DoubleSelectValue, DoubleSelectValueType,
    HeightValue, HeightValueType,
    LengthValue,
    LengthValueType,
    NumberValue,
    NumberValueType,
    SelectValue, SelectValueType,
    StringValue,
    StringValueType,
    TextValue,
    TextValueType,
    VolumeValue,
    VolumeValueType,
    WeightValue, WeightValueType,
    WidthValue,
    WidthValueType
} from "@fuyuko-common/model/item.model";
import {
    AreaUnits,
    CountryCurrencyUnits,
    DimensionUnits, HeightUnits, LengthUnits,
    VolumeUnits, WeightUnits,
    WidthUnits
} from "@fuyuko-common/model/unit.model";

// === scalars


export const StringValueTypeScalar = new GraphQLScalarType({
    name: 'StringValueType',
    description: 'StringValueType scalar type',
    serialize(value): string {
        return value;
    },
    parseValue(value): StringValueType {
        return value;
    },
    parseLiteral(ast): StringValueType {
        if (ast.kind !== Kind.STRING) {
            throw new Error(`StringValueType can only be parse String values`);
        }
        return ast.value as StringValueType;
    }
});
export const TextValueTypeScalar  = new GraphQLScalarType({
    name: 'TextValueType',
    description: 'TextValueType scalar type',
    serialize(value): string {
        return value;
    },
    parseValue(value): TextValueType {
        return value;
    },
    parseLiteral(ast): TextValueType {
        if (ast.kind !== Kind.STRING) {
            throw new Error(`TextValueType can only be parse String values`);
        }
        return ast.value as TextValueType;
    }
});
export const NumberValueTypeScalar  = new GraphQLScalarType({
    name: 'NumberValueType',
    description: 'NumberValueType scalar type',
    serialize(value): string {
        return value;
    },
    parseValue(value): NumberValueType {
        return value;
    },
    parseLiteral(ast): NumberValueType {
        if (ast.kind !== Kind.STRING) {
            throw new Error(`NumberValueType can only be parse String values`);
        }
        return ast.value as NumberValueType;
    }
});
export const DateValueTypeScalar= new GraphQLScalarType({
    name: 'DateValueType',
    description: 'DateValueType scalar type',
    serialize(value): string {
        return value;
    },
    parseValue(value): DateValueType {
        return value;
    },
    parseLiteral(ast): DateValueType {
        if (ast.kind !== Kind.STRING) {
            throw new Error(`DateValueType can only be parse String values`);
        }
        return ast.value as DateValueType;
    }
});
export const CurrencyValueTypeScalar= new GraphQLScalarType({
    name: 'CurrencyValueType',
    description: 'CurrencyValueType scalar type',
    serialize(value): string {
        return value;
    },
    parseValue(value): CurrencyValueType {
        return value;
    },
    parseLiteral(ast): CurrencyValueType {
        if (ast.kind !== Kind.STRING) {
            throw new Error(`CurrencyValueType can only be parse String values`);
        }
        return ast.value as CurrencyValueType;
    }
});
export const VolumeValueTypeScalar= new GraphQLScalarType({
    name: 'VolumeValueType',
    description: 'VolumeValueType scalar type',
    serialize(value): string {
        return value;
    },
    parseValue(value): VolumeValueType {
        return value;
    },
    parseLiteral(ast): VolumeValueType {
        if (ast.kind !== Kind.STRING) {
            throw new Error(`VolumeValueType can only be parse String values`);
        }
        return ast.value as VolumeValueType;
    }
});
export const DimensionValueTypeScalar= new GraphQLScalarType({
    name: 'DimensionValueType',
    description: 'DimensionValueType scalar type',
    serialize(value): string {
        return value;
    },
    parseValue(value): DimensionValueType {
        return value;
    },
    parseLiteral(ast): DimensionValueType {
        if (ast.kind !== Kind.STRING) {
            throw new Error(`DimensionValueType can only be parse String values`);
        }
        return ast.value as DimensionValueType;
    }
});
export const AreaValueTypeScalar  = new GraphQLScalarType({
    name: 'AreaValueType',
    description: 'AreaValueType scalar type',
    serialize(value): string {
        return value;
    },
    parseValue(value): AreaValueType {
        return value;
    },
    parseLiteral(ast): AreaValueType {
        if (ast.kind !== Kind.STRING) {
            throw new Error(`AreaValueType can only be parse String values`);
        }
        return ast.value as AreaValueType;
    }
});
export const WidthValueTypeScalar  = new GraphQLScalarType({
    name: 'WidthValueType',
    description: 'WidthValueType scalar type',
    serialize(value): string {
        return value;
    },
    parseValue(value): WidthValueType {
        return value;
    },
    parseLiteral(ast): WidthValueType {
        if (ast.kind !== Kind.STRING) {
            throw new Error(`WidthValueType can only be parse String values`);
        }
        return ast.value as WidthValueType;
    }
});
export const LengthValueTypeScalar  = new GraphQLScalarType({
    name: 'LengthValueType',
    description: 'LengthValueType scalar type',
    serialize(value): string {
        return value;
    },
    parseValue(value): LengthValueType {
        return value;
    },
    parseLiteral(ast): LengthValueType {
        if (ast.kind !== Kind.STRING) {
            throw new Error(`LengthValueType can only be parse String values`);
        }
        return ast.value as LengthValueType;
    }
});
export const HeightValueTypeScalar= new GraphQLScalarType({
    name: 'HeightValueType',
    description: 'HeightValueType scalar type',
    serialize(value): string {
        return value;
    },
    parseValue(value): HeightValueType {
        return value;
    },
    parseLiteral(ast): HeightValueType {
        if (ast.kind !== Kind.STRING) {
            throw new Error(`HeightValueType can only be parse String values`);
        }
        return ast.value as HeightValueType;
    }
});
export const SelectValueTypeScalar  = new GraphQLScalarType({
    name: 'SelectValueType',
    description: 'SelectValueType scalar type',
    serialize(value): string {
        return value;
    },
    parseValue(value): SelectValueType {
        return value;
    },
    parseLiteral(ast): SelectValueType {
        if (ast.kind !== Kind.STRING) {
            throw new Error(`SelectValueType can only be parse String values`);
        }
        return ast.value as SelectValueType;
    }
});
export const DoubleSelectValueTypeScalar  = new GraphQLScalarType({
    name: 'DoubleSelectValueType',
    description: 'DoubleSelectValueType scalar type',
    serialize(value): string {
        return value;
    },
    parseValue(value): DoubleSelectValueType {
        return value;
    },
    parseLiteral(ast): DoubleSelectValueType {
        if (ast.kind !== Kind.STRING) {
            throw new Error(`DoubleSelectValueType can only be parse String values`);
        }
        return ast.value as DoubleSelectValueType;
    }
});
export const WeightValueTypeScalar= new GraphQLScalarType({
    name: 'WeightValueType',
    description: 'WeightValueType scalar type',
    serialize(value): string {
        return value;
    },
    parseValue(value): WeightValueType {
        return value;
    },
    parseLiteral(ast): WeightValueType {
        if (ast.kind !== Kind.STRING) {
            throw new Error(`WeightValueType can only be parse String values`);
        }
        return ast.value as WeightValueType;
    }
});



export const DataExportTypeScalar = new GraphQLScalarType({
    name: 'DataExportType',
    description: 'DataExportType scalar type',
    serialize(value): string {
        return value;
    },
    parseValue(value): DataExportType {
        return value;
    },
    parseLiteral(ast): DataExportType {
        if (ast.kind !== Kind.STRING) {
            throw new Error(`Status can only be parse String values`);
        }
        return ast.value as DataExportType;
    }
});


export const StatusScalar = new GraphQLScalarType({
    name: 'Status',
    description: 'Status scalar type',
    serialize(value): string {
        return value;
    },
    parseValue(value): Status {
        return value;
    },
    parseLiteral(ast): Status {
        if (ast.kind !== Kind.STRING) {
            throw new Error(`Status can only be parse String values`);
        }
        return ast.value as Status;
    }
});


export const ResponseStatusScalar = new GraphQLScalarType({
    name: 'ResponseStatus',
    description: 'ResponseStatus scalar type',
    serialize(value): string {
        return value;
    },
    parseValue(value): ResponseStatus {
        return value;
    },
    parseLiteral(ast): ResponseStatus {
        if (ast.kind !== Kind.STRING) {
            throw new Error(`ResponseStatus can only be parse String values`);
        }
        return ast.value as ResponseStatus;
    }
});

export const AttributeTypeScalar = new GraphQLScalarType({
    name: 'AttributeType',
    description: 'AttributeType scalar types',
    serialize(value): string {
        return value;
    },
    parseValue(value): AttributeType {
        return value;
    },
    parseLiteral(ast): AttributeType {
        if (ast.kind !== Kind.STRING) {
            throw new Error(`AttributeType can only be parse String values`);
        }
        return ast.value as AttributeType;
    }
})

export const WorkflowInstanceCreatedTypeScalar = new GraphQLScalarType({
    name: 'WorkflowInstanceCreatedTypeScalar',
    description: 'WorkflowInstanceCreatedType scalar type',
    serialize(value): string {
        return value;
    },
    parseValue(value): WorkflowInstanceCreatedType {
        return value;
    },
    parseLiteral(ast): WorkflowInstanceCreatedType {
        if (ast.kind !== Kind.STRING) {
            throw new Error(`WorkflowInstanceCreatedType can only be parse String values`);
        }
        return ast.value as WorkflowInstanceCreatedType;
    }
})

export const WorkflowTriggerErrorTypeScalar = new GraphQLScalarType({
    name: 'WorkflowTriggerErrorTypeScalar',
    description: 'WorkflowTriggerErrorType scalar type',
    serialize(value): string {
        return value;
    },
    parseValue(value): WorkflowTriggerErrorType {
        return value;
    },
    parseLiteral(ast): WorkflowTriggerErrorType {
        if (ast.kind !== Kind.STRING) {
            throw new Error(`WorkflowTriggerErrorType can only be parse String values`);
        }
        return ast.value as WorkflowTriggerErrorType;
    }
})

export const NoWorkflowConfiguredTypeScalar = new GraphQLScalarType({
    name: 'NoWorkflowConfiguredTypeScalar',
    description: 'NoWorkflowConfiguredType scalar type',
    serialize(value): string {
        return value;
    },
    parseValue(value): NoWorkflowConfiguredType {
        return value;
    },
    parseLiteral(ast): NoWorkflowConfiguredType {
        if (ast.kind !== Kind.STRING) {
            throw new Error(`NoWorkflowConfiguredType can only be parse String values`);
        }
        return ast.value as NoWorkflowConfiguredType;
    }
})


// CustomBulkEditScriptInputType
export const CustomBulkEditScriptInputTypeScalar = new GraphQLScalarType({
    name: 'CustomBulkEditScriptInputType',
    description: 'CustomBulkEditScriptInputType scalar type',
    serialize(value): string {
        return value;
    },
    parseValue(value): CustomBulkEditScriptInputType {
        return value;
    },
    parseLiteral(ast): CustomBulkEditScriptInputType {
        if (ast.kind !== Kind.STRING) {
            throw new Error(`CustomBulkEditScriptInputType can only be parse String values`);
        }
        return ast.value as CustomBulkEditScriptInputType;
    }
})

export const ExportScriptInputTypeScalar = new GraphQLScalarType({
    name: 'ExportScriptInputType',
    description: 'ExportScriptInputType scalar type',
    serialize(value): string {
        return value;
    },
    parseValue(value): ExportScriptInputType {
        return value;
    },
    parseLiteral(ast): ExportScriptInputType {
        if (ast.kind !== Kind.STRING) {
            throw new Error(`ExportScriptInputType can only be parse String values`);
        }
        return ast.value as ExportScriptInputType;
    }
});

export const ExportScriptInputValueTypeScalar = new GraphQLScalarType({
    name: 'ExportScriptInputValueType',
    description: 'ExportScriptInputValueType scalar type',
    serialize(value): string {
        return value;
    },
    parseValue(value): ExportScriptInputValueType {
        return value;
    },
    parseLiteral(ast): ExportScriptInputValueType {
        if (ast.kind !== Kind.STRING) {
            throw new Error(`ExportScriptInputValueType can only be parse String values`);
        }
        return ast.value as ExportScriptInputValueType;
    }
})

export const ImportScriptInputTypeScalar = new GraphQLScalarType({
    name: 'ImportScriptInputType',
    description: 'ImportScriptInputType scalar type',
    serialize(value): string {
        return value;
    },
    parseValue(value): ImportScriptInputType {
        return value;
    },
    parseLiteral(ast): ImportScriptInputType {
        if (ast.kind !== Kind.STRING) {
            throw new Error(`ImportScriptInputType can only be parse String values`);
        }
        return ast.value as ImportScriptInputType;
    }
});

export const ImportScriptInputValueTypeScalar = new GraphQLScalarType({
    name: 'ImportScriptInputValueType',
    description: 'ImportScriptInputValueType scalar type',
    serialize(value): string {
        return value;
    },
    parseValue(value): ImportScriptInputValueType {
        return value;
    },
    parseLiteral(ast): ImportScriptInputValueType {
        if (ast.kind !== Kind.STRING) {
            throw new Error(`ImportScriptInputValueType can only be parse String values`);
        }
        return ast.value as ImportScriptInputValueType;
    }
});

export const CountryCurrencyUnitsScalar = new GraphQLScalarType({
    name: 'CountryCurrencyUnits',
    description: 'CountryCurrencyUnits scalar type',
    serialize(value): string {
        return value;
    },
    parseValue(value): CountryCurrencyUnits {
        return value;
    },
    parseLiteral(ast): CountryCurrencyUnits {
        if (ast.kind !== Kind.STRING) {
            throw new Error(`CountryCurrencyUnits can only be parse String values`);
        }
        return ast.value as CountryCurrencyUnits;
    }
});

export const DimensionUnitsScalar = new GraphQLScalarType({
    name: 'DimensionUnits',
    description: 'CountryCurrencyUnit scalar type',
    serialize(value): string {
        return value;
    },
    parseValue(value): DimensionUnits {
        return value;
    },
    parseLiteral(ast): DimensionUnits {
        if (ast.kind !== Kind.STRING) {
            throw new Error(`DimensionUnits can only be parse String values`);
        }
        return ast.value as DimensionUnits;
    }
});
export const VolumeUnitsScalar = new GraphQLScalarType({
    name: 'VolumeUnits',
    description: 'VolumeUnit scalar type',
    serialize(value): string {
        return value;
    },
    parseValue(value): VolumeUnits {
        return value;
    },
    parseLiteral(ast): VolumeUnits {
        if (ast.kind !== Kind.STRING) {
            throw new Error(`VolumeUnits can only be parse String values`);
        }
        return ast.value as VolumeUnits;
    }
});
export const AreaUnitsScalar = new GraphQLScalarType({
    name: 'AreaUnits',
    description: 'AreaUnit scalar type',
    serialize(value): string {
        return value;
    },
    parseValue(value): AreaUnits {
        return value;
    },
    parseLiteral(ast): AreaUnits {
        if (ast.kind !== Kind.STRING) {
            throw new Error(`AreaUnits can only be parse String values`);
        }
        return ast.value as AreaUnits;
    }
});
export const WidthUnitsScalar = new GraphQLScalarType({
    name: 'WidthUnits',
    description: 'WidthUnit scalar type',
    serialize(value): string {
        return value;
    },
    parseValue(value): WidthUnits {
        return value;
    },
    parseLiteral(ast): WidthUnits {
        if (ast.kind !== Kind.STRING) {
            throw new Error(`WidthUnits can only be parse String values`);
        }
        return ast.value as WidthUnits;
    }
});
export const LengthUnitsScalar = new GraphQLScalarType({
    name: 'LengthUnits',
    description: 'LengthUnits scalar type',
    serialize(value): string {
        return value;
    },
    parseValue(value): LengthUnits {
        return value;
    },
    parseLiteral(ast): LengthUnits {
        if (ast.kind !== Kind.STRING) {
            throw new Error(`LengthUnits can only be parse String values`);
        }
        return ast.value as LengthUnits;
    }
});
export const HeightUnitsScalar = new GraphQLScalarType({
    name: 'HeightUnits',
    description: 'HeightUnits scalar type',
    serialize(value): string {
        return value;
    },
    parseValue(value): HeightUnits {
        return value;
    },
    parseLiteral(ast): HeightUnits {
        if (ast.kind !== Kind.STRING) {
            throw new Error(`HeightUnits can only be parse String values`);
        }
        return ast.value as HeightUnits;
    }
});
export const WeightUnitsScalar = new GraphQLScalarType({
    name: 'WeightUnits',
    description: 'WeigthUnits scalar type',
    serialize(value): string {
        return value;
    },
    parseValue(value): WeightUnits {
        return value;
    },
    parseLiteral(ast): WeightUnits {
        if (ast.kind !== Kind.STRING) {
            throw new Error(`WeightUnits can only be parse String values`);
        }
        return ast.value as WeightUnits;
    }
});


// === unions

export const WorkflowTriggerResultUnion = createUnionType({
    name: 'WorkflowTriggerResultUnion',
    types: () => [GqlNoWorkflowConfigured, GqlWorkflowInstanceCreated, GqlWorkflowTriggerError] as const,
    resolveType: value => {
        switch(value.type) {
            case 'no-workflow-configured':
                return GqlNoWorkflowConfigured;
            case 'workflow-trigger-error':
                return GqlWorkflowTriggerError;
            case 'workflow-instance-created':
                return GqlWorkflowInstanceCreated;
            default:
                return undefined;
        }
    }
});

export const ItemValTypeUnion = createUnionType({
    name: 'ItemValTypeUnion',
    types: () => [GqlStringValue, GqlTextValue, GqlNumberValue, GqlDateValue,
        GqlCurrencyValue, GqlVolumeValue, GqlDimensionValue, GqlAreaValue,
        GqlWidthValue, GqlLengthValue, GqlHeightValue, GqlSelectValue,
        GqlDoubleSelectValue, GqlWeightValue,
    ],
    resolveType: value => {
       switch(value.type) {
           case 'string':
               return GqlStringValue;
           case 'text':
               return GqlTextValue;
           case 'number':
               return GqlNumberValue;
           case 'date':
               return GqlDateValue;
           case 'currency':
               return GqlCurrencyValue;
           case 'volume':
               return GqlVolumeValue;
           case 'dimension':
               return GqlDimensionValue;
           case 'area':
               return GqlAreaValue;
           case 'width':
               return GqlWidthValue;
           case 'length':
               return GqlLengthValue;
           case 'height':
               return GqlHeightValue;
           case 'select':
               return GqlSelectValue;
           case 'doubleselect':
               return GqlDoubleSelectValue;
           case 'weight':
               return GqlWeightValue;
           default:
               return undefined;
       }
    }

});
