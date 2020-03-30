import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {CustomDataImport} from "../../model/custom-import.model";
import {CustomImportService} from "../../service/custom-import-service/custom-import.service";

@Component({
   templateUrl: './custom-import.page.html',
   styleUrls: ['./custom-import.page.scss']
})
export class CustomImportPageComponent implements OnInit, OnDestroy{

   constructor(private customImportService: CustomImportService) {}


   ngOnInit(): void {
   }

   ngOnDestroy(): void {
   }

}