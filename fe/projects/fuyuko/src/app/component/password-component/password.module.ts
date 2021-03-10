import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppMaterialsModule} from '../../app-materials.module';
import {PasswordComponent} from './password.component';
import {NgModule} from '@angular/core';
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
        PasswordComponent
    ],
    exports: [
        PasswordComponent
    ]
})
export class PasswordModule {

}
