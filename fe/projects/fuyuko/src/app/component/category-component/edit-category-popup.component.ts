import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Category} from "../../model/category.model";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";


@Component({
   templateUrl: './edit-category-popup.component.html',
   styleUrls: ['./edit-category-popup.component.scss']
})
export class EditCategoryPopupComponent {
   
   formGroup: FormGroup;
   formControlName: FormControl;
   formControlDescription: FormControl;

   constructor(private matDialogRef: MatDialogRef<EditCategoryPopupComponent>, 
               @Inject(MAT_DIALOG_DATA) private data: Category,
               private formBuilder: FormBuilder) {
      this.formControlName = this.formBuilder.control(data && data.name ? data.name : '', [Validators.required]);
      this.formControlDescription = this.formBuilder.control(data && data.description ? data.description : '', [Validators.required]);
      this.formGroup = this.formBuilder.group({
         name: this.formControlName,
         description: this.formControlDescription
      });
   }

   onSubmit() {
      this.matDialogRef.close({
         id: this.data ? this.data.id : -1,
         name: this.formControlName.value,
         description: this.formControlDescription.value
      });
   }

   onCancel($event: MouseEvent) {
      this.matDialogRef.close(null);
   }
}