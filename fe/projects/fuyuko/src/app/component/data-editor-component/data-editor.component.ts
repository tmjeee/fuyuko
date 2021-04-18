import {Component, EventEmitter, Input, Output} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {DataEditorDialogComponent} from './data-editor-dialog.component';
import {map} from 'rxjs/operators';
import {ItemValueAndAttribute, TableItemAndAttribute} from '@fuyuko-common/model/item-attribute.model';

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
    const matDialogRef: MatDialogRef<DataEditorDialogComponent> = this.matDialog.open(DataEditorDialogComponent, {
      height: '90vh',
      width: '90vw',
      data: {
        itemValue: {...this.itemValueAndAttribute.itemValue},
        attribute: {...this.itemValueAndAttribute.attribute}
      } as ItemValueAndAttribute
    });
    matDialogRef
      .afterClosed()
      .pipe(
        map((itemAndAttribute: ItemValueAndAttribute) => {
          if (itemAndAttribute) { // 'ok' is clicked when closing dialog
            this.itemValueAndAttribute.itemValue = itemAndAttribute.itemValue;
            this.events.emit(this.itemValueAndAttribute);
          }
        })
      ).subscribe();
  }
}

