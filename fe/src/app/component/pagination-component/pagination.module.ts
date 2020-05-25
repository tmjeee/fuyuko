import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AppMaterialsModule} from "../../app-materials.module";
import {PaginationComponent} from "./pagination.component";
import {SharedComponentUtilsModule} from "../shared-component-utils/shared-component-utils.module";


@NgModule({
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        AppMaterialsModule,
        SharedComponentUtilsModule,
    ],
    declarations: [
        PaginationComponent,
    ],
    exports: [
        PaginationComponent,
    ]
})
export class PaginationModule {

}