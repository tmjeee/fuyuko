import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMaterialsModule } from '../../app-materials.module';
import { AngularFileUploaderModule } from 'angular-file-uploader';
import { DataTableModule } from '../data-table-component/data-table.module';
import { NotificationMessageListingModule } from '../notification-message-listing-component/notification-message-listing.module';
import { ForumsListingsComponent } from './forums-listings.component';
import { FlexLayoutModule } from '@angular/flex-layout';
let ForumModule = class ForumModule {
};
ForumModule = tslib_1.__decorate([
    NgModule({
        imports: [
            CommonModule,
            BrowserAnimationsModule,
            FormsModule,
            ReactiveFormsModule,
            AppMaterialsModule,
            AngularFileUploaderModule,
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
], ForumModule);
export { ForumModule };
//# sourceMappingURL=forum.module.js.map