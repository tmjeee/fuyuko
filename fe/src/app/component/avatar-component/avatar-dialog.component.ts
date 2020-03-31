import {Component, ElementRef, Inject, Renderer2, ViewChild} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {GlobalAvatar} from '../../model/avatar.model';
import {User} from '../../model/user.model';

import config from '../../utils/config.util';

export interface AvatarDialogComponentData {
  user: User;
  allPredefinedAvatars: GlobalAvatar[];
}


@Component({
  templateUrl: './avatar-dialog.component.html',
  styleUrls: ['./avatar-dialog.component.scss']
})
export class AvatarDialogComponent {

  selectedAvatar: GlobalAvatar;
  selectedFile: File;

  @ViewChild('fileInput', {static: true}) fileInput: ElementRef;

  constructor(private matDialogRef: MatDialogRef<AvatarDialogComponent>,
              private renderer: Renderer2,
              @Inject(MAT_DIALOG_DATA) public data: AvatarDialogComponentData) {}

  onClose(event: Event) {
    this.matDialogRef.close(null);
  }

  allPredifinedAvatars(): GlobalAvatar[] {
    return this.data.allPredefinedAvatars;
  }

  onPredefinedAvatarClicked(event: Event, avatar: GlobalAvatar) {
      this.selectedAvatar = avatar;
      this.selectedFile = null;
      this.renderer.setValue(this.fileInput.nativeElement, '');
      this.fileInput.nativeElement.value = '';
  }

  onFileInputChange($event: Event) {
    const fileList: FileList = ($event.target as HTMLInputElement).files;
    this.selectedFile = fileList[0];
    this.selectedAvatar = null;
  }

  globalAvatarUrl(predefinedAvatar: GlobalAvatar): string {
      return `${config().api_host_url}/global/avatar/${predefinedAvatar.name}`;
  }

  onDone($event: MouseEvent) {
    const e = this.selectedFile ? this.selectedFile : this.selectedAvatar;
    this.matDialogRef.close(e);
  }
}
