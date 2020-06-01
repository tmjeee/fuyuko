import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {
   CustomDataImport,
   ImportScriptInputValue,
   ImportScriptPreview,
} from "../../model/custom-import.model";
import {CustomImportService} from "../../service/custom-import-service/custom-import.service";
import {finalize, tap} from "rxjs/operators";
import {
   CustomImportPreviewFn, CustomImportSubmitFn,
   CustomImportValidateFn
} from "../../component/import-data-component/custom-import-wizard.component";
import {View} from "../../model/view.model";

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
      this.customImportValidateFn = (v: View, c: CustomDataImport, i: ImportScriptInputValue[]) => {
         return this.customImportService.validate(v, c, i);
      };
      this.customImportPreviewFn = (v: View, c: CustomDataImport, i: ImportScriptInputValue[]) => {
         return this.customImportService.preview(v, c, i);
      };
      this.customImportSubmitFn = (v: View, c: CustomDataImport, p: ImportScriptPreview,  i: ImportScriptInputValue[]) => {
         return this.customImportService.submit(v, c, p, i);
      }
   }


   ngOnInit(): void {
      this.ready = false;
      this.customImportService.getAllCustomImports().pipe(
          tap((c: CustomDataImport[]) => {
             this.customDataImports = c;
             this.ready = true;
          }),
          finalize(() => this.ready = true)
      ).subscribe();
   }

   ngOnDestroy(): void {
   }

}