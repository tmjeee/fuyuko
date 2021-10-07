import {Component, EventEmitter, Input, OnChanges, Output, SimpleChange, SimpleChanges} from '@angular/core';
import {DataExportArtifact} from '@fuyuko-common/model/data-export.model';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable} from 'rxjs';
import config from '../../utils/config.util';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {tap} from 'rxjs/operators';


export interface ExportArtifactsComponentEvent {
    type: 'DELETE';
    dataExportArtifact: DataExportArtifact;
}

export class InternalDataSource extends DataSource<DataExportArtifact> {

    subject: BehaviorSubject<DataExportArtifact[]>;

    constructor() {
        super();
        this.subject = new BehaviorSubject<DataExportArtifact[]>([]);
    }

    connect(collectionViewer: CollectionViewer): Observable<DataExportArtifact[] | ReadonlyArray<DataExportArtifact>> {
        return this.subject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.subject.complete();
    }

    update(d: DataExportArtifact[]) {
        this.subject.next(d);
    }
}

const URL_DOWNLOAD = () => `${config().api_host_url}/data-export/:dataExportId`;

@Component({
    selector: 'app-export-artifacts',
    templateUrl: './export-artifacts.component.html',
    styleUrls: ['./export-artifacts.component.scss']
})
export class ExportArtifactsComponent implements OnChanges {

    @Input() dataExportArtifacts: DataExportArtifact[] = [];
    @Output() events: EventEmitter<ExportArtifactsComponentEvent>;

    dataSource: InternalDataSource;
    displayColumns: string[];

    constructor(private httpClient: HttpClient) {
        this.dataSource = new InternalDataSource();
        this.displayColumns = ['name', 'view', 'type', 'date', 'fileName', 'mimetype', 'size', 'action'];
        this.events = new EventEmitter<ExportArtifactsComponentEvent>();
    }

    download(dataExportArtifact: DataExportArtifact) {
        this.httpClient.get(URL_DOWNLOAD().replace(':dataExportId', String(dataExportArtifact.id)), {
            responseType: 'blob',
            observe: 'response'
        }).pipe(
            tap((r: HttpResponse<Blob>) =>  {
                const url = window.URL.createObjectURL(r.body);
                // window.open(url);
                window.location.href = url;
            })
        ).subscribe();
    }

    ngOnChanges(changes: SimpleChanges): void {
        const change: SimpleChange = changes.dataExportArtifacts;
        if (change && change.currentValue) {
            this.dataSource.update(change.currentValue);
        }
    }

    onDelete(dataExportArtifact: any) {
        this.events.emit({
            type: 'DELETE',
            dataExportArtifact
        });
    }
}

