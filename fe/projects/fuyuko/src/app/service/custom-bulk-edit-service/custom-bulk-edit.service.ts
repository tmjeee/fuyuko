import {Injectable} from "@angular/core";
import {View} from "../../model/view.model";
import {
    CustomBulkEdit,
    CustomBulkEditScriptInputValue, CustomBulkEditScriptJobSubmissionResult, CustomBulkEditScriptPreview,
    CustomBulkEditScriptValidateResult
} from "../../model/custom-bulk-edit.model";
import {Observable, of} from "rxjs";
import config from "../../utils/config.util";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {ApiResponse} from "../../model/api-response.model";

const URL_GET_CUSTOM_BULK_EDITS = () => `${config().api_host_url}/custom-bulk-edits`;
const URL_POST_CUSTOM_BULK_EDIT_PREVIEW = () => `${config().api_host_url}/view/:viewId/custom-bulk-edit/:customBulkEditId/preview`;
const URL_POST_CUSTOM_BULK_EDIT_SUBMIT_JOB = () => `${config().api_host_url}/view/:viewId/custom-bulk-edit/:customBulkEditId/submit-job`;
const URL_POST_CUSTOM_BULK_EDIT_VALIDATE = () => `${config().api_host_url}/view/:viewId/custom-bulk-edit/:customBulkEditId/validate-input`;

@Injectable()
export class CustomBulkEditService {

    constructor(private httpClient: HttpClient) {
    }


    validate(v: View, c: CustomBulkEdit, i: CustomBulkEditScriptInputValue[]): Observable<CustomBulkEditScriptValidateResult> {
        return this.httpClient.post<ApiResponse<CustomBulkEditScriptValidateResult>>(
            URL_POST_CUSTOM_BULK_EDIT_VALIDATE()
                .replace(':viewId', String(v.id))
                .replace(':customBulkEditId', String(c.id)), {
                    values: i
                }).pipe(map((r: ApiResponse<CustomBulkEditScriptValidateResult>) => r.payload));
    }

    preview(v: View, c: CustomBulkEdit, i: CustomBulkEditScriptInputValue[]): Observable<CustomBulkEditScriptPreview> {
        return this.httpClient.post<ApiResponse<CustomBulkEditScriptPreview>>(
            URL_POST_CUSTOM_BULK_EDIT_PREVIEW()
                .replace(':viewId', String(v.id))
                .replace(':customBulkEditId', String(c.id)), {
                    values: i
                }).pipe(map((r: ApiResponse<CustomBulkEditScriptPreview>) => r.payload));
    }

    submit(v: View, c: CustomBulkEdit, p: CustomBulkEditScriptPreview, i: CustomBulkEditScriptInputValue[]) : Observable<CustomBulkEditScriptJobSubmissionResult>{
        return this.httpClient.post<ApiResponse<CustomBulkEditScriptValidateResult>>(
            URL_POST_CUSTOM_BULK_EDIT_SUBMIT_JOB()
                .replace(':viewId', String(v.id))
                .replace(':customBulkEditId', String(c.id)), {
                    values: i,
                    preview: p
                }).pipe(map((r: ApiResponse<CustomBulkEditScriptJobSubmissionResult>) => r.payload));
    }

    getAllCustomBulkEdits(): Observable<CustomBulkEdit[]> {
        return this.httpClient.get<ApiResponse<CustomBulkEdit[]>>(
            URL_GET_CUSTOM_BULK_EDITS()).pipe(map((r: ApiResponse<CustomBulkEdit[]>) => r.payload));
    }
}