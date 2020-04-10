import {Injectable} from "@angular/core";
import config from "../../utils/config.util";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";


const URL_GET_HELP = () => `${config().api_host_url}/help/:helpPostfix`;

@Injectable()
export class HelpService {

    constructor(private httpClient: HttpClient) {
    }

    getHelp(helpPostfix: string): Observable<string> {
        return this.httpClient.request(
            'GET',
            URL_GET_HELP().replace(':helpPostfix', helpPostfix),
            {
                observe: 'body',
                responseType: 'text'
            });
    }
}
