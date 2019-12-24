import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import config from '../../utils/config.util';
const URL_GET_INVITATION_BY_CODE = `${config.api_host_url}/invitations`;
const URL_ACTIVATE_BY_CODE = `${config.api_host_url}/activate-invitation`;
let ActivationService = class ActivationService {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }
    getInvitation(code) {
        return this.httpClient
            .get(`${URL_GET_INVITATION_BY_CODE}/${code}`);
    }
    activate(code, email, username, firstName, lastName, password) {
        return this.httpClient
            .post(`${URL_ACTIVATE_BY_CODE}/${code}`, {
            username,
            email,
            firstName,
            lastName,
            password
        });
    }
};
ActivationService = tslib_1.__decorate([
    Injectable(),
    tslib_1.__metadata("design:paramtypes", [HttpClient])
], ActivationService);
export { ActivationService };
//# sourceMappingURL=activation.service.js.map