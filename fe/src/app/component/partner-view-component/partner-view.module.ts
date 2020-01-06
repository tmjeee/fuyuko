import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppMaterialsModule} from '../../app-materials.module';
import {PartnerDataTableComponent} from './partner-data-table.component';
import {PartnerDataListComponent} from './partner-data-list.component';
import {PartnerDataThumbnailComponent} from './partner-data-thumbnail.component';
import {DataEditorModule} from '../data-editor-component/data-editor.module';
import {CarouselModule} from '../carousel-component/carousel.module';
import {PartnerAttributeTableComponent} from './partner-attribute-table.component';


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
        PartnerAttributeTableComponent,
    ],
    exports: [
        PartnerDataTableComponent,
        PartnerDataListComponent,
        PartnerDataThumbnailComponent,
        PartnerAttributeTableComponent,
    ]
})
export class PartnerViewModule {
}
