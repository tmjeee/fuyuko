import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppMaterialsModule} from '../../app-materials.module';
import {ViewTableComponent} from './view-table.component';
import {ViewEditorComponent} from './view-editor.component';
import {ViewEditorDialogComponent} from './view-editor-dialog.component';
import {ViewSelectorComponent} from './view-selector.component';
import {SharedComponentUtilsModule} from '../shared-component-utils/shared-component-utils.module';

@NgModule({
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        AppMaterialsModule,
        SharedComponentUtilsModule,
    ],
    declarations: [
        ViewTableComponent,
        ViewEditorComponent,
        ViewEditorDialogComponent,
        ViewSelectorComponent,
    ],
    exports: [
        ViewTableComponent,
        ViewEditorComponent,
        ViewEditorDialogComponent,
        ViewSelectorComponent,
    ]
})
export class ViewModule {
}
