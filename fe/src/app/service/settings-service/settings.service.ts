import {Injectable} from '@angular/core';
import {User} from '../../model/user.model';
import {RuntimeSettings, Settings} from '../../model/settings.model';
import {Observable, of} from 'rxjs';
import config from "../../utils/config.util";
import {HttpClient} from "@angular/common/http";
import {map, tap} from "rxjs/operators";
import {run} from "tslint/lib/runner";

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

const URL_GET_USER_SETTINGS = () => `${config().api_host_url}/user/:userId/settings`;
const URL_POST_USER_SETTINGS = () => `${config().api_host_url}/user/:userId/settings`;

@Injectable()
export class SettingsService {

    constructor(private httpClient: HttpClient) { }

    saveSettings(user: User, s: Settings): Observable<Settings> {
        return this.httpClient.post(URL_POST_USER_SETTINGS().replace(':userId', String(user.id)), SETTINGS)
            .pipe(
                map((_: any) => {
                    SETTINGS = {...s};
                    this.mergeAndSaveToLocal(RUNTIME_SETTINGS, SETTINGS);
                    return SETTINGS;
                })
            );
    }

    getSettings(u: User): Observable<Settings> {
        return this.httpClient.get<Settings>(URL_GET_USER_SETTINGS().replace(':userId', String(u.id)))
            .pipe(
                tap((s: Settings) => {
                    SETTINGS = {...s};
                    this.mergeAndSaveToLocal(RUNTIME_SETTINGS, SETTINGS);
                })
            );
    }

    saveRuntimeSettings(r: RuntimeSettings): RuntimeSettings {
        RUNTIME_SETTINGS = {...r};
        localStorage.setItem(KEY, JSON.stringify(RUNTIME_SETTINGS));
        return RUNTIME_SETTINGS;
    }

    getLocalRuntimeSettings(): RuntimeSettings {
        let r = JSON.parse(localStorage.getItem(KEY));
        if (!r) { // should always have it in localStorage
          console.error(`Cannot find runtime settings from local storage !!!`);
          r = {...SETTINGS};
          this.saveRuntimeSettings(r);
        }
        return r;
    }

    // use only when logged in, after that 'getLocalRuntimeSettings()' would suffice (see appInitializer function)
    getRuntimeSettings(u: User): Observable<RuntimeSettings> {
        return this.httpClient.get<Settings>(URL_GET_USER_SETTINGS().replace(':userId', String(u.id)))
            .pipe(
               map((s: Settings) => {
                   SETTINGS = s;
                   const runtimeSettings: RuntimeSettings = this.mergeAndSaveToLocal(RUNTIME_SETTINGS, SETTINGS);
                   localStorage.setItem(KEY, JSON.stringify(runtimeSettings));
                   return runtimeSettings;
               })
            );
    }

    // use only when logged out, after that 'getLocalRuntimeSettings()' would suffice (see appInitializer function)
    destroyRuntimeSettings(): Observable<null> {
        localStorage.removeItem(KEY);
        return of(null);
    }

    private mergeAndSaveToLocal(runtimeSettings: RuntimeSettings, settings: Settings): RuntimeSettings {
        const rs: RuntimeSettings = this.merge(runtimeSettings, settings);
        localStorage.setItem(KEY, JSON.stringify(rs));
        return rs;
    }

    private merge(runtimeSettings: RuntimeSettings, settings: Settings): RuntimeSettings {
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
