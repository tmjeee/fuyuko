import {Injectable} from "@angular/core";
import {
    CustomDataExport,
    ExportScriptInputValue,
    ExportScriptJobSubmissionResult,
    ExportScriptPreview, ExportScriptValidateResult
} from "../../model/custom-export.model";
import {View} from "../../model/view.model";
import {Observable} from "rxjs";


@Injectable()
export class CustomExportService {

    validate(c: CustomDataExport, i: ExportScriptInputValue[]): Observable<ExportScriptValidateResult> {
        return undefined;
    }

    preview(v: View, c: CustomDataExport, i: ExportScriptInputValue[]): Observable<ExportScriptPreview> {
        return undefined;
    }

    submit(v: View, c: CustomDataExport, p: ExportScriptPreview, i: ExportScriptInputValue[]): Observable<ExportScriptJobSubmissionResult> {
        return undefined;
    }

    getAllCustomExports(): Observable<CustomDataExport[]> {
        return null;
    }
}