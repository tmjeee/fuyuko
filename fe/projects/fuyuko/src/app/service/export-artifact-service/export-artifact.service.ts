import {Injectable} from '@angular/core';
import config from '../../utils/config.util';
import {Observable} from 'rxjs';
import {DataExportArtifact} from '@fuyuko-common/model/data-export.model';
import {HttpClient} from '@angular/common/http';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {map} from 'rxjs/operators';
import {assertDefinedReturn} from "../../utils/common.util";


const URL_EXPORT_ARTIRACTS = () => `${config().api_host_url}/data-export-artifacts`;
const URL_DELETE_EXPORT_ARTIFACT = () => `${config().api_host_url}/data-export-artifact/:dataExportArtifactId`;

@Injectable()
export class ExportArtifactService {

    constructor(private httpClient: HttpClient) {
    }


    allDataExportArtifacts(): Observable<DataExportArtifact[]> {
        return this.httpClient
            .get<ApiResponse<DataExportArtifact[]>>(URL_EXPORT_ARTIRACTS())
            .pipe(
                map((r: ApiResponse<DataExportArtifact[]>) => assertDefinedReturn(r.payload))
            );
    }

    deleteExportArtifact(dataExportArtifactId: number): Observable<ApiResponse> {
        return this.httpClient.delete<ApiResponse>(
            URL_DELETE_EXPORT_ARTIFACT().replace(':dataExportArtifactId', String(dataExportArtifactId)));
    }
}
