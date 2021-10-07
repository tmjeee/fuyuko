import {Injectable} from '@angular/core';

export const LAST_URL_KEY = `LAST_URL_KEY`;


export const isNotLoginUrl = (url: string): boolean => {
    return (
        (!url.endsWith('/login')) &&
        (!url.endsWith('/register')) &&
        (!url.endsWith('/forgot-password')) &&
        (!url.match(/\/activate\/.*$/))
    );
};


@Injectable()
export class BrowserLocationHistoryService {

    storeLastUrlKey(url: string) {
       this._storeLastUrlKey(url, isNotLoginUrl);
    }

    _storeLastUrlKey(url: string, predicate: (url: string) => boolean) {
        if (predicate && predicate(url)) {
            sessionStorage.setItem(LAST_URL_KEY, url);
        }
    }

    clearStoredLastUrl() {
        sessionStorage.removeItem(LAST_URL_KEY);
    }

    retrieveLastUrl(): string | undefined {
        return sessionStorage.getItem(LAST_URL_KEY) ?? undefined;
    }
}
