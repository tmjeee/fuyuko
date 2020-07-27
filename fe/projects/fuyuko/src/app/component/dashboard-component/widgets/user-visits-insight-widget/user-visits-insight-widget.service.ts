import {Injectable} from "@angular/core";
import config from "../../../../utils/config.util";
import {HttpClient} from "@angular/common/http";
import {ApiResponse} from "../../../../model/api-response.model";
import {map, take} from "rxjs/operators";
import {Observable} from "rxjs";

const URL_GET_USER_VISITS_INSIGHT_INFO = () => `${config().api_host_url}/reporting/user-visits-insight`;

@Injectable()
export class UserVisitsInsightWidgetService {

    constructor(private httpClient: HttpClient) {
    }

    getUserVisitInsights(): Observable<{
        daily: {date: string, count: number}[],
        weekly: {date: string, count: number}[],
        monthly: {date: string, count: number}[],
        yearly: {date: string, count: number}[]
    }> {
        return this.httpClient.get<ApiResponse<{
                daily: {date: string, count: number}[],
                weekly: {date: string, count: number}[],
                monthly: {date: string, count: number}[],
                yearly: {date: string, count: number}[]
            }>>(URL_GET_USER_VISITS_INSIGHT_INFO())
            .pipe(
                take(1),
                map((r: ApiResponse<{
                    daily: {date: string, count: number}[],
                    weekly: {date: string, count: number}[],
                    monthly: {date: string, count: number}[],
                    yearly: {date: string, count: number}[]
                }>) => {
               return r.payload;
            }));
    }
}