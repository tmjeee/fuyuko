import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
let SETTINGS = {
    id: 1,
    defaultOpenHelpNav: false,
    defaultOpenSideNav: true,
    defaultOpenSubSideNav: true
};
let RUNTIME_SETTINGS = {
    settingsId: 1,
    openSubSideNav: undefined,
    openHelpNav: undefined,
    openSideNav: undefined
};
let SettingsService = class SettingsService {
    saveSettings(s) {
        SETTINGS = Object.assign({}, s);
        this.ms(RUNTIME_SETTINGS, SETTINGS);
        return of(SETTINGS);
    }
    getSettings(u) {
        // todo:
        return of(SETTINGS);
    }
    saveRuntimeSettings(r) {
        RUNTIME_SETTINGS = Object.assign({}, r);
        localStorage.setItem('MY_APP_RUNTIME_SETTINGS', JSON.stringify(RUNTIME_SETTINGS));
        return RUNTIME_SETTINGS;
    }
    getLocalRuntimeSettings() {
        let r = JSON.parse(localStorage.getItem('MY_APP_RUNTIME_SETTINGS'));
        if (!r) {
            this.saveRuntimeSettings(r);
            r = Object.assign({}, SETTINGS);
        }
        return r;
    }
    // use only when logged in, after that 'getLocalRuntimeSettings()' would suffice (see appInitializer function)
    getRuntimeSettings(u) {
        const runtimeSettings = this.ms(RUNTIME_SETTINGS, SETTINGS);
        return of(runtimeSettings);
    }
    // use only when logged out, after that 'getLocalRuntimeSettings()' would suffice (see appInitializer function)
    destroyRuntimeSettings() {
        localStorage.removeItem('MY_APP_RUNTIME_SETTINGS');
        return of(null);
    }
    ms(runtimeSettings, settings) {
        const rs = this.m(runtimeSettings, settings);
        localStorage.setItem('MY_APP_RUNTIME_SETTINGS', JSON.stringify(rs));
        return rs;
    }
    m(runtimeSettings, settings) {
        const rs = {
            openHelpNav: this.g(RUNTIME_SETTINGS.openHelpNav, SETTINGS.defaultOpenHelpNav),
            openSideNav: this.g(RUNTIME_SETTINGS.openSideNav, SETTINGS.defaultOpenSideNav),
            openSubSideNav: this.g(RUNTIME_SETTINGS.openSubSideNav, SETTINGS.defaultOpenSubSideNav)
        };
        return rs;
    }
    g(fromRuntimeSettings, fromSettings) {
        return ((fromRuntimeSettings === null || fromRuntimeSettings === undefined) ? fromSettings : fromRuntimeSettings);
    }
};
SettingsService = tslib_1.__decorate([
    Injectable()
], SettingsService);
export { SettingsService };
//# sourceMappingURL=settings.service.js.map