import {Component, EventEmitter, Input, OnChanges, Output, SimpleChange, SimpleChanges} from '@angular/core';
import {TableItem} from '../../model/item.model';
import {Attribute} from '../../model/attribute.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {DataEditorDialogComponent} from './data-editor-dialog.component';
import {map} from 'rxjs/operators';
import {ItemValueAndAttribute, TableItemAndAttribute} from '../../model/item-attribute.model';

export interface DataEditorComponentEvent {
  temAndAttribute: TableItemAndAttribute;
}

@Component({
  selector: 'app-data-editor',
  templateUrl: './data-editor.component.html',
  styleUrls: ['./data-editor.component.scss']
})
export class DataEditorComponent {

  @Input() itemValueAndAttribute: ItemValueAndAttribute;
  @Output() events: EventEmitter<ItemValueAndAttribute>;

  constructor(private matDialog: MatDialog) {
    this.events = new EventEmitter();
  }

  onItemAttributeValueClicked($event: MouseEvent) {
    console.log(' on click', this.itemValueAndAttribute);
    const matDialogRef: MatDialogRef<DataEditorDialogComponent> = this.matDialog.open(DataEditorDialogComponent, {
      data: this.itemValueAndAttribute
    });
    matDialogRef
      .afterClosed()
      .pipe(
        map((itemAndAttribute: TableItemAndAttribute) => {
          if (itemAndAttribute) { // 'ok' is clicked when closing dialog
            this.events.emit(this.itemValueAndAttribute);
          }
        })
      ).subscribe();
  }
}

