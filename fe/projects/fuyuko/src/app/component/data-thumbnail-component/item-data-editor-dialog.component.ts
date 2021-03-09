import {Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {ItemAndAttributes, ItemValueAndAttribute} from '@fuyuko-common/model/item-attribute.model';
import {Item} from '@fuyuko-common/model/item.model';
import {Attribute} from '@fuyuko-common/model/attribute.model';
import {ItemEditorComponentEvent} from '../data-editor-component/item-editor.component';
import {copyAttrProperties} from '../../utils/item-to-table-items.util';

@Component({
  templateUrl: './item-data-editor-dialog.component.html',
  styleUrls: ['./item-data-editor-dialog.component.scss']
})
export class ItemDataEditorDialogComponent {

  attributes: Attribute[];
  item: Item;
  hasChange: boolean;

  constructor(private matDialogRef: MatDialogRef<ItemDataEditorDialogComponent>,
              @Inject(MAT_DIALOG_DATA) private data: ItemAndAttributes) {
    this.hasChange = false;
    this.item = {...this.data.item};
    copyAttrProperties(this.data.item, this.item);
    this.attributes = this.data.attributes;
  }


  onItemNameChange($event: ItemEditorComponentEvent) {
    this.hasChange = true;
    this.item.name = $event.item.name;
  }

  onItemDescriptionChange($event: ItemEditorComponentEvent) {
    this.hasChange = true;
    this.item.description = $event.item.description;
  }

  onItemAttributeChange($event: ItemValueAndAttribute) {
    this.hasChange = true;
    this.item[$event.attribute.id] = $event.itemValue;
  }

  onSubmit($event: MouseEvent) {
    this.matDialogRef.close(this.item);
  }

  onCancel($event: MouseEvent) {
    this.matDialogRef.close(null);
  }

}
