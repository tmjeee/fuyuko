import {NotificationsService} from 'angular2-notifications';
import {ResponseStatus} from '../model/response-status.model';


export const toNotifications = (
        notificationService: NotificationsService,
        data: {status: ResponseStatus, message: string},
        title?: string) => {
    if (data.status === 'ERROR') {
        notificationService.error(title ? title : 'Error', data.message);
    } else if (data.status === 'SUCCESS') {
        notificationService.success(title ? title : 'Success', data.message);
    } else if (data.status === 'INFO') {
        notificationService.info(title ? title : 'Information', data.message);
    } else if (data.status === 'WARN') {
        notificationService.warn(title ? title : 'Warning', data.message);
    }
};
