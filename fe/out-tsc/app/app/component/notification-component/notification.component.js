import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationDialogComponent } from './notification-dialog.component';
import { AppNotificationService } from '../../service/app-notification-service/app-notification.service';
import { map } from 'rxjs/operators';
let NotificationComponent = class NotificationComponent {
    constructor(matDialog, notificationService) {
        this.matDialog = matDialog;
        this.notificationService = notificationService;
        this.widthOfDialog = 500;
        this.widthOffsetOfDialog = 25;
        this.heightOffsetOfDialog = 30;
    }
    onNotificationIconClicked(event) {
        if (this.dialogAlreadyOpen) {
            return;
        }
        const s = event.target;
        const matDialogRef = this.matDialog.open(NotificationDialogComponent, {
            hasBackdrop: false,
            position: {
                left: `${s.getBoundingClientRect().right - (this.widthOfDialog - this.widthOffsetOfDialog)}px`,
                top: `${s.getBoundingClientRect().top + this.heightOffsetOfDialog}px`,
            },
            width: `${this.widthOfDialog}px`,
            data: this.notifications
        });
        matDialogRef.afterOpened()
            .pipe(map((r) => {
            this.dialogAlreadyOpen = true;
        })).subscribe();
        matDialogRef.afterClosed()
            .pipe(map((result) => {
            this.dialogAlreadyOpen = false;
        })).subscribe();
    }
    ngOnInit() { }
    ngOnChanges(changes) {
        const change = changes.notifications;
        if (change && change.currentValue) {
            this.noOfNewNotifications = change.currentValue
                .reduce((acc, curr) => {
                if (curr.isNew) {
                    acc++;
                }
                return acc;
            }, 0);
        }
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], NotificationComponent.prototype, "notifications", void 0);
NotificationComponent = tslib_1.__decorate([
    Component({
        selector: 'app-notification',
        templateUrl: './notification.component.html',
        styleUrls: ['./notification.component.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [MatDialog,
        AppNotificationService])
], NotificationComponent);
export { NotificationComponent };
//# sourceMappingURL=notification.component.js.map