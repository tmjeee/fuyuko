import {Component, Input, OnChanges} from '@angular/core';
import {WorkflowDefinition} from '@fuyuko-common/model/workflow.model';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {DataSource} from '@angular/cdk/table';
import {CollectionViewer} from '@angular/cdk/collections';
import {BehaviorSubject, Observable} from 'rxjs';
import {NgChanges} from '../../utils/types.util';

class InternalDataSource extends DataSource<WorkflowDefinition> {

    private subject = new BehaviorSubject([]);

    connect(collectionViewer: CollectionViewer): Observable<WorkflowDefinition[] | ReadonlyArray<WorkflowDefinition>> {
        return this.subject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.subject.complete();
    }

    refresh(workflowDefinitions: WorkflowDefinition[]) {
        this.subject.next(workflowDefinitions);
    }

}

@Component({
    selector: 'app-workflow-definition-table',
    templateUrl: './workflow-definition-table.component.html',
    styleUrls: ['./workflow-definition-table.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({height: '0px', minHeight: '0'})),
            state('expanded', style({height: '*'})),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class WorkflowDefinitionTableComponent implements OnChanges {

    dataSource = new InternalDataSource();
    private workflowDefinitionExpandedMap = new Map<string, boolean>();
    columnsToDisplay: string[] = ['name'];

    @Input() workflowDefinitions: WorkflowDefinition[] = [];

    isWorkflowDefinitionColumnExpanded(workflowDefinition: WorkflowDefinition): boolean {
        const expanded = !!(this.workflowDefinitionExpandedMap.get(workflowDefinition.name));
        this.workflowDefinitionExpandedMap.set(workflowDefinition.name, expanded);
        return expanded;
    }

    expandWorkflowDefinitionColumn(workflowDefinition: WorkflowDefinition) {
        const expanded = !!!(this.workflowDefinitionExpandedMap.get(workflowDefinition.name));
        this.workflowDefinitionExpandedMap.set(workflowDefinition.name, expanded);
        return expanded;
    }

    ngOnChanges(changes: NgChanges<WorkflowDefinitionTableComponent>): void {
        if (changes.workflowDefinitions) {
            this.dataSource.refresh(changes.workflowDefinitions.currentValue);
        }
    }
}
