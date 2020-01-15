import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppMaterialsModule} from '../../app-materials.module';
import {SideNavComponent} from './side-nav.component';
import {PartnerSideNavComponent} from './partner-side-nav.component';
import {RouterModule} from '@angular/router';


@NgModule({
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        AppMaterialsModule,
        RouterModule,
    ],
    declarations: [
        SideNavComponent,
        PartnerSideNavComponent,
    ],
    exports: [
        SideNavComponent,
        PartnerSideNavComponent,
    ]
})
export class SideNavModule {}
