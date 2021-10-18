import 'reflect-metadata';
import {
    NoWorkflowConfigured,
    NoWorkflowConfiguredType,
    WorkflowInstanceCreated, WorkflowInstanceCreatedType,
    WorkflowTriggerError, WorkflowTriggerErrorType
} from "@fuyuko-common/model/workflow.model";
import {Field, InputType, Int, ObjectType} from "type-graphql";
import {LimitOffset} from "@fuyuko-common/model/limit-offset.model";
import {Attribute, AttributeType, Pair1, Pair2} from "@fuyuko-common/model/attribute.model";
import {
    AreaUnitsScalar,
    AreaValueTypeScalar,
    AttributeTypeScalar,
    CountryCurrencyUnitsScalar,
    CurrencyValueTypeScalar,
    CustomBulkEditScriptInputTypeScalar,
    DataExportTypeScalar,
    DateValueTypeScalar, DimensionUnitsScalar, DimensionValueTypeScalar, DoubleSelectValueTypeScalar,
    ExportScriptInputValueTypeScalar, HeightUnitsScalar, HeightValueTypeScalar,
    ImportScriptInputTypeScalar, ItemValTypeUnion, LengthUnitsScalar, LengthValueTypeScalar,
    NoWorkflowConfiguredTypeScalar,
    NumberValueTypeScalar, SelectValueTypeScalar,
    StatusScalar,
    StringValueTypeScalar,
    TextValueTypeScalar, VolumeUnitsScalar,
    VolumeValueTypeScalar, WeightUnitsScalar, WeightValueTypeScalar, WidthUnitsScalar, WidthValueTypeScalar,
    WorkflowInstanceCreatedTypeScalar,
    WorkflowTriggerErrorTypeScalar
} from "./custom-types";
import {
    CustomBulkEdit,
    CustomBulkEditScriptInput,
    CustomBulkEditScriptInputType
} from "@fuyuko-common/model/custom-bulk-edit.model";
import {CustomDataExport, ExportScriptInput, ExportScriptInputType} from "@fuyuko-common/model/custom-export.model";
import {CustomDataImport, ImportScriptInput, ImportScriptInputType} from "@fuyuko-common/model/custom-import.model";
import {CustomRule, CustomRuleForView} from "@fuyuko-common/model/custom-rule.model";
import {Status} from "@fuyuko-common/model/status.model";
import {DataExportArtifact, DataExportType} from "@fuyuko-common/model/data-export.model";
import {View} from "@fuyuko-common/model/view.model";
import {
    AreaValue,
    AreaValueType,
    CurrencyValue,
    CurrencyValueType,
    DateValue,
    DateValueType,
    DimensionValue,
    DimensionValueType,
    DoubleSelectValue,
    DoubleSelectValueType,
    HeightValue,
    HeightValueType,
    Item,
    ItemImage,
    ItemValTypes,
    LengthValue,
    LengthValueType,
    NumberValue,
    NumberValueType,
    SelectValue,
    SelectValueType,
    StringValue,
    StringValueType,
    TextValue,
    TextValueType,
    Value,
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



@ObjectType()
export class GqlItem implements Item {
    @Field(_ => Int) id!: number;
    @Field() name!: string;
    @Field() description!: string;
    @Field(_ => [GqlItemImage]) images!: ItemImage[];
    @Field(_ => Int, {nullable: true}) parentId?: number;
    @Field() creationDate!: Date;
    @Field() lastUpdate!: Date;
    @Field(_ => [GqlValue]) values!: Value[];
    @Field(_ => [GqlItem]) children!: Item[];
}

@ObjectType()
export class GqlItemImage implements ItemImage {
    @Field(_ => Int) id!: number;
    @Field() mimeType!: string;
    @Field() name!: string;
    @Field() primary!: boolean;
    @Field() size!: number;
}

@ObjectType()
export class GqlValue implements Value {
    @Field(_ => Int) attributeId!: number;
    @Field(_ => ItemValTypeUnion) val?: ItemValTypes;
}

@ObjectType()
export class GqlStringValue implements StringValue {
    @Field(_ => StringValueTypeScalar) type!: StringValueType;
    @Field() value!: string;
}
@ObjectType()
export class GqlTextValue implements TextValue {
    @Field(_ => TextValueTypeScalar) type!: TextValueType;
    @Field() value!: string;
}
@ObjectType()
export class GqlNumberValue implements NumberValue {
    @Field(_ => NumberValueTypeScalar) type!: NumberValueType;
    @Field() value!: number;
}
@ObjectType()
export class GqlDateValue implements DateValue {
    @Field(_ => DateValueTypeScalar) type!: DateValueType;
    @Field() value!: string;
}
@ObjectType()
export class GqlCurrencyValue implements CurrencyValue {
    @Field(_ => CountryCurrencyUnitsScalar) country!: CountryCurrencyUnits;
    @Field(_ => CurrencyValueTypeScalar) type!: CurrencyValueType;
    @Field() value!: number;
}
@ObjectType()
export class GqlVolumeValue implements VolumeValue {
    @Field(_ =>VolumeValueTypeScalar) type!: VolumeValueType;
    @Field(_ => VolumeUnitsScalar) unit!: VolumeUnits;
    @Field() value!: number;
}
@ObjectType()
export class GqlDimensionValue implements DimensionValue {
    @Field() height!: number;
    @Field() length!: number;
    @Field(_ => DimensionValueTypeScalar) type!: DimensionValueType;
    @Field(_ => DimensionUnitsScalar) unit!: DimensionUnits;
    @Field() width!: number;
}
@ObjectType()
export class GqlAreaValue implements AreaValue {
    @Field(_ => AreaValueTypeScalar) type!: AreaValueType;
    @Field(_ => AreaUnitsScalar) unit!: AreaUnits;
    @Field() value!: number;
}
@ObjectType()
export class GqlWidthValue implements WidthValue {
    @Field(_ => WidthValueTypeScalar) type!: WidthValueType;
    @Field(_ => WidthUnitsScalar) unit!: WidthUnits;
    @Field() value!: number;
}
@ObjectType()
export class GqlLengthValue implements LengthValue {
    @Field(_ => LengthValueTypeScalar) type!: LengthValueType;
    @Field(_ => LengthUnitsScalar) unit!: LengthUnits;
    @Field() value!: number;
}
@ObjectType()
export class GqlHeightValue implements HeightValue {
    @Field(_ => HeightValueTypeScalar) type!: HeightValueType;
    @Field(_ => HeightUnitsScalar) unit!: HeightUnits;
    @Field() value!: number;
}
@ObjectType()
export class GqlSelectValue implements SelectValue {
    @Field(_ => SelectValueTypeScalar) type!: SelectValueType;
    @Field({nullable: true}) key?: string;
}
@ObjectType()
export class GqlDoubleSelectValue implements DoubleSelectValue {
    @Field({nullable: true}) key1?: string;
    @Field({nullable: true}) key2?: string;
    @Field(_ => DoubleSelectValueTypeScalar) type!: DoubleSelectValueType;
}
@ObjectType()
export class GqlWeightValue implements WeightValue {
    @Field(_ => WeightValueTypeScalar) type!: WeightValueType;
    @Field(_ => WeightUnitsScalar) unit!: WeightUnits;
    @Field() value!: number;
}


@ObjectType()
export class GqlDataExportArtifact implements DataExportArtifact {
    @Field() creationDate!: Date;
    @Field() fileName!: string;
    @Field(_ => Int) id!: number;
    @Field() lastUpdate!: Date;
    @Field() mimeType!: string;
    @Field() name!: string;
    @Field() size!: number;
    @Field(_ => DataExportTypeScalar) type!: DataExportType;
    @Field(_ => GqlView) view!: View;
}

@ObjectType()
export class GqlView implements View {
    @Field() creationDate!: Date;
    @Field() description!: string;
    @Field(_ => Int) id!: number;
    @Field() lastUpdate!: Date;
    @Field() name!: string;
}



@ObjectType()
export class GqlCustomRuleForView implements CustomRuleForView {
    @Field(_ => Int) customRuleViewId!: number;
    @Field() description!: string;
    @Field(_ => Int) id!: number;
    @Field() name!: string;
    @Field(_ => StatusScalar) status!: Status;
    @Field(_ => Int) viewId!: number;
}


@ObjectType()
export class GqlCustomRule implements CustomRule {
    @Field() description!: string;
    @Field(_ => Int) id!: number;
    @Field() name!: string;
}

@ObjectType()
export class GqlCustomDataImport implements CustomDataImport {
    @Field() creationDate!: Date;
    @Field() description!: string;
    @Field(_ => Int) id!: number;
    @Field(_ => [GqlImportScriptInput]) inputs!: ImportScriptInput[];
    @Field() lastUpdate!: Date;
    @Field() name!: string;
}

@ObjectType()
export class GqlImportScriptInput implements ImportScriptInput {
    @Field(_ => ImportScriptInputTypeScalar) type!: ImportScriptInputType;
    @Field() name!: string;
    @Field() description!: string;
    @Field(_ => [GqlImportScriptInputOption], {nullable: true}) options?: {key: string, value: string}[];   // only valid when type is select
}

@ObjectType()
export class GqlImportScriptInputOption {
    @Field() key!: string;
    @Field() value!: string;
}

@ObjectType()
export class GqlCustomDataExport implements CustomDataExport {
    @Field() creationDate!: Date;
    @Field() description!: string;
    @Field(_ => Int) id!: number;
    @Field(_ => [GqlExportScriptInput]) inputs!: ExportScriptInput[];
    @Field() lastUpdate!: Date;
    @Field() name!: string;
}

@ObjectType()
export class GqlExportScriptInput implements ExportScriptInput {
    @Field(_ => ExportScriptInputValueTypeScalar) type!: ExportScriptInputType;
    @Field() name!: string;
    @Field() description!: string;
    @Field(_ => [GqlExportScriptInputOptions], {nullable: true}) options?: {key: string, value: string}[];   // only valid when type is select
}

@ObjectType()
export class GqlExportScriptInputOptions {
    @Field() key!: string;
    @Field() value!: string;
}

@ObjectType()
export class GqlCustomBulkEdit implements CustomBulkEdit {
    @Field() creationDate!: Date;
    @Field() description!: string;
    @Field(_ => Int) id!: number;
    @Field(_ => [GqlCustomBulkEditScriptInput]) inputs!: CustomBulkEditScriptInput[];
    @Field() lastUpdate!: Date;
    @Field() name!: string;
}

@ObjectType()
export class GqlCustomBulkEditScriptInput implements CustomBulkEditScriptInput {
    @Field(_ => CustomBulkEditScriptInputTypeScalar) type!: CustomBulkEditScriptInputType;
    @Field() name!: string;
    @Field() description!: string;
    @Field(_ => [GqlCustomBulkEditScriptInputOptions], {nullable: true}) options?: {key: string, value: string}[];   // only valid when type is select
}

@ObjectType()
export class GqlCustomBulkEditScriptInputOptions {
   @Field() key!: string;
   @Field() value!: string;
}

@ObjectType()
export class GqlAttribute implements Attribute {
    @Field() creationDate!: Date;
    @Field() description!: string;
    @Field(_ => Int) id!: number;
    @Field() lastUpdate!: Date;
    @Field() name!: string;
    @Field(_ => AttributeTypeScalar) type!: AttributeType;

    @Field() format?: string;
    @Field() showCurrencyCountry?: boolean;
    @Field(_ => [GqlPair1]) pair1?: Pair1[];
    @Field(_ => [GqlPair2]) pair2?: Pair2[];
}

@ObjectType()
export class GqlPair1 implements Pair1 {
    @Field(_ => Int) id!: number;
    @Field() key!: string;
    @Field() value!: string;
}

@ObjectType()
export class GqlPair2 implements Pair2 {
    @Field(_ => Int) id!: number;
    @Field() key1!: string;
    @Field() key2!: string;
    @Field() value!: string;
}

@InputType()
export class GqlLimitOffset implements LimitOffset {
    @Field(_ => Int) limit!: number;
    @Field(_ => Int) offset!: number;
}


@ObjectType()
export class GqlNoWorkflowConfigured implements NoWorkflowConfigured {
    @Field(_ => NoWorkflowConfiguredTypeScalar) type!: NoWorkflowConfiguredType;
}

@ObjectType()
export class GqlWorkflowInstanceCreated implements WorkflowInstanceCreated {
    @Field(_ => WorkflowInstanceCreatedTypeScalar) type!: WorkflowInstanceCreatedType;
    @Field() workflowInstanceId!: number;
}

@ObjectType()
export class GqlWorkflowTriggerError implements WorkflowTriggerError {
    @Field(_ => WorkflowTriggerErrorTypeScalar) type!: WorkflowTriggerErrorType;
    @Field() message!: string;
}
