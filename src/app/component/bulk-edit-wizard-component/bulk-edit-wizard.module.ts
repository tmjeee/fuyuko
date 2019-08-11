import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppMaterialsModule} from '../../app-materials.module';
import {BulkEditWizardComponent} from './bulk-edit-wizard.component';
import {DataEditorModule} from '../data-editor-component/data-editor.module';

@NgModule({
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        AppMaterialsModule,
        DataEditorModule,
    ],
    declarations: [
        BulkEditWizardComponent
    ],
    exports: [
        BulkEditWizardComponent
    ]
})
export class BulkEditWizardModule {
}
