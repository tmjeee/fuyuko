import {Injectable} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {CustomRule, CustomRuleForView} from '../../model/custom-rule.model';
import config from '../../utils/config.util';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

const URL_GET_ALL_CUSTOM_RULES = () => `${config().api_host_url}/custom-rules`;
const URL_GET_CUSTOM_RULES_BY_VIEW = () => `${config().api_host_url}/view/:viewId/custom-rules`;
const URL_POST_ADD_CUSTOM_RULE_TO_VIEW = () => `${config().api_host_url}/view/:viewId/custom-rules`;
const URL_DELETE_CUSTOM_RULE_FROM_VIEW = () => `${config().api_host_url}/view/:viewId/custom-rules`;
const URL_POST_CHANGE_CUSTOM_RULE_STATUS = () => `${config().api_host_url}/view/:viewId/custom-rules/:customRuleId/status/:status`;

@Injectable()
export class CustomRuleService {

    constructor(private httpClient: HttpClient) { }


    getAllCustomRules(): Observable<CustomRule[]> {
        return this.httpClient.get<CustomRule[]>(URL_GET_ALL_CUSTOM_RULES());
    }

    getCustomRulesByView(viewId: number): Observable<CustomRuleForView[]> {
        return this.httpClient
            .get<CustomRuleForView[]>(URL_GET_CUSTOM_RULES_BY_VIEW()
                .replace(':viewId', String(viewId)));
    }

    addCustomRuleToView(viewId: number, customRules: CustomRule[]): Observable<boolean> {
        return this.httpClient
            .post<boolean>(URL_POST_ADD_CUSTOM_RULE_TO_VIEW()
                .replace(':viewId', String(viewId)),
                {
                    customRuleIds: customRules.map((r: CustomRule) => r.id)
                });
    }

    removeCustomRuleFromView(viewId: number, customRules: CustomRule[]): Observable<boolean> {
        return this.httpClient
            .request<boolean>('DELETE', URL_DELETE_CUSTOM_RULE_FROM_VIEW()
                .replace(':viewId', String(viewId)),
                {
                    body: {customRuleIds: customRules.map((r: CustomRule) => r.id)}
                });
    }

    enableCustomRuleInView(viewId: number, customRules: CustomRule[]): Observable<boolean> {
        return combineLatest(
            customRules.map((cr: CustomRule) => {
                return this.httpClient
                    .post<boolean>(URL_POST_CHANGE_CUSTOM_RULE_STATUS()
                        .replace(':viewId', String(viewId))
                        .replace(':customRuleId', String(cr.id))
                        .replace(':status', 'ENABLED'), {});
            })
        ).pipe(
            map((_) => true)
        );
    }

    disableCustomRuleInView(viewId: number, customRules: CustomRule[]): Observable<boolean> {
        return combineLatest(
            customRules.map((cr: CustomRule) => {
                return this.httpClient
                    .post<boolean>(URL_POST_CHANGE_CUSTOM_RULE_STATUS()
                        .replace(':viewId', String(viewId))
                        .replace(':customRuleId', String(cr.id))
                        .replace(':status', 'DISABLED'), {});
            })
        ).pipe(
            map((_) => true)
        );
    }





}

