import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppMaterialsModule} from '../../app-materials.module';
import {NotificationDialogComponent} from './notification-dialog.component';
import { NotificationComponent } from './notification.component';
import {NotificationMessagesComponent} from "./notification-messages.component";
import {SharedComponentUtilsModule} from "../shared-component-utils/shared-component-utils.module";

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
        NotificationComponent,
        NotificationDialogComponent,
        NotificationMessagesComponent,
    ],
    exports: [
        NotificationComponent,
        NotificationDialogComponent,
        NotificationMessagesComponent,
    ],
    entryComponents: [
        NotificationDialogComponent,
    ]
})
export class NotificationModule {

}
