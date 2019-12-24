import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import config from '../../../assets/config.json';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from "rxjs/operators";
const URL_ALL_VIEWS = `${config.api_host_url}/views`;
const URL_UPDATE_VIEW = `${config.api_host_url}/views/update`;
const URL_DELETE_VIEW = `${config.api_host_url}/views/delete`;
let ViewService = class ViewService {
    constructor(httpClient) {
        this.httpClient = httpClient;
        this.subject = new BehaviorSubject(null);
    }
    init() {
        this.getAllViews().pipe(tap((v) => {
            console.log('**** views', v);
            if (v && v.length > 0) {
                console.log('************** fire view', v[0]);
                this.subject.next(v[0]);
            }
        }), catchError((e, o) => {
            console.error(e);
            return of(null);
        })).subscribe();
    }
    asObserver() {
        return this.subject.asObservable();
    }
    setCurrentView(v) {
        this.subject.next(v);
    }
    getAllViews() {
        return this.httpClient.get(URL_ALL_VIEWS);
    }
    saveViews(updatedViews) {
        return this.httpClient.post(URL_UPDATE_VIEW, (updatedViews ? updatedViews : []));
    }
    deleteViews(deletedViews) {
        return this.httpClient.request('delete', URL_DELETE_VIEW, { body: (deletedViews ? deletedViews : []) });
    }
};
ViewService = tslib_1.__decorate([
    Injectable(),
    tslib_1.__metadata("design:paramtypes", [HttpClient])
], ViewService);
export { ViewService };
//# sourceMappingURL=view.service.js.map