import {Component, OnInit} from "@angular/core";
import {DataExportArtifact} from "../../model/data-export.model";
import {ExportDataService} from "../../service/export-data-service/export-data.service";
import {tap} from "rxjs/operators";
import {ExportArtifactsComponentEvent} from "../../component/export-data-component/export-artifacts.component";
import {NotificationsService} from "angular2-notifications";


@Component({
    templateUrl: './export-artifacts.page.html',
    styleUrls: ['./export-artifacts.page.scss']
})
export class ExportArtifactsPageComponent implements OnInit {

    dataExportArtifacts: DataExportArtifact[];

    constructor(private exportDataService: ExportDataService,
                private notificationsService: NotificationsService) {}

    ngOnInit(): void {
        this.reload();
    }

    reload() {
        this.exportDataService.allDataExportArtifacts().pipe(
            tap((dataExportArtifacts: DataExportArtifact[]) => {
                this.dataExportArtifacts = dataExportArtifacts;
            })
        ).subscribe();
    }

    onExportArtifactEvents($event: ExportArtifactsComponentEvent) {
        switch($event.type) {
            case 'DELETE':
                const dataExportArtifact: DataExportArtifact = $event.dataExportArtifact;
                this.exportDataService.deleteExportArtifact(dataExportArtifact.id).pipe(
                    tap((_) => {
                        this.reload();
                        this.notificationsService.success(`Deleted`, `Export artifact ${dataExportArtifact.id} deleted`);
                    })
                ).subscribe();
                break;
        }
    }
}