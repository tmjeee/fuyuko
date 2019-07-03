import {Component, EventEmitter, Input, OnChanges, Output, SimpleChange, SimpleChanges} from '@angular/core';
import {FormBuilder, FormControl} from '@angular/forms';
import {DataSource} from '@angular/cdk/table';
import {Attribute} from '../../model/attribute.model';
import {CollectionViewer} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {MatDialog, MatDialogRef} from '@angular/material';
import {EditAttributeDialogComponent} from './edit-attribute-dialog.component';
import {map} from 'rxjs/operators';
import {View} from '../../model/view.model';

class AttributeTableDataSource extends DataSource<Attribute> {

  private subject: BehaviorSubject<Attribute[]> = new BehaviorSubject(null);

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
  search?: string;
  view?: View;
  attribute?: Attribute;
}

@Component({
  selector: 'app-attribute-table',
  templateUrl: './attribute-table.component.html',
  styleUrls: ['./attribute-table.component.scss']
})
export class AttributeTableComponent implements OnChanges {

  @Input() searchFieldLabel;
  @Input() searchFieldHint;
  @Input() searchFieldPlaceholder;
  @Input() view: View;
  @Input() attributes: Attribute[];

  @Output() events: EventEmitter<AttributeTableComponentEvent>;

  formControlAttributeSearch: FormControl;
  dataSource: AttributeTableDataSource;
  displayedColumns: string[] = ['name', 'type', 'description', 'metadata', 'actions'];

  constructor(private formBuilder: FormBuilder, private matDialog: MatDialog) {
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
    const attribute: Attribute = {
      id: -1,
      type: 'string',
      name: '',
      description: ''
    };
    this.popupEditDialog('add', attribute);
  }

  onEditClicked($event: MouseEvent, attribute: Attribute) {
    this.popupEditDialog('edit', attribute);
  }

  private popupEditDialog(command: EventType, attribute: Attribute) {
    const matDialogRef: MatDialogRef<EditAttributeDialogComponent> = this.matDialog.open(EditAttributeDialogComponent, {
      data: attribute,
      minWidth: 600,
    });
    matDialogRef.afterClosed()
      .pipe(
        map((a: Attribute) => {
          if (a) {
            this.events.emit({
              type: command,
              view: this.view,
              attribute: a
            });
          }
        })
      ).subscribe();
  }
}
