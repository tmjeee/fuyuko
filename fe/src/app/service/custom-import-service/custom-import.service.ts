import {Injectable} from "@angular/core";
import config from "../../utils/config.util";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {
    CustomDataImport,
    ImportScriptInputValue, ImportScriptJobSubmissionResult,
    ImportScriptPreview,
    ImportScriptValidateResult
} from "../../model/custom-import.model";

const URL_GET_ALL_CUSTOM_IMPORTS = () => `${config().api_host_url}/custom-imports`;
const URL_POST_CUSTOM_IMPORT_VALIDATE_INPUTS = () => `${config().api_host_url}/custom-import/:customImportId/validate-input`;
const URL_POST_CUSTOM_IMPORT_PREVIEW = () => `${config().api_host_url}/custom-import/:customImportId/preview`;
const URL_POST_CUSTOM_IMPORT_SUBMIT = () => `${config().api_host_url}/custom-import/:customImportId/submit-job`;

const p = `/custom-import/:customImportId/submit-job`;

@Injectable()
export class CustomImportService {

    constructor(private httpClient: HttpClient) {}

    getAllCustomImports(): Observable<CustomDataImport[]> {
        return this.httpClient.get<CustomDataImport[]>(URL_GET_ALL_CUSTOM_IMPORTS());
    }

    validate(c: CustomDataImport, i: ImportScriptInputValue[]): Observable<ImportScriptValidateResult> {
        console.log('*** call validate ');
        return this.httpClient.post<ImportScriptValidateResult>(
            URL_POST_CUSTOM_IMPORT_VALIDATE_INPUTS().replace(':customImportId', String(c.id)), {
                values: i
            });
    }

    preview(c: CustomDataImport, i: ImportScriptInputValue[]): Observable<ImportScriptPreview> {
        return this.httpClient.post<ImportScriptPreview>(
            URL_POST_CUSTOM_IMPORT_PREVIEW().replace(':customImportId', String(c.id)), {
                values: i
            });
    }

    submit(c: CustomDataImport, p: ImportScriptPreview, i: ImportScriptInputValue[]): Observable<ImportScriptJobSubmissionResult> {
        return this.httpClient.post<ImportScriptJobSubmissionResult>(
            URL_POST_CUSTOM_IMPORT_SUBMIT().replace(':customImportId', String(c.id)), {
                values: i,
                preview: p
            });
    }
}