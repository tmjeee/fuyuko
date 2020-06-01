import {Component, OnInit} from "@angular/core";
import {DataExportArtifact} from "../../model/data-export.model";
import {finalize, tap} from "rxjs/operators";
import {ExportArtifactsComponentEvent} from "../../component/export-data-component/export-artifacts.component";
import {NotificationsService} from "angular2-notifications";
import {ExportArtifactService} from "../../service/export-artifact-service/export-artifact.service";
import {toNotifications} from "../../service/common.service";
import {ApiResponse} from "../../model/api-response.model";


@Component({
    templateUrl: './export-artifacts.page.html',
    styleUrls: ['./export-artifacts.page.scss']
})
export class ExportArtifactsPageComponent implements OnInit {

    ready: boolean;
    dataExportArtifacts: DataExportArtifact[];

    constructor(private exportArtifactService: ExportArtifactService,
                private notificationsService: NotificationsService) {}

    ngOnInit(): void {
        this.reload();
    }

    reload() {
        this.ready = false;
        this.exportArtifactService.allDataExportArtifacts().pipe(
            tap((dataExportArtifacts: DataExportArtifact[]) => {
                this.dataExportArtifacts = dataExportArtifacts;
                this.ready = true;
            }),
            finalize(() => this.ready = true)
        ).subscribe();
    }

    onExportArtifactEvents($event: ExportArtifactsComponentEvent) {
        switch($event.type) {
            case 'DELETE':
                const dataExportArtifact: DataExportArtifact = $event.dataExportArtifact;
                this.exportArtifactService.deleteExportArtifact(dataExportArtifact.id).pipe(
                    tap((_: ApiResponse) => {
                        this.reload();
                        toNotifications(this.notificationsService, _);
                    })
                ).subscribe();
                break;
        }
    }
}