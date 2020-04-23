import {Component, OnInit} from '@angular/core';
import {ImportDataService} from '../../service/import-data-service/import-data.service';
import {ViewService} from '../../service/view-service/view.service';
import {tap} from 'rxjs/operators';
import {View} from '../../model/view.model';
import {
    ShowPreviewFn,
    SubmitDataImportFn,
} from '../../component/import-data-component/import-data.component';
import {
    AttributeDataImport, DataImportType,
    ItemDataImport,
    PriceDataImport,
} from '../../model/data-import.model';


@Component({
  templateUrl: './import.page.html',
  styleUrls: ['./import.page.scss']
})
export class ImportPageComponent implements OnInit {
  ready: boolean;
  allViews: View[] = [];
  showPreviewFn: ShowPreviewFn;
  submitDataImportFn: SubmitDataImportFn;

  constructor(private importDataService: ImportDataService, private viewService: ViewService) {
  }

  ngOnInit(): void {
      this.ready = false;
      this.showPreviewFn = (viewId: number, uploadType: DataImportType, file: File) => {
          return this.importDataService.showPreview(viewId, uploadType, file);
      };
      this.submitDataImportFn = ((viewId: number, uploadType: DataImportType,
                                  dataImport: AttributeDataImport | ItemDataImport | PriceDataImport) => {
            return this.importDataService.submitDataImport(viewId, uploadType, dataImport);
      });
      this.viewService.getAllViews()
          .pipe(
              tap((v: View[]) => {
                  this.allViews = v;
                  this.ready = true;
              })
          ).subscribe();
  }
}
