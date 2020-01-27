import {Injectable} from '@angular/core';
import {User} from '../../model/user.model';
import {RuntimeSettings, Settings} from '../../model/settings.model';
import {Observable, of} from 'rxjs';

let SETTINGS: Settings = {
    id: 1,
    defaultOpenHelpNav: false,
    defaultOpenSideNav: true,
    defaultOpenSubSideNav: true
};

let RUNTIME_SETTINGS: RuntimeSettings = {
    settingsId: 1,
    openSubSideNav: undefined,
    openHelpNav: undefined,
    openSideNav: undefined
};

export const KEY = `MY_APP_RUNTIME_SETTINGS`;

// todo: RuntimeSettings and Settings need to be consolidated into just one and create API for saving them in downstream service

@Injectable()
export class SettingsService {

    saveSettings(s: Settings): Observable<Settings> {
        SETTINGS = {...s};
        this.ms(RUNTIME_SETTINGS, SETTINGS);
        return of(SETTINGS);
    }

    getSettings(u: User): Observable<Settings> {
        // todo:
        return of (SETTINGS);
    }

    saveRuntimeSettings(r: RuntimeSettings): RuntimeSettings {
        // todo: save using API
        RUNTIME_SETTINGS = {...r};
        localStorage.setItem(KEY, JSON.stringify(RUNTIME_SETTINGS));
        return RUNTIME_SETTINGS;
    }

    getLocalRuntimeSettings(): RuntimeSettings {
        let r = JSON.parse(localStorage.getItem(KEY));
        if (!r) { // should always have it in localStorage
          // this.saveRuntimeSettings(r);
          console.error(`Cannot find runtime settings from local storage !!!`);
          r = {...SETTINGS};
        }
        return r;
    }

    // use only when logged in, after that 'getLocalRuntimeSettings()' would suffice (see appInitializer function)
    getRuntimeSettings(u: User): Observable<RuntimeSettings> {
        const runtimeSettings: RuntimeSettings = this.ms(RUNTIME_SETTINGS, SETTINGS);
        localStorage.setItem(KEY, JSON.stringify(runtimeSettings));
        return of(runtimeSettings);
    }

    // use only when logged out, after that 'getLocalRuntimeSettings()' would suffice (see appInitializer function)
    destroyRuntimeSettings(): Observable<null> {
        localStorage.removeItem(KEY);
        return of(null);
    }

    private ms(runtimeSettings: RuntimeSettings, settings: Settings): RuntimeSettings {
        const rs: RuntimeSettings = this.m(runtimeSettings, settings);
        localStorage.setItem(KEY, JSON.stringify(rs));
        return rs;
    }

    private m(runtimeSettings: RuntimeSettings, settings: Settings): RuntimeSettings {
        const rs: RuntimeSettings = ({
            openHelpNav: this.g<boolean>(RUNTIME_SETTINGS.openHelpNav, SETTINGS.defaultOpenHelpNav),
            openSideNav: this.g<boolean>(RUNTIME_SETTINGS.openSideNav, SETTINGS.defaultOpenSideNav),
            openSubSideNav: this.g<boolean>(RUNTIME_SETTINGS.openSubSideNav, SETTINGS.defaultOpenSubSideNav)
        } as RuntimeSettings);

        return rs;
    }

    private g<T>(fromRuntimeSettings: T, fromSettings: T): T {
        return ((fromRuntimeSettings === null || fromRuntimeSettings === undefined) ? fromSettings : fromRuntimeSettings);
    }

}
