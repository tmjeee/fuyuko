import {NgModule} from '@angular/core';
import {AvatarDialogComponent} from './avatar-dialog.component';
import {AvatarComponent} from './avatar.component';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppMaterialsModule} from '../../app-materials.module';
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
        AvatarDialogComponent,
        AvatarComponent,
    ],
    exports: [
        AvatarDialogComponent,
        AvatarComponent,
    ],
    entryComponents: [
        AvatarDialogComponent,
    ]
})
export class AvatarModule {

}
