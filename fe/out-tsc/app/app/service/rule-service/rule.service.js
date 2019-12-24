import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import config from '../../../assets/config.json';
const URL_GET_ALL_RULES_BY_VIEW = `${config.api_host_url}/view/:viewId/rules`;
const URL_POST_UPDATE_RULE_STATUS = `${config.api_host_url}/view/:viewId/rule/:ruleId/status/:status`;
const URL_POST_UPDATE_RULES = `${config.api_host_url}/view/:viewId/rules`;
let RuleService = class RuleService {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }
    getAllRulesByView(viewId) {
        return this.httpClient.get(URL_GET_ALL_RULES_BY_VIEW.replace(':viewId', `${viewId}`));
    }
    addRule(viewId, rule) {
        return this.httpClient.post(URL_POST_UPDATE_RULES.replace(':viewId', `${viewId}`), {
            rules: [rule]
        });
    }
    updateRule(viewId, rule) {
        return this.httpClient.post(URL_POST_UPDATE_RULES.replace(':viewId', `${viewId}`), {
            rules: [rule]
        });
    }
    deleteRule(viewId, rule) {
        return this.httpClient.post(URL_POST_UPDATE_RULE_STATUS
            .replace(':viewId', `${viewId}`)
            .replace(':ruleId', `${rule.id}`)
            .replace(':status', 'DELETED'), {});
    }
    enableRule(viewId, rule) {
        return this.httpClient.post(URL_POST_UPDATE_RULE_STATUS
            .replace(':viewId', `${viewId}`)
            .replace(':ruleId', `${rule.id}`)
            .replace(':status', 'ENABLED'), {});
    }
    disableRule(viewId, rule) {
        return this.httpClient.post(URL_POST_UPDATE_RULE_STATUS
            .replace(':viewId', `${viewId}`)
            .replace(':ruleId', `${rule.id}`)
            .replace(':status', 'DISABLED'), {});
    }
};
RuleService = tslib_1.__decorate([
    Injectable(),
    tslib_1.__metadata("design:paramtypes", [HttpClient])
], RuleService);
export { RuleService };
//# sourceMappingURL=rule.service.js.map