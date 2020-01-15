import {Injectable} from '@angular/core';

export const LAST_URL_KEY = `LAST_URL_KEY`;

@Injectable()
export class BrowserLocationHistoryService {

   storeLastUrlKey(url: string) {
       sessionStorage.setItem(LAST_URL_KEY, url);
   }

   retrieveLastUrl(): string {
       return sessionStorage.getItem(LAST_URL_KEY);
   }
}
