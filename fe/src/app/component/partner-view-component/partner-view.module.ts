import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppMaterialsModule} from '../../app-materials.module';
import {PartnerDataTableComponent} from './partner-data-table.component';
import {PartnerDataListComponent} from './partner-data-list.component';
import {PartnerDataThumbnailComponent} from './partner-data-thumbnail.component';
import {DataEditorModule} from '../data-editor-component/data-editor.module';
import {CarouselModule} from "../carousel-component/carousel.module";


@NgModule({
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        AppMaterialsModule,
        DataEditorModule,
        CarouselModule,
    ],
    declarations: [
        PartnerDataTableComponent,
        PartnerDataListComponent,
        PartnerDataThumbnailComponent,
    ],
    exports: [
        PartnerDataTableComponent,
        PartnerDataListComponent,
        PartnerDataThumbnailComponent,
    ]
})
export class PartnerViewModule {
}
