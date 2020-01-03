import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppMaterialsModule} from '../../app-materials.module';
import {ProfileInfoComponent} from './profile-info.component';
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
        ProfileInfoComponent
    ],
    exports: [
        ProfileInfoComponent
    ]
})
export class ProfileModule {

}
