import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppMaterialsModule} from '../../app-materials.module';
import {JobsListingsComponent} from './jobs-listings.component';
import {JobDetailsComponent} from './job-details.component';


@NgModule({
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        AppMaterialsModule
    ],
    declarations: [
        JobsListingsComponent,
        JobDetailsComponent
    ],
    exports: [
        JobsListingsComponent,
        JobDetailsComponent
    ]
})
export class JobsModule {

}
