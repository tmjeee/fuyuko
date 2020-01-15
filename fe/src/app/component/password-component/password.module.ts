import {NotificationComponent} from '../notification-component/notification.component';
import {NotificationDialogComponent} from '../notification-component/notification-dialog.component';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppMaterialsModule} from '../../app-materials.module';
import {PasswordComponent} from './password.component';
import {NgModule} from '@angular/core';


@NgModule({
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        AppMaterialsModule,
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
