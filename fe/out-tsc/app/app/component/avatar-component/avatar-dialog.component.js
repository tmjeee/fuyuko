import * as tslib_1 from "tslib";
import { Component, ElementRef, Inject, Renderer2, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import config from '../../utils/config.util';
let AvatarDialogComponent = class AvatarDialogComponent {
    constructor(matDialogRef, renderer, data) {
        this.matDialogRef = matDialogRef;
        this.renderer = renderer;
        this.data = data;
    }
    onClose(event) {
        this.matDialogRef.close(null);
    }
    allPredifinedAvatars() {
        return this.data.allPredefinedAvatars;
    }
    onPredefinedAvatarClicked(event, avatar) {
        this.selectedAvatar = avatar;
        this.selectedFile = null;
        this.renderer.setValue(this.fileInput.nativeElement, '');
        this.fileInput.nativeElement.value = '';
    }
    onFileInputChange($event) {
        const fileList = $event.target.files;
        console.log(fileList);
        this.selectedFile = fileList[0];
        this.selectedAvatar = null;
    }
    globalAvatarUrl(predefinedAvatar) {
        return `${config.api_host_url}/global/avatar/${predefinedAvatar.name}`;
    }
    onDone($event) {
        const e = this.selectedFile ? this.selectedFile : this.selectedAvatar;
        this.matDialogRef.close(e);
    }
};
tslib_1.__decorate([
    ViewChild('fileInput', { static: true }),
    tslib_1.__metadata("design:type", ElementRef)
], AvatarDialogComponent.prototype, "fileInput", void 0);
AvatarDialogComponent = tslib_1.__decorate([
    Component({
        templateUrl: './avatar-dialog.component.html',
        styleUrls: ['./avatar-dialog.component.scss']
    }),
    tslib_1.__param(2, Inject(MAT_DIALOG_DATA)),
    tslib_1.__metadata("design:paramtypes", [MatDialogRef,
        Renderer2, Object])
], AvatarDialogComponent);
export { AvatarDialogComponent };
//# sourceMappingURL=avatar-dialog.component.js.map