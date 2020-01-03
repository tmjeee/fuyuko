import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppMaterialsModule} from '../../app-materials.module';
import {NotificationDialogComponent} from './notification-dialog.component';
import { NotificationComponent } from './notification.component';

@NgModule({
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        AppMaterialsModule,
    ],
    declarations: [
        NotificationComponent,
        NotificationDialogComponent,
    ],
    exports: [
        NotificationComponent,
        NotificationDialogComponent,
    ],
    entryComponents: [
        NotificationDialogComponent,
    ]
})
export class NotificationModule {

}
