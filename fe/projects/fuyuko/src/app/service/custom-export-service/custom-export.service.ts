import {Injectable} from '@angular/core';
import {
    CustomDataExport,
    ExportScriptInputValue,
    ExportScriptJobSubmissionResult,
    ExportScriptPreview, ExportScriptValidateResult
} from '@fuyuko-common/model/custom-export.model';
import {View} from '@fuyuko-common/model/view.model';
import {Observable} from 'rxjs';
import config from '../../utils/config.util';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {assertDefinedReturn} from "../../utils/common.util";

const URL_GET_ALL_CUSTOM_EXPORTS = () => `${config().api_host_url}/custom-exports`;
const URL_POST_CUSTOM_EXPORT_VALIDATE_INPUTS = () => `${config().api_host_url}/view/:viewId/custom-export/:customExportId/validate-input`;
const URL_POST_CUSTOM_EXPORT_PREVIEW = () => `${config().api_host_url}/view/:viewId/custom-export/:customExportId/preview`;
const URL_POST_CUSTOM_EXPORT_SUBMIT = () => `${config().api_host_url}/view/:viewId/custom-export/:customExportId/submit-job`;

@Injectable()
export class CustomExportService {

    constructor(private httpClient: HttpClient) {}

    validate(v: View, c: CustomDataExport, i: ExportScriptInputValue[]): Observable<ExportScriptValidateResult> {
        return this.httpClient.post<ApiResponse<ExportScriptValidateResult>>(
            URL_POST_CUSTOM_EXPORT_VALIDATE_INPUTS()
                .replace(':viewId', String(v.id))
                .replace(':customExportId', String(c.id)), {
                values: i
            }).pipe(map((r: ApiResponse<ExportScriptValidateResult>) => assertDefinedReturn(r.payload)));
    }

    preview(v: View, c: CustomDataExport, i: ExportScriptInputValue[]): Observable<ExportScriptPreview> {
        return this.httpClient.post<ApiResponse<ExportScriptPreview>>(
            URL_POST_CUSTOM_EXPORT_PREVIEW()
                .replace(':viewId', String(v.id))
                .replace(':customExportId', String(c.id)), {
                values: i
            }).pipe(
                map((r: ApiResponse<ExportScriptPreview>) => assertDefinedReturn(r.payload))
            );
    }

    submit(v: View, c: CustomDataExport, p: ExportScriptPreview, i: ExportScriptInputValue[]): Observable<ExportScriptJobSubmissionResult> {
        return this.httpClient.post<ApiResponse<ExportScriptJobSubmissionResult>>(
            URL_POST_CUSTOM_EXPORT_SUBMIT()
                .replace(':viewId', String(v.id))
                .replace(':customExportId', String(c.id)), {
                values: i,
                preview: p
            }).pipe(
                map((r: ApiResponse<ExportScriptJobSubmissionResult>) => assertDefinedReturn(r.payload))
            );
    }

    getAllCustomExports(): Observable<CustomDataExport[]> {
        return this.httpClient
            .get<ApiResponse<CustomDataExport[]>>(URL_GET_ALL_CUSTOM_EXPORTS())
            .pipe(
                map((r: ApiResponse<CustomDataExport[]>) => assertDefinedReturn(r.payload))
            );
    }
}
