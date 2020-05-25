import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    QueryList,
    Type,
    ViewChild,
    ViewChildren, ViewContainerRef
} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {MatSelectChange} from '@angular/material/select';
import {
    DashboardStrategy,
    DashboardWidgetInfo,
    DashboardWidgetInstance
} from '../../model/dashboard.model';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import * as uuid from 'uuid/v1';
import {WidgetContainerComponent} from './widget-container.component';
import {User} from "../../model/user.model";




export interface DashboardComponentEvent {
    serializedData: string;
}

export interface DragAndDropData {
    columnIndex: number;
    widgetInstances: DashboardWidgetInstance[];
}


@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    @Input() currentUser: User;

    @Input() strategies: DashboardStrategy[];
    @Input() initialStrategy: DashboardStrategy;

    @Input() dashboardWidgetInfos: DashboardWidgetInfo[];
    @Input() data: string;

    @Output() events: EventEmitter<DashboardComponentEvent>;

    @ViewChildren('widgetPanel', {read: ViewContainerRef}) widgetPanels: QueryList<ViewContainerRef>;
    @ViewChildren('widgetContainer', {read: WidgetContainerComponent}) widgetContainers: QueryList<WidgetContainerComponent>;


    prevStrategy: DashboardStrategy;
    columnIndexes: number[];
    formControlDashboardStrategySelected: FormControl;
    formControlWidgetInfoSelected: FormControl;


    constructor(private formBuilder: FormBuilder) {
        this.events = new EventEmitter<DashboardComponentEvent>();
    }

    ngOnInit(): void {
        this.formControlDashboardStrategySelected = this.formBuilder.control(this.initialStrategy, [Validators.required]);
        this.formControlWidgetInfoSelected = this.formBuilder.control(undefined);
        this.columnIndexes = this.getCurrentStrategy().columnIndexes();
        this.prevStrategy = this.initialStrategy;
        if (this.data) {
            this.getCurrentStrategy().deserialize(this.data);
        }
    }

    onDashboardStrategySelectionChanged($event: MatSelectChange) {
        const d = this.prevStrategy.serialize();
        this.setCurrentStrategy($event.value as DashboardStrategy);
        this.columnIndexes = this.getCurrentStrategy().columnIndexes();
        this.getCurrentStrategy().deserialize(d);
        this.prevStrategy = this.getCurrentStrategy();
    }

    setCurrentStrategy(dashboardStrategy: DashboardStrategy) {
        this.formControlDashboardStrategySelected.setValue(dashboardStrategy);
    }

    getCurrentStrategy(): DashboardStrategy {
        return this.formControlDashboardStrategySelected.value as DashboardStrategy;
    }


    onDashboardWidgetInfoSelectionChanged($event: MatSelectChange) {
        const selectedDashboardWidgetInfo: DashboardWidgetInfo = $event.value;
        this.getCurrentStrategy().addDashboardWidgetInstances([{
            instanceId: uuid(),
            typeId: selectedDashboardWidgetInfo.id,
        }]);
        this.formControlWidgetInfoSelected.setValue(undefined);
    }

    getDragAndDropData(columnIndex: number): DragAndDropData {
        const d: DashboardWidgetInstance[] = this.getCurrentStrategy().getDashboardWidgetInstancesForColumn(columnIndex);
        return {
            columnIndex,
            widgetInstances: d
        };
    }

    onDrop($event: CdkDragDrop<DragAndDropData, any>) {
        if ($event.container === $event.previousContainer) { // move across the same column
            moveItemInArray($event.container.data.widgetInstances, $event.previousIndex, $event.currentIndex);
            this.getCurrentStrategy().moveDashboardWidgetInstances(
                $event.container.data.columnIndex, $event.previousIndex, $event.currentIndex);
        } else { // move across different columns
            transferArrayItem($event.previousContainer.data, $event.container.data.widgetInstances,
                $event.previousIndex, $event.currentIndex);
            this.getCurrentStrategy().transferDashboardWidgetInstances(
                $event.previousContainer.data.columnIndex, $event.container.data.columnIndex, $event.previousIndex, $event.currentIndex);
        }
    }

    saveDashboardLayout($event: MouseEvent) {
        const data = this.getCurrentStrategy().serialize();
        this.events.emit({serializedData: data} as DashboardComponentEvent);
    }

    onCloseWidget($event: MouseEvent, widgetInstance: DashboardWidgetInstance) {
        const c: WidgetContainerComponent = this.widgetContainers.find((comp: WidgetContainerComponent) => {
            return comp.dashboardWidgetInstance.instanceId === widgetInstance.instanceId;
        });
        if (c) {
            c.destroy();
        }

        const itemFound: ViewContainerRef = this.widgetPanels.find((item: ViewContainerRef) => {
            const element: HTMLElement = item.element.nativeElement;
            const id = element.getAttribute('instanceId');
            return id === widgetInstance.instanceId;
        });
        if (itemFound) {
            itemFound.clear();
            const htmlElement: HTMLElement = itemFound.element.nativeElement;
            htmlElement.parentElement.removeChild(htmlElement);
            this.getCurrentStrategy().removeDashboardWidgetInstances([widgetInstance.instanceId]);
        }
    }
}
