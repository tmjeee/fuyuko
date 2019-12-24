import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMaterialsModule } from '../../app-materials.module';
import { AngularFileUploaderModule } from 'angular-file-uploader';
import { DataTableModule } from '../data-table-component/data-table.module';
import { NotificationMessageListingModule } from '../notification-message-listing-component/notification-message-listing.module';
import { HelpCenterComponent } from './help-center.component';
let HelpCenterModule = class HelpCenterModule {
};
HelpCenterModule = tslib_1.__decorate([
    NgModule({
        imports: [
            CommonModule,
            BrowserAnimationsModule,
            FormsModule,
            ReactiveFormsModule,
            AppMaterialsModule,
            AngularFileUploaderModule,
            DataTableModule,
            NotificationMessageListingModule,
        ],
        declarations: [
            HelpCenterComponent
        ],
        exports: [
            HelpCenterComponent
        ]
    })
], HelpCenterModule);
export { HelpCenterModule };
//# sourceMappingURL=help-center.module.js.map