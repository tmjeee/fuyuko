import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppMaterialsModule} from '../../app-materials.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {CategoryComponent} from './category.component';
import {CategoryTreeComponent} from './category-tree.component';
import {DataTableModule} from '../data-table-component/data-table.module';
import {DataEditorModule} from '../data-editor-component/data-editor.module';
import {CarouselModule} from '../carousel-component/carousel.module';
import {SharedComponentUtilsModule} from '../shared-component-utils/shared-component-utils.module';
import {DataThumbnailModule} from '../data-thumbnail-component/data-thumbnail.module';
import {DataListModule} from '../data-list-component/data-list.module';
import {PaginationModule} from '../pagination-component/pagination.module';
import {CategoryManagementComponent} from './category-management.component';
import {CategoryItemTableComponent} from './category-item-table.component';
import {EditCategoryPopupComponent} from './edit-category-popup.component';


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
        DataThumbnailModule,
        DataListModule,
        DataEditorModule,
        CarouselModule,
        PaginationModule,
    ],
    declarations: [
        CategoryComponent,
        CategoryTreeComponent,
        CategoryManagementComponent,
        CategoryItemTableComponent,
        EditCategoryPopupComponent,
    ],
    exports: [
        CategoryComponent,
        CategoryTreeComponent,
        CategoryManagementComponent,
        CategoryItemTableComponent,
        EditCategoryPopupComponent,
    ]
})
export class CategoryModule {

}
