import * as tslib_1 from "tslib";
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AvatarDialogComponent } from './avatar-dialog.component';
import { map, tap } from 'rxjs/operators';
import config from '../../utils/config.util';
import { GlobalCommunicationService } from '../../service/global-communication-service/global-communication.service';
const URL_USER_AVATAR = `${config.api_host_url}/user/:userId/avatar`;
let AvatarComponent = class AvatarComponent {
    constructor(matDialog, globalCommunicationService) {
        this.matDialog = matDialog;
        this.globalCommunicationService = globalCommunicationService;
        this.width = '45px';
        this.height = '45px';
        this.editable = false;
        this.dialogOpened = false;
        this.events = new EventEmitter();
        this.d = Math.random();
    }
    ngOnInit() {
        this.subscription = this.globalCommunicationService
            .avatarReloadObservable()
            .pipe(tap((_) => {
            this.reload();
        })).subscribe();
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
    reload() {
        this.d = Math.random();
    }
    onEditClicked(event) {
        if (this.dialogOpened) {
            return;
        }
        const matDialogRef = this.matDialog.open(AvatarDialogComponent, {
            data: {
                user: this.user,
                allPredefinedAvatars: this.allPredefinedAvatars
            }
        });
        matDialogRef.afterOpened()
            .pipe(map((r) => {
            this.dialogOpened = true;
        })).subscribe();
        matDialogRef.afterClosed()
            .pipe(map((result) => {
            this.dialogOpened = false;
            if (result) {
                this.events.emit({ avatar: result });
            }
        })).subscribe();
    }
    userAvatarUrl(userId) {
        return URL_USER_AVATAR.replace(':userId', `${userId}`).concat(`?=${this.d}`);
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], AvatarComponent.prototype, "user", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], AvatarComponent.prototype, "width", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], AvatarComponent.prototype, "height", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Boolean)
], AvatarComponent.prototype, "editable", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], AvatarComponent.prototype, "allPredefinedAvatars", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], AvatarComponent.prototype, "events", void 0);
AvatarComponent = tslib_1.__decorate([
    Component({
        selector: 'app-avatar',
        templateUrl: './avatar.component.html',
        styleUrls: ['./avatar.component.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [MatDialog,
        GlobalCommunicationService])
], AvatarComponent);
export { AvatarComponent };
//# sourceMappingURL=avatar.component.js.map