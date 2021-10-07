import {Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Item} from '@fuyuko-common/model/item.model';
import {Type} from './item-editor.component';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {assertDefinedReturn} from '../../utils/common.util';


@Component({
  templateUrl: './item-editor-dialog.component.html',
  styleUrls: ['./item-editor-dialog.component.scss']
})
export class ItemEditorDialogComponent {

  type: Type;
  item: Item;

  formGroup!: FormGroup;
  formControlName?: FormControl;
  formControlDescription?: FormControl;

  constructor(private matDialogRef: MatDialogRef<ItemEditorDialogComponent>,
              private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) private data: {item: Item, type: Type}) {
    this.type = data.type;
    this.item = data.item;
    if (this.type === 'name') {
      this.formControlName = formBuilder.control(this.item.name, [Validators.required]);
      this.formGroup = this.formBuilder.group({
          name: this.formControlName
      });
    } else if (this.type === 'description') {
      this.formControlDescription = formBuilder.control(this.item.description, [Validators.required]);
      this.formGroup = this.formBuilder.group({
        description: this.formControlDescription
      });
    }
  }

  onSubmit() {
    const item: Item = {...this.item};
    if (this.type === 'name') {
      item.name = assertDefinedReturn(this.formControlName).value;
    } else if (this.type === 'description') {
      item.description = assertDefinedReturn(this.formControlDescription).value;
    }
    this.matDialogRef.close( item );
  }

  cancel($event: MouseEvent) {
    this.matDialogRef.close(undefined);
  }
}
