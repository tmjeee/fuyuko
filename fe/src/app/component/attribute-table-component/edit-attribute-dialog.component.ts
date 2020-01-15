import {Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Attribute} from '../../model/attribute.model';
import {EditAttributeComponentEvent} from './edit-attribute.component';




@Component({
  templateUrl: './edit-attribute-dialog.component.html',
  styleUrls: ['./edit-attribute-dialog.component.scss']
})
export class EditAttributeDialogComponent {



  constructor(private dialogRef: MatDialogRef<EditAttributeDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public attribute: Attribute) {
  }


  onEditAttributeEvent($event: EditAttributeComponentEvent) {
    switch ($event.type) {
      case 'update':
        this.dialogRef.close($event.attribute);
        break;
      case 'cancel':
        this.dialogRef.close(undefined);
        break;
    }
  }
}
