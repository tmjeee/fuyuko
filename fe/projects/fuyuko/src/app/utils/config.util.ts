
import {HttpClient} from '@angular/common/http';

import _config from '../../assets/config.json';
import {tap} from 'rxjs/operators';

export interface ConfigType {
    [key: string]: string;
}

let currentConfig: ConfigType = _config;

export const reload = (httpClient: HttpClient, callback?: () => void) => {
   httpClient.get('/assets/config.json')
       .pipe(
           tap((j: any) => {
               currentConfig = j;
               // tslint:disable-next-line:no-unused-expression
               callback && callback();
           })
       ).subscribe();
};

const config = (): {[key: string]: string} => {
    return currentConfig;
};

export default config;

