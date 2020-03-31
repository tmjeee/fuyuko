import {Injectable} from "@angular/core";
import config from "../../utils/config.util";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {CustomDataImport} from "../../model/custom-import.model";

const URL_GET_ALL_CUSTOM_IMPORTS = () => `${config().api_host_url}/custom-imports`;


@Injectable()
export class CustomImportService {

    constructor(private httpClient: HttpClient) {}

    getAllCustomImports(): Observable<CustomDataImport[]> {
        return this.httpClient.get<CustomDataImport[]>(URL_GET_ALL_CUSTOM_IMPORTS());
    }
}