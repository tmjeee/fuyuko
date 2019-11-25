import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Rule, ValidateClause, WhenClause} from 'src/app/model/rule.model';
import {StringValue} from '../../model/item.model';
import {HttpClient} from '@angular/common/http';
import {ApiResponse} from '../../model/response.model';
import config from '../../../assets/config.json';


const URL_GET_ALL_RULES_BY_VIEW = `${config.api_host_url}/view/:viewId/rules`;
const URL_POST_UPDATE_RULE_STATUS = `${config.api_host_url}/view/:viewId/rule/:ruleId/status/:status`;
const URL_POST_UPDATE_RULES = `${config.api_host_url}/view/:viewId/rules`;

@Injectable()
export class RuleService {


  constructor(private httpClient: HttpClient) {}


  getAllRulesByView(viewId: number): Observable<Rule[]> {
    return this.httpClient.get<Rule[]>(URL_GET_ALL_RULES_BY_VIEW.replace(':viewId', `${viewId}`));
  }

  addRule(viewId: number, rule: Rule): Observable<ApiResponse> {
      return this.httpClient.post<ApiResponse>(URL_POST_UPDATE_RULES.replace(':viewId', `${viewId}`), {
        rules: [rule]
      });
  }

  updateRule(viewId: number, rule: Rule): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(URL_POST_UPDATE_RULES.replace(':viewId', `${viewId}`), {
      rules: [rule]
    });
  }

  deleteRule(viewId: number, rule: Rule): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(URL_POST_UPDATE_RULE_STATUS
        .replace(':viewId', `${viewId}`)
        .replace(':ruleId', `${rule.id}`)
        .replace(':status', 'DELETED'), {});
  }

  enableRule(viewId: number, rule: Rule): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(URL_POST_UPDATE_RULE_STATUS
        .replace(':viewId', `${viewId}`)
        .replace(':ruleId', `${rule.id}`)
        .replace(':status', 'ENABLED'), {});
  }

  disableRule(viewId: number, rule: Rule): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(URL_POST_UPDATE_RULE_STATUS
        .replace(':viewId', `${viewId}`)
        .replace(':ruleId', `${rule.id}`)
        .replace(':status', 'DISABLED'), {});
  }
}
