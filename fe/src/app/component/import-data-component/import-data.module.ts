import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AppMaterialsModule} from "../../app-materials.module";
import {ImportDataComponent} from "./import-data.component";
import {AngularFileUploaderModule} from "angular-file-uploader";

@NgModule({
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        AppMaterialsModule,
        AngularFileUploaderModule,
    ],
    declarations: [
        ImportDataComponent
    ],
    exports: [
        ImportDataComponent
    ]
})
export class ImportDataModule {

}
