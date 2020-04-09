import {NotificationsService} from 'angular2-notifications';
import {ApiResponse} from "../model/api-response.model";


export const toNotifications = (
        notificationService: NotificationsService,
        data: ApiResponse<any>,
        title?: string) => {
    if (data) {
        if (data.status === 'ERROR') {
            notificationService.error(title ? title : 'Error', data.message);
        } else if (data.status === 'SUCCESS') {
            notificationService.success(title ? title : 'Success', data.message);
        } else if (data.status === 'INFO') {
            notificationService.info(title ? title : 'Information', data.message);
        } else if (data.status === 'WARN') {
            notificationService.warn(title ? title : 'Warning', data.message);
        }
    } else {
        console.error(`**** api response is falsy`, data);

    }
};
