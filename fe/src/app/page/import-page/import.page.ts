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
    AttributeDataImport,
    DataImport,
    ItemDataImport,
    PriceDataImport,
    UploadType
} from '../../model/data-import.model';


@Component({
  templateUrl: './import.page.html',
  styleUrls: ['./import.page.scss']
})
export class ImportPageComponent implements OnInit {

  allViews: View[] = [];
  shwoPreviewFn: ShowPreviewFn;
  submitDataImportFn: SubmitDataImportFn;

  constructor(private importDataService: ImportDataService, private viewService: ViewService) {
  }

  ngOnInit(): void {
      this.shwoPreviewFn = (uploadType: UploadType, file: File) => {
          return this.importDataService.showPreview(uploadType, file);
      };
      this.submitDataImportFn = ((uploadType: UploadType, dataImport: AttributeDataImport | ItemDataImport | PriceDataImport) => {
            return this.importDataService.submitDataImport(uploadType, dataImport);
      });
      this.viewService.getAllViews()
          .pipe(
              tap((v: View[]) => {
                  this.allViews = v;
              })
          ).subscribe();
  }
}
