import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppMaterialsModule} from '../../app-materials.module';
import {DataEditorModule} from '../data-editor-component/data-editor.module';
import {ValidationResultComponent} from './validation-result.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ValidationResultTreeComponent} from './validation-result-tree.component';

@NgModule({
   imports: [
      CommonModule,
      BrowserAnimationsModule,
      FormsModule,
      ReactiveFormsModule,
      AppMaterialsModule,
      DataEditorModule,
      FlexLayoutModule,
   ],
   declarations: [
       ValidationResultComponent,
       ValidationResultTreeComponent,
   ],
   exports: [
      ValidationResultComponent,
      ValidationResultTreeComponent,
   ]
})
export class ValidationResultModule {

}
