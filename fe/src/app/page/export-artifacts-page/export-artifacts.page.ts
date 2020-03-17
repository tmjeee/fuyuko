import {Component, OnInit} from "@angular/core";
import {DataExportArtifact} from "../../model/data-export.model";
import {ExportDataService} from "../../service/export-data-service/export-data.service";
import {tap} from "rxjs/operators";


@Component({
    templateUrl: './export-artifacts.page.html',
    styleUrls: ['./export-artifacts.page.scss']
})
export class ExportArtifactsPageComponent implements OnInit {

    dataExportArtifacts: DataExportArtifact[];

    constructor(private exportDataService: ExportDataService) {}

    ngOnInit(): void {
        this.exportDataService.allDataExportArtifacts().pipe(
            tap((dataExportArtifacts: DataExportArtifact[]) => {
                console.log('************* dataExportArtifacts', dataExportArtifacts);
                this.dataExportArtifacts = dataExportArtifacts;
            })
        ).subscribe();
    }

}