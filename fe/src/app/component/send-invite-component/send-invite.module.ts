import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppMaterialsModule} from '../../app-materials.module';
import {SendInviteComponent} from './send-invite.component';
import {NgModule} from "@angular/core";


@NgModule({
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        AppMaterialsModule,
    ],
    declarations: [
       SendInviteComponent,
    ],
    exports: [
       SendInviteComponent,
    ]
})
export class SendInviteModule {}
