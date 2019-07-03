import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AppNotification} from '../../model/notification.model';


@Component({
  templateUrl: './notification-dialog.component.html',
  styleUrls: ['./notification-dialog.component.scss']
})
export class NotificationDialogComponent {

  constructor(private matDialogRef: MatDialogRef<NotificationDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Notification[]) {}

  onClose(event: Event) {
    this.matDialogRef.close();
  }


}
