import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppMaterialsModule} from '../../app-materials.module';
import {ValidationResultComponent} from './validation-result.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ValidationResultTreeComponent} from './validation-result-tree.component';
import {ValidationResultConsoleComponent} from './validation-result-console.component';
import {ValidationResultListingComponent} from './validation-result-listing.component';
import {ValidationResultLogComponent} from './validation-result-log.component';
import {ValidationResultTableComponent} from './validation-result-table.component';
import {DataEditorModule} from '../data-editor-component/data-editor.module';
import {ValidationRunComponent} from './validation-run.component';
import {ValidationCreationDialogComponent} from './validation-creation-dialog.component';
import {SharedComponentUtilsModule} from '../shared-component-utils/shared-component-utils.module';

@NgModule({
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        AppMaterialsModule,
        DataEditorModule,
        FlexLayoutModule,
        SharedComponentUtilsModule,
    ],
    declarations: [
        ValidationResultComponent,
        ValidationResultTreeComponent,
        ValidationResultConsoleComponent,
        ValidationResultListingComponent,
        ValidationResultLogComponent,
        ValidationResultTableComponent,
        ValidationRunComponent,
        ValidationCreationDialogComponent,
    ],
    exports: [
        ValidationResultComponent,
        ValidationResultTreeComponent,
        ValidationResultConsoleComponent,
        ValidationResultListingComponent,
        ValidationResultLogComponent,
        ValidationResultTableComponent,
        ValidationRunComponent,
        ValidationCreationDialogComponent,
    ]
})
export class ValidationResultModule {

}
