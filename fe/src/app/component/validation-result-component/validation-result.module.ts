import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppMaterialsModule} from '../../app-materials.module';
import {DataEditorModule} from '../data-editor-component/data-editor.module';
import {ValidationResultComponent} from './validation-result.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ValidationResultTreeComponent} from './validation-result-tree.component';
import {ValidationResultConsoleComponent} from './validation-result-console.component';
import {DataTableModule} from '../data-table-component/data-table.module';
import {ValidationResultListingComponent} from './validation-result-listing.component';
import {ValidationResultLogComponent} from './validation-result-log.component';

@NgModule({
   imports: [
      CommonModule,
      BrowserAnimationsModule,
      FormsModule,
      ReactiveFormsModule,
      AppMaterialsModule,
      DataTableModule,
      FlexLayoutModule,
   ],
   declarations: [
       ValidationResultComponent,
       ValidationResultTreeComponent,
       ValidationResultConsoleComponent,
       ValidationResultListingComponent,
       ValidationResultLogComponent,
   ],
   exports: [
      ValidationResultComponent,
      ValidationResultTreeComponent,
      ValidationResultConsoleComponent,
      ValidationResultListingComponent,
      ValidationResultLogComponent,
   ]
})
export class ValidationResultModule {

}
