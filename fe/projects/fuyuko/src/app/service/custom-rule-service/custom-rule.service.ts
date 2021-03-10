import {Injectable} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {CustomRule, CustomRuleForView} from '@fuyuko-common/model/custom-rule.model';
import config from '../../utils/config.util';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';

const URL_GET_ALL_CUSTOM_RULES = () => `${config().api_host_url}/custom-rules`;
const URL_GET_CUSTOM_RULES_BY_VIEW = () => `${config().api_host_url}/view/:viewId/custom-rules`;
const URL_POST_ADD_CUSTOM_RULE_TO_VIEW = () => `${config().api_host_url}/view/:viewId/custom-rules`;
const URL_DELETE_CUSTOM_RULE_FROM_VIEW = () => `${config().api_host_url}/view/:viewId/custom-rules`;
const URL_POST_CHANGE_CUSTOM_RULE_STATUS = () => `${config().api_host_url}/view/:viewId/custom-rules/:customRuleId/status/:status`;

@Injectable()
export class CustomRuleService {

    constructor(private httpClient: HttpClient) { }


    getAllCustomRules(): Observable<CustomRule[]> {
        return this.httpClient
            .get<ApiResponse<CustomRule[]>>(URL_GET_ALL_CUSTOM_RULES())
            .pipe(
                map((r: ApiResponse<CustomRule[]>) => r.payload)
            );
    }

    getCustomRulesByView(viewId: number): Observable<CustomRuleForView[]> {
        return this.httpClient
            .get<ApiResponse<CustomRuleForView[]>>(URL_GET_CUSTOM_RULES_BY_VIEW()
                .replace(':viewId', String(viewId)))
            .pipe(
                map((r: ApiResponse<CustomRuleForView[]>) => r.payload)
            );
    }

    addCustomRuleToView(viewId: number, customRules: CustomRule[]): Observable<ApiResponse> {
        return this.httpClient
            .post<ApiResponse>(URL_POST_ADD_CUSTOM_RULE_TO_VIEW()
                .replace(':viewId', String(viewId)),
                {
                    customRuleIds: customRules.map((r: CustomRule) => r.id)
                });
    }

    removeCustomRuleFromView(viewId: number, customRules: CustomRule[]): Observable<ApiResponse> {
        return this.httpClient
            .request<ApiResponse>('DELETE', URL_DELETE_CUSTOM_RULE_FROM_VIEW()
                .replace(':viewId', String(viewId)),
                {
                    body: {customRuleIds: customRules.map((r: CustomRule) => r.id)}
                });
    }

    enableCustomRuleInView(viewId: number, customRules: CustomRule[]): Observable<ApiResponse[]> {
        return combineLatest(
            customRules.map((cr: CustomRule) => {
                return this.httpClient
                    .post<ApiResponse>(URL_POST_CHANGE_CUSTOM_RULE_STATUS()
                        .replace(':viewId', String(viewId))
                        .replace(':customRuleId', String(cr.id))
                        .replace(':status', 'ENABLED'), {});
            })
        );
    }

    disableCustomRuleInView(viewId: number, customRules: CustomRule[]): Observable<ApiResponse[]> {
        return combineLatest(
            customRules.map((cr: CustomRule) => {
                return this.httpClient
                    .post<ApiResponse>(URL_POST_CHANGE_CUSTOM_RULE_STATUS()
                        .replace(':viewId', String(viewId))
                        .replace(':customRuleId', String(cr.id))
                        .replace(':status', 'DISABLED'), {});
            })
        );
    }





}

