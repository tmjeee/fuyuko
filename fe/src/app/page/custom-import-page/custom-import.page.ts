import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {
   CustomDataImport,
   ImportScriptInputValue,
   ImportScriptPreview,
} from "../../model/custom-import.model";
import {CustomImportService} from "../../service/custom-import-service/custom-import.service";
import {tap} from "rxjs/operators";
import {
   CustomImportPreviewFn, CustomImportSubmitFn,
   CustomImportValidateFn
} from "../../component/import-data-component/custom-import-wizard.component";

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

   constructor(private customImportService: CustomImportService) {
      this.customImportValidateFn = (c: CustomDataImport, i: ImportScriptInputValue[]) => {
         console.log(';***** validate fn');
         return this.customImportService.validate(c, i);
      };
      this.customImportPreviewFn = (c: CustomDataImport, i: ImportScriptInputValue[]) => {
         return this.customImportService.preview(c, i);
      };
      this.customImportSubmitFn = (c: CustomDataImport, p: ImportScriptPreview,  i: ImportScriptInputValue[]) => {
         return this.customImportService.submit(c, p, i);
      }
   }


   ngOnInit(): void {
      this.ready = false;
      this.customImportService.getAllCustomImports().pipe(
          tap((c: CustomDataImport[]) => {
             this.customDataImports = c;
             this.ready = true;
          })
      ).subscribe();
   }

   ngOnDestroy(): void {
   }

}