import {Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges} from '@angular/core';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {Attribute} from '@fuyuko-common/model/attribute.model';
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
        this.subject = new BehaviorSubject<Attribute[]>([]);
    }

    update(attributes: Attribute[]) {
        if (!this.subject) {
            this.subject = new BehaviorSubject<Attribute[]>([]);
        }
        this.subject.next(attributes);
    }

}

@Component({
    selector: 'app-view-only-attribute-table',
    templateUrl: './view-only-attribute-table.component.html',
    styleUrls: ['./view-only-attribute-table.component.scss']
})
export class ViewOnlyAttributeTableComponent implements OnInit, OnChanges {

    dataSource: InternalDataSource;

    @Input() attributes: Attribute[];
    displayedColumns: string[];

    constructor() {
        this.displayedColumns = ['name', 'description', 'type', 'metadata'];
        this.dataSource = new InternalDataSource();
    }

    ngOnInit(): void {
        this.dataSource.update(this.attributes);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes.attributes) {
            const simpleChange: SimpleChange = changes.attributes;
            if (simpleChange.currentValue) {
                this.dataSource.update(simpleChange.currentValue);
            }
        }
    }


}
