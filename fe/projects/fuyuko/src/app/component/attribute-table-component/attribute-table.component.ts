import {Component, EventEmitter, Input, OnChanges, Output, SimpleChange, SimpleChanges} from '@angular/core';
import {FormBuilder, FormControl} from '@angular/forms';
import {DataSource} from '@angular/cdk/table';
import {Attribute} from '@fuyuko-common/model/attribute.model';
import {CollectionViewer} from '@angular/cdk/collections';
import {BehaviorSubject, Observable } from 'rxjs';
import {View} from '@fuyuko-common/model/view.model';

class AttributeTableDataSource extends DataSource<Attribute> {

  private subject: BehaviorSubject<Attribute[]> = new BehaviorSubject([] as Attribute[]);

  connect(collectionViewer: CollectionViewer): Observable<Attribute[] | ReadonlyArray<Attribute>> {
    return this.subject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.subject.complete();
  }

  update(attributes: Attribute[]) {
    this.subject.next(attributes);
  }
}

type EventType = 'delete' | 'search' | 'add' | 'edit';

export interface AttributeTableComponentEvent {
  type: EventType;
  search?: string; // only available when search
  view?: View; // available in all delete search add and edit
  attribute?: Attribute; // only available when delete, edit
}

@Component({
  selector: 'app-attribute-table',
  templateUrl: './attribute-table.component.html',
  styleUrls: ['./attribute-table.component.scss'],
})
export class AttributeTableComponent implements OnChanges {

  @Input() searchFieldLabel: string;
  @Input() searchFieldHint: string;
  @Input() searchFieldPlaceholder: string;
  @Input() view: View | undefined = undefined;
  @Input() attributes: Attribute[];

  @Output() events: EventEmitter<AttributeTableComponentEvent>;

  formControlAttributeSearch: FormControl;
  dataSource: AttributeTableDataSource;
  displayedColumns: string[] = ['name', 'type', 'description', 'creationDate', 'lastUpdate', 'metadata', 'actions'];

  constructor(private formBuilder: FormBuilder) {
    this.searchFieldLabel = '';
    this.searchFieldHint = '';
    this.searchFieldPlaceholder = '';
    this.attributes = [];
    this.formControlAttributeSearch = this.formBuilder.control('');
    this.dataSource = new AttributeTableDataSource();
    this.events = new EventEmitter();
  }


  onAttributeSearchTriggered($event: Event) {
    this.events.emit({
      type: 'search',
      view: this.view,
      search: this.formControlAttributeSearch.value
    } as AttributeTableComponentEvent);
  }

  onCancelClicked($event: MouseEvent, attribute: Attribute) {
    this.events.emit({
      type: 'delete',
      view: this.view,
      attribute
    } as AttributeTableComponentEvent);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.attributes) {
      const simpleChange: SimpleChange = changes.attributes;
      const attributes: Attribute[] = simpleChange.currentValue;
      this.dataSource.update(attributes);
    }
  }

  onAddAttributeClick($event: MouseEvent) {
    this.events.emit({
      type: 'add',
      attribute: undefined,
      view: this.view
    } as AttributeTableComponentEvent);
  }

  onEditClicked($event: MouseEvent, attribute: any) {
    this.events.emit({
      type: 'edit',
      attribute,
      view: this.view
    } as AttributeTableComponentEvent);
  }
}
