import {NgModule} from '@angular/core';
import {AvatarDialogComponent} from './avatar-dialog.component';
import {AvatarComponent} from './avatar.component';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppMaterialsModule} from '../../app-materials.module';


@NgModule({
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        AppMaterialsModule,
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
