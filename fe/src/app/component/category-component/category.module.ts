import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AppMaterialsModule} from "../../app-materials.module";
import {FlexLayoutModule} from "@angular/flex-layout";
import {CategoryComponent} from "./category.component";
import {CategoryTreeComponent} from "./category-tree.component";
import {DataTableModule} from "../data-table-component/data-table.module";
import {DataEditorModule} from "../data-editor-component/data-editor.module";
import {CarouselModule} from "../carousel-component/carousel.module";
import {SharedComponentUtilsModule} from "../shared-component-utils/shared-component-utils.module";


@NgModule({
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        AppMaterialsModule,
        FlexLayoutModule,
        SharedComponentUtilsModule,
        DataTableModule,
        DataEditorModule,
        CarouselModule,
    ],
    declarations: [
        CategoryComponent,
        CategoryTreeComponent,
    ],
    exports: [
        CategoryComponent,
        CategoryTreeComponent,
    ]
})
export class CategoryModule {

}