import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// @ts-ignore
import config from '../../utils/config.util';
const URL_CREATE_INVITATION = `${config.api_host_url}/create-invitation`;
let InvitationService = class InvitationService {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }
    createInvitation(email, groups) {
        return this.httpClient.post(URL_CREATE_INVITATION, {
            email,
            groupIds: (groups ? groups.map((g) => g.id) : [])
        });
    }
};
InvitationService = tslib_1.__decorate([
    Injectable(),
    tslib_1.__metadata("design:paramtypes", [HttpClient])
], InvitationService);
export { InvitationService };
//# sourceMappingURL=invitation.service.js.map