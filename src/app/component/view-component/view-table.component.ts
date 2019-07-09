import {Component, Input, OnInit} from '@angular/core';
import {View} from '../../model/view.model';
import {DataSource} from '@angular/cdk/table';
import {CollectionViewer, SelectionModel} from '@angular/cdk/collections';
import {BehaviorSubject, Observable} from 'rxjs';
import {ViewService} from "../../service/view-service/view.service";
import {tap} from "rxjs/operators";


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

@Component({
    selector: 'app-view-table',
    templateUrl: './view-table.component.html',
    styleUrls: ['./view-table.component.scss']
})
export class ViewTableComponent implements OnInit {

    @Input() views: View[];

    dataSource: ViewTableDataSource;

    displayedColumns: string[];

    pendingSavings: View[];

    selectionModel: SelectionModel<View>;

    constructor() {
        this.pendingSavings = [];
        this.selectionModel = new SelectionModel();
        this.displayedColumns = ['selection', 'name', 'description', 'actions'];
    }

    ngOnInit(): void {
        this.dataSource = new ViewTableDataSource();
        this.dataSource.update([...this.views]);
    }

}
