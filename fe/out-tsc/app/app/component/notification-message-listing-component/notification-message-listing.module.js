import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMaterialsModule } from '../../app-materials.module';
import { AngularFileUploaderModule } from 'angular-file-uploader';
import { DataTableModule } from '../data-table-component/data-table.module';
import { NotificationMessageListingComponent } from "./notification-message-listing.component";
let NotificationMessageListingModule = class NotificationMessageListingModule {
};
NotificationMessageListingModule = tslib_1.__decorate([
    NgModule({
        imports: [
            CommonModule,
            BrowserAnimationsModule,
            FormsModule,
            ReactiveFormsModule,
            AppMaterialsModule,
            AngularFileUploaderModule,
            DataTableModule,
        ],
        declarations: [
            NotificationMessageListingComponent
        ],
        exports: [
            NotificationMessageListingComponent
        ]
    })
], NotificationMessageListingModule);
export { NotificationMessageListingModule };
//# sourceMappingURL=notification-message-listing.module.js.map