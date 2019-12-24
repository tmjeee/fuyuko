import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// @ts-ignore
import config from '../../utils/config.util';
const URL_REGISTER = `${config.api_host_url}/self-register`;
let RegistrationService = class RegistrationService {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }
    register(email, username, firstName, lastName, password) {
        return this.httpClient.post(URL_REGISTER, {
            email, username, password, firstName, lastName
        });
    }
};
RegistrationService = tslib_1.__decorate([
    Injectable(),
    tslib_1.__metadata("design:paramtypes", [HttpClient])
], RegistrationService);
export { RegistrationService };
//# sourceMappingURL=registration.service.js.map