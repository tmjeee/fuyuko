import {Component, OnInit} from '@angular/core';
import {DataExportArtifact} from '@fuyuko-common/model/data-export.model';
import {finalize, tap} from 'rxjs/operators';
import {ExportArtifactsComponentEvent} from '../../component/export-data-component/export-artifacts.component';
import {NotificationsService} from 'angular2-notifications';
import {ExportArtifactService} from '../../service/export-artifact-service/export-artifact.service';
import {toNotifications} from '../../service/common.service';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {LoadingService} from '../../service/loading-service/loading.service';


@Component({
    templateUrl: './export-artifacts.page.html',
    styleUrls: ['./export-artifacts.page.scss']
})
export class ExportArtifactsPageComponent implements OnInit {

    ready = false ;
    dataExportArtifacts: DataExportArtifact[] = [];

    constructor(private exportArtifactService: ExportArtifactService,
                private notificationsService: NotificationsService,
                private loadingService: LoadingService) {}

    ngOnInit(): void {
        this.reload();
    }

    reload() {
        this.ready = false;
        this.loadingService.startLoading();
        this.exportArtifactService.allDataExportArtifacts().pipe(
            tap((dataExportArtifacts: DataExportArtifact[]) => {
                this.dataExportArtifacts = dataExportArtifacts;
                this.ready = true;
            }),
            finalize(() => {
                this.ready = true;
                this.loadingService.stopLoading();
            })
        ).subscribe();
    }

    onExportArtifactEvents($event: ExportArtifactsComponentEvent) {
        switch ($event.type) {
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
