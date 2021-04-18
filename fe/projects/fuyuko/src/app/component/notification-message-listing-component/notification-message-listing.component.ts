import {Component, Input} from '@angular/core';
import {Messages} from '@fuyuko-common/model/notification-listing.model';


@Component({
    selector: 'app-notification-message-listing',
    templateUrl: './notification-message-listing.component.html',
    styleUrls: ['./notification-message-listing.component.scss']
})
export class NotificationMessageListingComponent {

    @Input() messages: Messages;

    hasMessages(): boolean {
        return !!(this.messages && (
            (this.hasErrors()) ||
            (this.hasInfos()) ||
            (this.hasWarnings())
        ));
    }

    hasInfos(): boolean {
        return !!(this.messages && this.messages.infos && this.messages.infos.length);
    }

    hasWarnings(): boolean {
        return !!(this.messages && this.messages.warnings && this.messages.warnings.length);
    }

    hasErrors(): boolean {
        return !!(this.messages && this.messages.errors && this.messages.errors.length);
    }
}
