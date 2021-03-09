import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppMaterialsModule} from '../../app-materials.module';
import {DataTableModule} from '../data-table-component/data-table.module';
import {NotificationMessageListingComponent} from './notification-message-listing.component';
import {SharedComponentUtilsModule} from '../shared-component-utils/shared-component-utils.module';

@NgModule({
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        AppMaterialsModule,
        DataTableModule,
        SharedComponentUtilsModule,
    ],
    declarations: [
        NotificationMessageListingComponent
    ],
    exports: [
        NotificationMessageListingComponent
    ]
})
export class NotificationMessageListingModule {

}
