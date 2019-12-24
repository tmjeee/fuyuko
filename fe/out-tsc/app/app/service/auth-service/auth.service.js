import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ThemeService } from '../theme-service/theme.service';
import { HttpClient } from '@angular/common/http';
import config from '../../../assets/config.json';
import { tap } from 'rxjs/operators';
const URL_LOGIN = `${config.api_host_url}/login`;
const URL_LOGOUT = `${config.api_host_url}/logout`;
const URL_SAVE_USER = `${config.api_host_url}/user`;
let AuthService = class AuthService {
    constructor(httpClient, themeService) {
        this.httpClient = httpClient;
        this.themeService = themeService;
        const myself = this.myself();
        this.subject = new BehaviorSubject(myself);
    }
    asObservable() {
        return this.subject.asObservable();
    }
    login(username, password) {
        return this.httpClient.post(URL_LOGIN, {
            username, password
        }).pipe(tap((r) => {
            this.storeToken({
                token: r.jwtToken,
                myself: r.user
            });
            this.subject.next(r.user);
        }));
    }
    logout() {
        return this.httpClient.post(`${URL_LOGOUT}`, {}).pipe(tap((_) => {
            this.destroyToken();
            this.subject.next(null);
        }));
    }
    saveMyself(myself) {
        return this.httpClient.post(URL_SAVE_USER, {
            userId: myself.id,
            firstName: myself.username,
            lastName: myself.lastName,
            email: myself.email
        }).pipe(tap(this.afterSaveCallback.bind(this)));
    }
    saveTheme(theme) {
        return this.httpClient.post(URL_SAVE_USER, {
            theme
        }).pipe(tap(this.afterSaveCallback.bind(this)));
    }
    savePassword(myself, password) {
        return this.httpClient.post(URL_SAVE_USER, {
            password
        }).pipe(tap(this.afterSaveCallback.bind(this)));
    }
    afterSaveCallback(u) {
        const token = JSON.parse(localStorage.getItem('MY_APP_MYSELF'));
        token.myself = u;
        this.storeToken(token);
        this.subject.next(u);
    }
    storeToken(token) {
        localStorage.setItem('MY_APP_MYSELF', JSON.stringify(token));
    }
    destroyToken() {
        localStorage.removeItem('MY_APP_MYSELF');
    }
    jwtToken() {
        const storageToken = localStorage.getItem('MY_APP_MYSELF');
        if (storageToken) {
            const token = JSON.parse(storageToken);
            return token.token;
        }
        return null;
    }
    myself() {
        const storageToken = localStorage.getItem('MY_APP_MYSELF');
        if (storageToken) {
            const token = JSON.parse(storageToken);
            return token.myself;
        }
        return null;
    }
};
AuthService = tslib_1.__decorate([
    Injectable(),
    tslib_1.__metadata("design:paramtypes", [HttpClient,
        ThemeService])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map