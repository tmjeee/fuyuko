import {Component, Inject} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {View} from '../../model/view.model';
import {
    WORKFLOW_INSTANCE_ACTION,
    WORKFLOW_INSTANCE_TYPE,
    WorkflowDefinition,
    WorkflowInstanceAction, WorkflowInstanceType
} from '../../model/workflow.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Attribute} from '../../model/attribute.model';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {GetAttributesByViewFn} from './workflow.component';
import {MatSelectChange} from '@angular/material/select';
import {tap} from 'rxjs/operators';

export type WorkflowEditorDialogComponentResult = WorkflowEditorDialogComponentSuccessResult | undefined;
export type WorkflowEditorDialogComponentSuccessResult = {
    view: View,
    workflowName: string,
    workflowAction: WorkflowInstanceAction,
    workflowType: WorkflowInstanceType,
    workflowDefinition: WorkflowDefinition,
    workflowAttributeIds: number[], // only when type = 'AttributeValue'
};

@Component({
    templateUrl: './workflow-editor-dialog.component.html',
    styleUrls: ['./workflow-editor-dialog.component.scss']
})
export class WorkflowEditorDialogComponent {

    formGroup: FormGroup;
    formControlName: FormControl;
    formControlSelectedView: FormControl;
    formControlAction: FormControl;
    formControlType: FormControl;
    formControlWorkflowDefinition: FormControl;
    formControlViewAttributes: FormControl;
    selectAllAttributes: boolean;

    views: View[];
    viewAttributes: Attribute[];
    workflowDefinitions: WorkflowDefinition[];

    actions: string[];
    types: string[];

    constructor(private formBuilder: FormBuilder,
                private matDialogRef: MatDialogRef<WorkflowEditorDialogComponent>,
                @Inject(MAT_DIALOG_DATA) private matData: {
                            views: View[],
                            getAttributesByViewFn: GetAttributesByViewFn,
                            workflowDefinitions: WorkflowDefinition[] }) {
        this.views = matData.views;
        this.viewAttributes = [];
        this.workflowDefinitions = matData.workflowDefinitions;

        this.formControlName = formBuilder.control('', [Validators.required]);
        this.formControlSelectedView = formBuilder.control(undefined, [Validators.required]);
        this.formControlAction = formBuilder.control(undefined, [Validators.required]);
        this.formControlType = formBuilder.control(undefined, [Validators.required]);
        this.formControlWorkflowDefinition = formBuilder.control(undefined, [Validators.required]);
        this.formControlViewAttributes = formBuilder.control([]);
        this.formGroup = formBuilder.group({
            selectedView: this.formControlSelectedView,
            name: this.formControlName,
            action: this.formControlAction,
            type: this.formControlType,
            attributes: this.formControlViewAttributes,
            workflowDefinition: this.formControlWorkflowDefinition
        });

        this.actions = [...WORKFLOW_INSTANCE_ACTION];
        this.types = [...WORKFLOW_INSTANCE_TYPE];
    }

    close() {
        this.matDialogRef.close(undefined);
    }

    submit() {
        const r: WorkflowEditorDialogComponentSuccessResult = {
            view: this.formControlSelectedView.value,
            workflowName: this.formControlName.value,
            workflowAction: this.formControlAction.value,
            workflowType: this.formControlType.value,
            workflowDefinition: this.formControlWorkflowDefinition.value,
            workflowAttributeIds: this.formControlViewAttributes.value.map((a: Attribute) => a.id),
        };
        this.matDialogRef.close(r);
    }

    onAttributeChange(attribute: Attribute, $event: MatCheckboxChange) {
        const selectedAttributes: Attribute[] = this.formControlViewAttributes.value;
        const attributeIndexInSelection = selectedAttributes.findIndex((a: Attribute) => a.id === attribute.id);
        if ($event.checked && attributeIndexInSelection === -1) {
            // checked and not found in selection list, we add it in, to keep the list in sync
            selectedAttributes.push(attribute);
        } else if (!$event.checked && attributeIndexInSelection !== -1) {
            // not checked and found in selection, we remove it, to keep the list in sync
            selectedAttributes.splice(attributeIndexInSelection, 1);
        }
    }

    onViewChanged($event: MatSelectChange) {
        const view: View = $event.value;
        this.matData.getAttributesByViewFn(view)
            .pipe(
                tap(attributes => {
                   this.viewAttributes = attributes;
                })
            ).subscribe();
    }

    onSelectAllAttributes($event: MatCheckboxChange) {
        this.selectAllAttributes = $event.checked;
        if (this.selectAllAttributes) {
            this.formControlViewAttributes.setValue([...this.viewAttributes]);
        } else {
            this.formControlViewAttributes.setValue([]);
        }
    }

    isAttributeSelected(attribute: Attribute) {
        const attributes: Attribute[] = this.formControlViewAttributes.value;
        return attributes.includes(attribute);
    }

    isAttributeSelectionAllowed() {
        const type = this.formControlType.value;
        const view = this.formControlSelectedView.value;
        return (view && type === 'AttributeValue');
    }
}
