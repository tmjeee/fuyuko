import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppMaterialsModule} from '../app-materials.module';


@NgModule({
   imports: [
      CommonModule,
      BrowserAnimationsModule,
      FormsModule,
      ReactiveFormsModule,
      AppMaterialsModule,
   ],
   declarations: [
   ],
   exports: [
   ]
})
export class UtilsModule {}
