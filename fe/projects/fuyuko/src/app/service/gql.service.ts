import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {GraphQLError} from 'graphql';
import {HttpClient} from '@angular/common/http';
import config from '../utils/config.util';
import {AuthService} from './auth-service/auth.service';

export interface GqlQueryResult<T> {
    data: T;
    errors?: ReadonlyArray<GraphQLError>;
}


@Injectable()
export class GqlService {

    constructor(private httpClient: HttpClient,
                private authService: AuthService) {
    }

    post<T>(gql: string): Observable<GqlQueryResult<T>> {
        const gqlHostUrl: string = (config as any).gql_host_url;
        const headers: any = {
            'Content-Type': 'application/json'
        };
        const jwtToken = this.authService.jwtToken();
        if (jwtToken) {
            headers['x-auth-jwt'] = jwtToken;
        }
        return this.httpClient.post<GqlQueryResult<T>>(gqlHostUrl, gql, {
            headers
        });
    }

}
