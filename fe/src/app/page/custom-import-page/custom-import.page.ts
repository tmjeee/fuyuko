import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {CustomDataImport} from "../../model/custom-import.model";
import {CustomImportService} from "../../service/custom-import-service/custom-import.service";
import {tap} from "rxjs/operators";

@Component({
   templateUrl: './custom-import.page.html',
   styleUrls: ['./custom-import.page.scss']
})
export class CustomImportPageComponent implements OnInit, OnDestroy{

   customDataImports: CustomDataImport[];
   ready: boolean;

   constructor(private customImportService: CustomImportService) {}


   ngOnInit(): void {
      this.ready = false;
      this.customImportService.getAllCustomImports().pipe(
          tap((c: CustomDataImport[]) => {
              console.log('************ customDataImports', c);
             this.customDataImports = c;
             this.ready = true;
          })
      ).subscribe();
   }

   ngOnDestroy(): void {
   }

}