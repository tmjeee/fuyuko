import {Component, Input, OnInit} from '@angular/core';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {Attribute} from '../../model/attribute.model';
import {BehaviorSubject, Observable} from 'rxjs';

export class InternalDataSource extends DataSource<Attribute> {

    subject: BehaviorSubject<Attribute[]>;

    connect(collectionViewer: CollectionViewer): Observable<Attribute[] | ReadonlyArray<Attribute>> {
        if (!this.subject) {
            this.subject = new BehaviorSubject<Attribute[]>([]);
        }
        return this.subject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        if (this.subject) {
            this.subject.unsubscribe();
        }
        this.subject = undefined;
    }

    update(attributes: Attribute[]) {
        this.subject.next(attributes);
    }

}

@Component({
    selector: 'app-view-only-attribute-table',
    templateUrl: './view-only-attribute-table.component.html',
    styleUrls: ['./view-only-attribute-table.component.scss']
})
export class ViewOnlyAttributeTableComponent implements OnInit {

    dataSource: InternalDataSource;

    @Input() attributes: Attribute[];

    constructor() {
        this.dataSource = new InternalDataSource();
    }

    ngOnInit(): void {
        this.dataSource.update(this.attributes);
    }


}
