import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {Avatar} from '../../model/avatar.model';
import {User} from '../../model/user.model';

export interface AvatarDialogComponentData {
  user: User;
  allPredefinedAvatars: Avatar[];
}


@Component({
  templateUrl: './avatar-dialog.component.html',
  styleUrls: ['./avatar-dialog.component.scss']
})
export class AvatarDialogComponent {

  fileUploadConfig: any = {
    multiple: false,
    fomatsAllowed: '.jpg,.png,.gif,.jpeg,.bmp',
    maxSize: 20,
    uploadAPI: {
      url: '',
      headers: {
      }
    },
  };

  constructor(private matDialogRef: MatDialogRef<AvatarDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: AvatarDialogComponentData) {}

  onClose(event: Event) {
    this.matDialogRef.close(null);
  }

  allPredifinedAvatars(): Avatar[] {
    return this.data.allPredefinedAvatars;
  }

  onPredefinedAvatarClicked(event: Event, avatar: Avatar) {
    this.data.user.avatarUrl = avatar.url;
    this.matDialogRef.close(avatar);
  }

  onFileUploadResponse(event: any) {
    console.log(event);
  }

}
