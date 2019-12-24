import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMaterialsModule } from '../../app-materials.module';
import { JobsListingsComponent } from './jobs-listings.component';
import { JobDetailsComponent } from './job-details.component';
let JobsModule = class JobsModule {
};
JobsModule = tslib_1.__decorate([
    NgModule({
        imports: [
            CommonModule,
            BrowserAnimationsModule,
            FormsModule,
            ReactiveFormsModule,
            AppMaterialsModule
        ],
        declarations: [
            JobsListingsComponent,
            JobDetailsComponent
        ],
        exports: [
            JobsListingsComponent,
            JobDetailsComponent
        ]
    })
], JobsModule);
export { JobsModule };
//# sourceMappingURL=jobs.module.js.map