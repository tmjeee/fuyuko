import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
let GlobalCommunicationService = class GlobalCommunicationService {
    constructor() {
        this.avatarReloadSubject = new Subject();
    }
    avatarReloadObservable() {
        return this.avatarReloadSubject.asObservable();
    }
    reloadAvatar() {
        this.avatarReloadSubject.next(Math.random());
    }
};
GlobalCommunicationService = tslib_1.__decorate([
    Injectable(),
    tslib_1.__metadata("design:paramtypes", [])
], GlobalCommunicationService);
export { GlobalCommunicationService };
//# sourceMappingURL=global-communication.service.js.map