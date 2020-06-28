import {Injectable} from '@angular/core';
import {User} from '../../model/user.model';
import {Settings} from '../../model/settings.model';
import {Observable, of} from 'rxjs';
import config from '../../utils/config.util';
import {HttpClient} from '@angular/common/http';
import {concatMap, map, tap} from 'rxjs/operators';
import {ApiResponse} from "../../model/api-response.model";


const URL_GET_USER_SETTINGS = () => `${config().api_host_url}/user/:userId/settings`;
const URL_POST_USER_SETTINGS = () => `${config().api_host_url}/user/:userId/settings`;

@Injectable()
export class SettingsService {

    cachedSettings: Settings;

    constructor(private httpClient: HttpClient) { }

    saveSettings(user: User, s: Settings): Observable<Settings> {
        return of(URL_POST_USER_SETTINGS().replace(':userId', String(user.id)))
            .pipe(
               concatMap((url: string) => {
                   return this.httpClient.post(url, s);
               }),
               concatMap((_: ApiResponse) => {
                   return this.getSettings(user);
               })
            );
    }

    getSettings(u: User): Observable<Settings> {
        return this.httpClient
            .get<ApiResponse<Settings>>(URL_GET_USER_SETTINGS().replace(':userId', String(u.id)))
            .pipe(
                map((r: ApiResponse<Settings>) => r.payload),
                tap((settings: Settings) => (this.cachedSettings = settings))
            );
    }


    // initialization (see appInitializer function in app.module)
    init(u: User)  {
        return this.getSettings(u).subscribe();
    }

    // destruction (see appInitializer function in app.module)
    destroy()  {
        this.cachedSettings = null;
    }
}
