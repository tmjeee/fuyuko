import {NotificationsService} from 'angular2-notifications';
import {Status} from '../model/status.model';


export const toNotifications = (
        notificationService: NotificationsService,
        data: {status: Status, message: string},
        title?: string) => {
    if (data.status === 'ERROR') {
        notificationService.error(title ? title : 'Error', data.message);
    } else if (data.status === 'SUCCESS') {
        notificationService.error(title ? title : 'Success', data.message);
    } else if (data.status === 'INFO') {
        notificationService.error(title ? title : 'Information', data.message);
    } else if (data.status === 'WARN') {
        notificationService.error(title ? title : 'Warning', data.message);
    }
};
