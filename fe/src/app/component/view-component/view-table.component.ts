import {Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {View} from '../../model/view.model';
import {DataSource} from '@angular/cdk/table';
import {CollectionViewer, SelectionModel} from '@angular/cdk/collections';
import {BehaviorSubject, Observable} from 'rxjs';
import {ViewService} from '../../service/view-service/view.service';
import {tap} from 'rxjs/operators';
import {ViewEditorComponentEvent} from './view-editor.component';
import {ViewEditorDialogComponent} from './view-editor-dialog.component';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';

export class ViewTableDataSource extends DataSource<View> {

    subject: BehaviorSubject<View[]> = new BehaviorSubject([]);

    connect(collectionViewer: CollectionViewer): Observable<View[] | ReadonlyArray<View>> {
        return this.subject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.subject.complete();
    }

    update(view: View[]) {
        this.subject.next(view);
    }
}

export interface ViewTableComponentEvent {
    type: 'UPDATE' | 'RELOAD';
    updatedViews?: View[];
    deletedViews?: View[];
}

@Component({
    selector: 'app-view-table',
    templateUrl: './view-table.component.html',
    styleUrls: ['./view-table.component.scss']
})
export class ViewTableComponent implements OnInit {

    counter: number;

    @Input() views: View[];
    @Output() events: EventEmitter<ViewTableComponentEvent>;

    dataSource: ViewTableDataSource;

    @ViewChild('masterCheckbox', { static: false }) masterCheckbox: MatCheckbox;
    @ViewChildren('checkboxes')checkboxes: QueryList<MatCheckbox>;

    displayedColumns: string[];

    pendingSavings: View[];
    pendingDeletion: View[];

    selectionModel: SelectionModel<View>;

    constructor(private matDialog: MatDialog) {
        this.counter = -1;
        this.events = new EventEmitter();
        this.pendingSavings = [];
        this.pendingDeletion = [];
        this.selectionModel = new SelectionModel(true);
        this.displayedColumns = ['selection', 'name', 'description', 'actions'];
    }

    ngOnInit(): void {
        this.dataSource = new ViewTableDataSource();
        this.dataSource.update([...this.views]);
    }

    onEdit($event: ViewEditorComponentEvent) {
        if ($event.view) {
            this.pendingSavings.push($event.view);
        }
    }

    canSave(): boolean {
        return (this.pendingSavings.length > 0 || this.pendingDeletion.length > 0);
    }

    canDelete(): boolean {
        return (this.selectionModel.selected && this.selectionModel.selected.length > 0);
    }

    onAdd($event: MouseEvent) {
        this.matDialog.open(ViewEditorDialogComponent,
            { data: {
                view: {id: this.counter--, name: '', description: ''},
                type: 'all'
            }
        }).afterClosed().pipe(
            tap((v: View) => {
                if (v) {
                    this.views.unshift(v);
                    this.pendingSavings.push(v);
                    this.dataSource.update(this.views);
                    this.checkBoxChange(false, v);
                }
            })
        ).subscribe();
    }

    onSave($event: MouseEvent) {
        this.events.emit({
            type: 'UPDATE',
            updatedViews: this.pendingSavings,
            deletedViews: this.pendingDeletion
        } as ViewTableComponentEvent);
        this.pendingSavings = [];
        this.resetCheckboxes();
    }

    onDelete($event: MouseEvent) {
        const deleted: View[] = this.selectionModel.selected;
        let newViews: View[] = this.views;
        deleted.forEach((v: View) => {
            this.pendingDeletion.push(v);
            newViews = newViews.filter((view: View) => {
                return view.id !== v.id;
            });
        });
        this.views = newViews;
        this.dataSource.update(this.views);
        this.resetCheckboxes();
    }

    onReload($event: MouseEvent) {
        this.events.emit({ type: 'RELOAD'} as ViewTableComponentEvent);
        this.resetCheckboxes();
    }

    onCheckboxChange($event: MatCheckboxChange, view: View) {
        this.checkBoxChange($event.checked, view);
    }

    private checkBoxChange(checked: boolean, view: View) {
        if (checked) {
            this.selectionModel.select(view);
        } else {
            this.selectionModel.deselect(view);
        }
        if (this.selectionModel.selected.length === this.views.length) { // all checkboxes are checked
            this.masterCheckbox.checked = true;
            this.masterCheckbox.indeterminate = false;
        } else if (this.selectionModel.selected.length > 0) { // some of the checkboxes are selected
            this.masterCheckbox.checked = false;
            this.masterCheckbox.indeterminate = true;
        } else {
            this.masterCheckbox.checked = false;
            this.masterCheckbox.indeterminate = false;
        }
    }

    onMasterCheckboxChange($event: MatCheckboxChange) {
        this.masterCheckboxChange($event.checked);
    }

    private masterCheckboxChange(checked: boolean) {
        if (checked) {
            this.checkboxes.forEach((c: MatCheckbox) => c.checked = true);
            this.selectionModel.select(...this.views);
        } else {
            this.checkboxes.forEach((c: MatCheckbox) => c.checked = false);
            this.selectionModel.deselect(...this.views);
        }
    }

    private resetCheckboxes() {
        this.selectionModel.clear();
        this.checkboxes.forEach((c: MatCheckbox) => c.checked = false);
        this.masterCheckbox.checked = false;
        this.masterCheckbox.indeterminate = false;
    }
}
