import {NgModule} from '@angular/core';
import {SafePipe} from './safe.pipe';
import {LoadIfDirective} from './load-if.directive';
import {LoadingComponent} from './loading-component/loading.component';
import {SpaceholderComponent} from './spaceholder-component/spaceholder.component';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppMaterialsModule} from '../../app-materials.module';
import {FlexModule} from '@angular/flex-layout';


@NgModule({
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        AppMaterialsModule,
        FlexModule,
    ],
   declarations: [
       SafePipe,
       LoadIfDirective,
       LoadingComponent,
       SpaceholderComponent,
   ],
   exports: [
       SafePipe,
       LoadIfDirective,
       LoadingComponent,
       SpaceholderComponent,
   ]
})
export class SharedComponentUtilsModule {

}
