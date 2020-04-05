import {Injectable} from "@angular/core";
import {
    CustomDataExport,
    ExportScriptInputValue,
    ExportScriptJobSubmissionResult,
    ExportScriptPreview, ExportScriptValidateResult
} from "../../model/custom-export.model";
import {View} from "../../model/view.model";
import {Observable} from "rxjs";
import config from "../../utils/config.util";
import {HttpClient} from "@angular/common/http";

const URL_GET_ALL_CUSTOM_EXPORTS = () => `${config().api_host_url}/custom-exports`;
const URL_POST_CUSTOM_EXPORT_VALIDATE_INPUTS = () => `${config().api_host_url}/view/:viewId/custom-export/:customExportId/validate-input`;
const URL_POST_CUSTOM_EXPORT_PREVIEW = () => `${config().api_host_url}/view/:viewId/custom-export/:customExportId/preview`;
const URL_POST_CUSTOM_EXPORT_SUBMIT = () => `${config().api_host_url}/view/:viewId/custom-export/:customExportId/submit-job`;

@Injectable()
export class CustomExportService {

    constructor(private httpClient: HttpClient) {}

    validate(v: View, c: CustomDataExport, i: ExportScriptInputValue[]): Observable<ExportScriptValidateResult> {
        return this.httpClient.post<ExportScriptValidateResult>(
            URL_POST_CUSTOM_EXPORT_VALIDATE_INPUTS()
                .replace(':viewId', String(v.id))
                .replace(':customExportId', String(c.id)), {
                values: i
            });
    }

    preview(v: View, c: CustomDataExport, i: ExportScriptInputValue[]): Observable<ExportScriptPreview> {
        return this.httpClient.post<ExportScriptPreview>(
            URL_POST_CUSTOM_EXPORT_PREVIEW()
                .replace(':viewId', String(v.id))
                .replace(':customExportId', String(c.id)), {
                values: i
            });
    }

    submit(v: View, c: CustomDataExport, p: ExportScriptPreview, i: ExportScriptInputValue[]): Observable<ExportScriptJobSubmissionResult> {
        return this.httpClient.post<ExportScriptJobSubmissionResult>(
            URL_POST_CUSTOM_EXPORT_SUBMIT()
                .replace(':viewId', String(v.id))
                .replace(':customExportId', String(c.id)), {
                values: i,
                preview: p
            });
    }

    getAllCustomExports(): Observable<CustomDataExport[]> {
        return this.httpClient.get<CustomDataExport[]>(URL_GET_ALL_CUSTOM_EXPORTS());
    }
}