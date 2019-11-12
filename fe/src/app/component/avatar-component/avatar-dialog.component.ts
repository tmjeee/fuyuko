import {Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {GlobalAvatar} from '../../model/avatar.model';
import {User} from '../../model/user.model';

import config from '../../../assets/config.json';

export interface AvatarDialogComponentData {
  user: User;
  allPredefinedAvatars: GlobalAvatar[];
}


@Component({
  templateUrl: './avatar-dialog.component.html',
  styleUrls: ['./avatar-dialog.component.scss']
})
export class AvatarDialogComponent {

  constructor(private matDialogRef: MatDialogRef<AvatarDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: AvatarDialogComponentData) {}

  onClose(event: Event) {
    this.matDialogRef.close(null);
  }

  allPredifinedAvatars(): GlobalAvatar[] {
    return this.data.allPredefinedAvatars;
  }

  onPredefinedAvatarClicked(event: Event, avatar: GlobalAvatar) {
    this.matDialogRef.close(avatar);
  }


  onFileInputChange($event: Event) {
    const fileList: FileList = ($event.target as HTMLInputElement).files;
    console.log(fileList);
  }

  globalAvatarUrl(predefinedAvatar: GlobalAvatar): string {
      return `${config.api_host_url}/global/avatar/${predefinedAvatar.name}`;
  }
}
