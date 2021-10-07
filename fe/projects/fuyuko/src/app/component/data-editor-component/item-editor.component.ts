import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Item, TableItem} from '@fuyuko-common/model/item.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {ItemEditorDialogComponent} from './item-editor-dialog.component';
import {map} from 'rxjs/operators';

export type Type = 'name' | 'description';


export interface ItemEditorComponentEvent {
  item: Item | TableItem;
  type: Type;
}

@Component({
  selector: 'app-item-editor',
  templateUrl: './item-editor.component.html',
  styleUrls: ['./item-editor.component.scss']
})
export class ItemEditorComponent {

  @Input() item!: Item | TableItem;
  @Input() type!: Type;

  @Output() events: EventEmitter<ItemEditorComponentEvent>;

  constructor(private matDialog: MatDialog) {
    this.events = new EventEmitter();
  }

  onEdit($event: MouseEvent, name: Type) {
    const matDialogRef: MatDialogRef<ItemEditorDialogComponent> = this.matDialog.open(ItemEditorDialogComponent, {
      width: '90vw',
      height: '90vh',
      data:  {
        item: {...this.item},
        type: this.type
      }
    });

    matDialogRef
      .afterClosed()
      .pipe(
        map((r: Item) => {
          if (r) {
            this.events.emit({
              item: {...r},
              type: this.type
            } as ItemEditorComponentEvent);
          }
        })
      ).subscribe();
  }
}
