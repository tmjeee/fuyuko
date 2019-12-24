import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
let NotificationMessageListingComponent = class NotificationMessageListingComponent {
    hasMessages() {
        return !!(this.messages && ((this.hasErrors()) ||
            (this.hasInfos()) ||
            (this.hasWarnings())));
    }
    hasInfos() {
        return !!(this.messages && this.messages.infos && this.messages.infos.length);
    }
    hasWarnings() {
        return !!(this.messages && this.messages.warnings && this.messages.warnings.length);
    }
    hasErrors() {
        return !!(this.messages && this.messages.errors && this.messages.errors.length);
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], NotificationMessageListingComponent.prototype, "messages", void 0);
NotificationMessageListingComponent = tslib_1.__decorate([
    Component({
        selector: 'app-notification-message-listing',
        templateUrl: './notification-message-listing.component.html',
        styleUrls: ['./notification-message-listing.component.scss']
    })
], NotificationMessageListingComponent);
export { NotificationMessageListingComponent };
//# sourceMappingURL=notification-message-listing.component.js.map