import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppMaterialsModule} from '../../app-materials.module';
import {DataTableModule} from '../data-table-component/data-table.module';
import {NotificationMessageListingComponent} from './notification-message-listing.component';

@NgModule({
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        AppMaterialsModule,
        DataTableModule,
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
