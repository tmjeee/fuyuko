import {Component, Input, OnInit, Type} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {MatSelectChange} from '@angular/material/select';
import {DashboardStrategy, DashboardWidget, DashboardWidgetInfo} from '../../model/dashboard.model';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {WidgetContainerComponent} from './widget-container.component';






@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    @Input() strategies: DashboardStrategy[];
    @Input() initialStrategy: DashboardStrategy;

    @Input() dashboardWidgetInfos: DashboardWidgetInfo[];
    @Input() dashboardWidgetTypes: Type<DashboardWidget>[];
    // @Input() dashboardWidgetTypes: DashboardWidgetType[];


    columnIndexes: number[];
    formControlDashboardStrategySelected: FormControl;
    formControlWidgetInfoSelected: FormControl;


    constructor(private formBuilder: FormBuilder) {
    }

    ngOnInit(): void {
        this.formControlDashboardStrategySelected = this.formBuilder.control(this.initialStrategy, [Validators.required]);
        this.formControlWidgetInfoSelected = this.formBuilder.control(undefined);
        this.reload();
    }

    onDashboardStrategySelectionChanged($event: MatSelectChange) {
        this.formControlDashboardStrategySelected.setValue($event.value as DashboardStrategy);
        this.reload();
    }

    currentStrategy(): DashboardStrategy {
        return this.formControlDashboardStrategySelected.value as DashboardStrategy;
    }

    reload() {
        this.columnIndexes = this.currentStrategy().columnIndexes();
        this.currentStrategy().addDashboardWidgetTypes(this.dashboardWidgetTypes);
        // this.currentStrategy().addDashboardWidgetTypes({ type: this.dashboardWidgetTypes, data: {}});
        console.log(this.columnIndexes);
    }

    onDashboardWidgetInfoSelectionChanged($event: MatSelectChange) {
        const selectedDashboardWidgetInfo: DashboardWidgetInfo = $event.value;
        this.currentStrategy().addDashboardWidgetTypes([selectedDashboardWidgetInfo.type]);
        // this.currentStrategy().addDashboardWidgetTypes([{ type: selectedDashboardWidgetInfo.type, data: {}}]);
        this.formControlWidgetInfoSelected.setValue(undefined);
    }

    // getDashboardWidgetTypesForColumn(columnIndex: number): DashboardWidgetType {
    getDashboardWidgetTypesForColumn(columnIndex: number): Type<DashboardWidget>[]  {
        return this.currentStrategy().getDashboardWidgetTypesForColumn(columnIndex);
    }

    onDrop($event: CdkDragDrop<Type<DashboardWidget>[], any>) {
        if ($event.container === $event.previousContainer) {
            moveItemInArray($event.container.data, $event.previousIndex, $event.currentIndex);
        } else {
            transferArrayItem($event.previousContainer.data, $event.container.data, $event.previousIndex, $event.currentIndex);
        }
    }
}
