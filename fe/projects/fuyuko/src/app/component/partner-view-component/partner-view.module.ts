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
import {FlexLayoutModule} from '@angular/flex-layout';
import {PartnerItemInfoTableComponent} from './partner-item-info-table.component';
import {SharedComponentUtilsModule} from '../shared-component-utils/shared-component-utils.module';


@NgModule({
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        AppMaterialsModule,
        DataEditorModule,
        CarouselModule,
        FlexLayoutModule,
        SharedComponentUtilsModule,
    ],
    declarations: [
        PartnerDataTableComponent,
        PartnerDataListComponent,
        PartnerDataThumbnailComponent,
        PartnerAttributeTableComponent,
        PartnerItemInfoTableComponent,
    ],
    exports: [
        PartnerDataTableComponent,
        PartnerDataListComponent,
        PartnerDataThumbnailComponent,
        PartnerAttributeTableComponent,
        PartnerItemInfoTableComponent,
    ]
})
export class PartnerViewModule {
}
