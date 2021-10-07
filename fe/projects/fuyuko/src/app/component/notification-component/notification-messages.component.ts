import {Component, Input} from '@angular/core';
import {NewNotification} from '@fuyuko-common/model/notification.model';


@Component({
    selector: 'app-notification-messages',
    templateUrl: './notification-messages.component.html',
    styleUrls: ['./notification-messages.component.scss']
})
export class NotificationMessagesComponent {

    @Input() messages: NewNotification[] = [];

}
