import {Component, OnInit} from "@angular/core";
import {DataExportArtifact} from "../../model/data-export.model";
import {tap} from "rxjs/operators";
import {ExportArtifactsComponentEvent} from "../../component/export-data-component/export-artifacts.component";
import {NotificationsService} from "angular2-notifications";
import {ExportArtifactService} from "../../service/export-artifact-service/export-artifact.service";


@Component({
    templateUrl: './export-artifacts.page.html',
    styleUrls: ['./export-artifacts.page.scss']
})
export class ExportArtifactsPageComponent implements OnInit {

    dataExportArtifacts: DataExportArtifact[];

    constructor(private exportArtifactService: ExportArtifactService,
                private notificationsService: NotificationsService) {}

    ngOnInit(): void {
        this.reload();
    }

    reload() {
        this.exportArtifactService.allDataExportArtifacts().pipe(
            tap((dataExportArtifacts: DataExportArtifact[]) => {
                this.dataExportArtifacts = dataExportArtifacts;
            })
        ).subscribe();
    }

    onExportArtifactEvents($event: ExportArtifactsComponentEvent) {
        switch($event.type) {
            case 'DELETE':
                const dataExportArtifact: DataExportArtifact = $event.dataExportArtifact;
                this.exportArtifactService.deleteExportArtifact(dataExportArtifact.id).pipe(
                    tap((_) => {
                        this.reload();
                        this.notificationsService.success(`Deleted`, `Export artifact ${dataExportArtifact.id} deleted`);
                    })
                ).subscribe();
                break;
        }
    }
}