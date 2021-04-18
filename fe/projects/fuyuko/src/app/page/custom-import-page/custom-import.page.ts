import {Component, OnDestroy, OnInit} from '@angular/core';
import {
    CustomDataImport,
    ImportScriptInputValue, ImportScriptJobSubmissionResult,
    ImportScriptPreview, ImportScriptValidateResult,
} from '@fuyuko-common/model/custom-import.model';
import {CustomImportService} from '../../service/custom-import-service/custom-import.service';
import {delay, finalize, tap} from 'rxjs/operators';
import {
   CustomImportPreviewFn, CustomImportSubmitFn,
   CustomImportValidateFn
} from '../../component/import-data-component/custom-import-wizard.component';
import {View} from '@fuyuko-common/model/view.model';
import {LoadingService} from '../../service/loading-service/loading.service';

@Component({
   templateUrl: './custom-import.page.html',
   styleUrls: ['./custom-import.page.scss']
})
export class CustomImportPageComponent implements OnInit, OnDestroy{

   customDataImports: CustomDataImport[];
   ready: boolean;
   customImportValidateFn: CustomImportValidateFn;
   customImportPreviewFn: CustomImportPreviewFn;
   customImportSubmitFn: CustomImportSubmitFn;

   constructor(private customImportService: CustomImportService,
               private loadingService: LoadingService) {
      this.customImportValidateFn = (v: View, c: CustomDataImport, i: ImportScriptInputValue[]) => {
         this.loadingService.startLoading();
         return this.customImportService.validate(v, c, i).pipe(
             tap((r: ImportScriptValidateResult) => {
                 this.loadingService.stopLoading();
             })
         );
      };
      this.customImportPreviewFn = (v: View, c: CustomDataImport, i: ImportScriptInputValue[]) => {
         this.loadingService.startLoading();
         return this.customImportService.preview(v, c, i).pipe(
             tap((r: ImportScriptPreview) => {
                 this.loadingService.stopLoading();
             })
         );
      };
      this.customImportSubmitFn = (v: View, c: CustomDataImport, p: ImportScriptPreview,  i: ImportScriptInputValue[]) => {
          this.loadingService.startLoading();
          return this.customImportService.submit(v, c, p, i).pipe(
             tap((r: ImportScriptJobSubmissionResult) => {
                 this.loadingService.stopLoading();
             })
         );
      };
   }


   ngOnInit(): void {
      this.ready = false;
      this.loadingService.startLoading();
      this.customImportService.getAllCustomImports().pipe(
          tap((c: CustomDataImport[]) => {
             this.customDataImports = c;
             this.ready = true;
          }),
          finalize(() => {
              this.ready = true;
              this.loadingService.stopLoading();
          })
      ).subscribe();
   }

   ngOnDestroy(): void {
       this.loadingService.stopLoading();
   }
}
