import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppMaterialsModule} from '../../app-materials.module';
import {DataTableModule} from '../data-table-component/data-table.module';
import {NotificationMessageListingModule} from '../notification-message-listing-component/notification-message-listing.module';
import {ForumsListingsComponent} from './forums-listings.component';
import {FlexLayoutModule} from '@angular/flex-layout';


@NgModule({
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        AppMaterialsModule,
        DataTableModule,
        FlexLayoutModule,
        NotificationMessageListingModule,
    ],
    declarations: [
        ForumsListingsComponent
    ],
    exports: [
        ForumsListingsComponent
    ]
})
export class ForumModule {

}
