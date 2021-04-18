import {NotificationsService} from 'angular2-notifications';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';

export const toNotifications = (
        notificationService: NotificationsService,
        apiResponse: ApiResponse<any>,
        title?: string): void => {
    if (apiResponse && apiResponse.messages && apiResponse.messages.length) {
        for (const data of apiResponse.messages) {
            if (data.status === 'ERROR') {
                notificationService.error(title ? title : 'Error', data.message);
            } else if (data.status === 'SUCCESS') {
                notificationService.success(title ? title : 'Success', data.message);
            } else if (data.status === 'INFO') {
                notificationService.info(title ? title : 'Information', data.message);
            } else if (data.status === 'WARN') {
                notificationService.warn(title ? title : 'Warning', data.message);
            }
        }
    } else {
        console.error(`**** api response doesn't have messages`, apiResponse);
    }
};

export const isApiResponseSuccess = (apiResponse: ApiResponse<any>): boolean => {
    const errors = apiResponse.messages ? apiResponse.messages.filter(message => message.status === 'ERROR') : [];
    return !errors.length;
};
