import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMaterialsModule } from '../../app-materials.module';
import { DataEditorModule } from '../data-editor-component/data-editor.module';
import { JobsModule } from '../jobs-component/jobs.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DashboardComponent } from './dashboard.component';
import { WidgetContainerComponent } from './widget-container.component';
import { Sample1WidgetComponent } from './widgets/sample-1-widget/sample-1-widget.component';
import { Sample2WidgetComponent } from './widgets/sample-2-widget/sample-2-widget.component';
let DashboardModule = class DashboardModule {
};
DashboardModule = tslib_1.__decorate([
    NgModule({
        imports: [
            CommonModule,
            BrowserAnimationsModule,
            FormsModule,
            ReactiveFormsModule,
            AppMaterialsModule,
            DataEditorModule,
            FlexLayoutModule,
            JobsModule,
        ],
        declarations: [
            DashboardComponent,
            WidgetContainerComponent,
            Sample1WidgetComponent,
            Sample2WidgetComponent,
        ],
        exports: [
            DashboardComponent,
            WidgetContainerComponent,
            Sample1WidgetComponent,
            Sample2WidgetComponent,
        ],
        entryComponents: [
            Sample1WidgetComponent,
            Sample2WidgetComponent,
        ]
    })
], DashboardModule);
export { DashboardModule };
//# sourceMappingURL=dashboard.module.js.map