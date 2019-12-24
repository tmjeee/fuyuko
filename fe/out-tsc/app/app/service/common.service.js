export const toNotifications = (notificationService, data, title) => {
    if (data.status === 'ERROR') {
        notificationService.error(title ? title : 'Error', data.message);
    }
    else if (data.status === 'SUCCESS') {
        notificationService.success(title ? title : 'Success', data.message);
    }
    else if (data.status === 'INFO') {
        notificationService.info(title ? title : 'Information', data.message);
    }
    else if (data.status === 'WARN') {
        notificationService.warn(title ? title : 'Warning', data.message);
    }
};
//# sourceMappingURL=common.service.js.map