import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AppMaterialsModule} from "../../app-materials.module";
import {FlexLayoutModule} from "@angular/flex-layout";
import {CategoryComponent} from "./category.component";


@NgModule({
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        AppMaterialsModule,
        FlexLayoutModule,
    ],
    declarations: [
        CategoryComponent,
    ],
    exports: [
        CategoryComponent,
    ]
})
export class CategoryModule {

}