import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Item} from "../../model/item.model";

@Component({
    templateUrl: './upload-item-image-dialog.component.html',
    styleUrls: ['./upload-item-image-dialog.component.scss']
})
export class UploadItemImageDialogComponent {

    private selectedFile: File;

    constructor(private dialogRef: MatDialogRef<UploadItemImageDialogComponent>,
                @Inject(MAT_DIALOG_DATA) private data: Item) {
    }

    onCancel($event: MouseEvent) {
        this.dialogRef.close(null);
    }

    onSubmit() {
        this.dialogRef.close(this.selectedFile);
    }

    onFileChange($event: Event) {
        const fileList: FileList = ($event.target as HTMLInputElement).files;
        this.selectedFile = fileList[0];
    }
}