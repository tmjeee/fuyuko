import {Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import {NotificationDialogComponent} from './notification-dialog.component';
import {AppNotificationService} from '../../service/app-notification-service/app-notification.service';
import {map} from 'rxjs/operators';
import {AppNotification} from '../../model/notification.model';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnChanges {

  readonly widthOfDialog: number = 500;
  readonly widthOffsetOfDialog: number = 25;
  readonly heightOffsetOfDialog: number = 30;

  @Input() notifications: AppNotification[];
  noOfNewNotifications: number;

  dialogAlreadyOpen: boolean;

  constructor(private matDialog: MatDialog,
              private notificationService: AppNotificationService) {}

  onNotificationIconClicked(event: Event) {
    if (this.dialogAlreadyOpen) {
      return;
    }
    const s: HTMLElement = event.target as HTMLElement;
    const matDialogRef: MatDialogRef<NotificationDialogComponent> = this.matDialog.open(NotificationDialogComponent, {
      hasBackdrop: false,
      position: {
        left: `${s.getBoundingClientRect().right - (this.widthOfDialog - this.widthOffsetOfDialog)}px`,
        top: `${s.getBoundingClientRect().top + this.heightOffsetOfDialog}px`,
      },
      width: `${this.widthOfDialog}px`,
      data: this.notifications
    });
    matDialogRef.afterOpened()
      .pipe(
        map((r: void) => {
          this.dialogAlreadyOpen = true;
        })
      ).subscribe();
    matDialogRef.afterClosed()
      .pipe(
        map((result: any) => {
          this.dialogAlreadyOpen = false;
        })
      ).subscribe();
  }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    const change: SimpleChange = changes.notifications;
    if (change && change.currentValue) {
      this.noOfNewNotifications = (change.currentValue as AppNotification[])
        .reduce((acc: number, curr: AppNotification) => {
          if (curr.isNew) {
            acc++;
          }
          return acc;
        }, 0);
    }
  }
}



