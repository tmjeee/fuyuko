import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppMaterialsModule} from '../../app-materials.module';
import {SideNavComponent} from './side-nav.component';
import {PartnerSideNavComponent} from './partner-side-nav.component';
import {RouterModule} from '@angular/router';
import {SharedComponentUtilsModule} from '../shared-component-utils/shared-component-utils.module';


@NgModule({
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        AppMaterialsModule,
        RouterModule,
        SharedComponentUtilsModule,
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
