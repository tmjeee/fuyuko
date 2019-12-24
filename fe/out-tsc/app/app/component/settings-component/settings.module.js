import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMaterialsModule } from '../../app-materials.module';
import { SettingsComponent } from './settings.component';
let SettingsModule = class SettingsModule {
};
SettingsModule = tslib_1.__decorate([
    NgModule({
        imports: [
            CommonModule,
            BrowserAnimationsModule,
            FormsModule,
            ReactiveFormsModule,
            AppMaterialsModule
        ],
        declarations: [
            SettingsComponent
        ],
        exports: [
            SettingsComponent
        ]
    })
], SettingsModule);
export { SettingsModule };
//# sourceMappingURL=settings.module.js.map