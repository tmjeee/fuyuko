import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import config from '../../../assets/config.json';
const URL_ALL_GLOBAL_AVATARS = `${config.api_host_url}/global/avatars`;
const URL_SAVE_USER_AVATAR = `${config.api_host_url}/user/:userId/avatar`;
let AvatarService = class AvatarService {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }
    saveUserCustomAvatar(userId, f) {
        const formData = new FormData();
        formData.set('customAvatarFile', f);
        return this.httpClient.post(URL_SAVE_USER_AVATAR.replace(':userId', `${userId}`), formData);
    }
    saveUserAvatar(userId, globalAvatarName) {
        const formData = new FormData();
        formData.set('globalAvatarName', globalAvatarName);
        return this.httpClient.post(URL_SAVE_USER_AVATAR.replace(':userId', `${userId}`), formData);
    }
    allPredefinedAvatars() {
        return this.httpClient.get(URL_ALL_GLOBAL_AVATARS);
    }
};
AvatarService = tslib_1.__decorate([
    Injectable(),
    tslib_1.__metadata("design:paramtypes", [HttpClient])
], AvatarService);
export { AvatarService };
//# sourceMappingURL=avatar.service.js.map