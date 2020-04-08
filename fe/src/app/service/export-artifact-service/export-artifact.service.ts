import {Injectable} from "@angular/core";
import config from "../../utils/config.util";
import {Observable} from "rxjs";
import {DataExportArtifact} from "../../model/data-export.model";
import {HttpClient} from "@angular/common/http";


const URL_EXPORT_ARTIRACTS = () => `${config().api_host_url}/data-export-artifacts`;
const URL_DELETE_EXPORT_ARTIFACT = () => `${config().api_host_url}/data-export-artifact/:dataExportArtifactId`;

@Injectable()
export class ExportArtifactService {

    constructor(private httpClient: HttpClient) {
    }


    allDataExportArtifacts(): Observable<DataExportArtifact[]> {
        return this.httpClient.get<DataExportArtifact[]>(URL_EXPORT_ARTIRACTS());
    }

    deleteExportArtifact(dataExportArtifactId: number): Observable<boolean> {
        return this.httpClient.delete<boolean>(URL_DELETE_EXPORT_ARTIFACT().replace(':dataExportArtifactId', String(dataExportArtifactId)));
    }
}