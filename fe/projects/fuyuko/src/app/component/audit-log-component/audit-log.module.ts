import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AppMaterialsModule} from "../../app-materials.module";
import {SharedComponentUtilsModule} from "../shared-component-utils/shared-component-utils.module";
import {AuditLogComponent} from "./audit-log.component";
import {FlexLayoutModule} from "@angular/flex-layout";
import {PaginationModule} from "../pagination-component/pagination.module";


@NgModule({
   imports: [
      CommonModule,
      BrowserAnimationsModule,
      FormsModule,
      ReactiveFormsModule,
      AppMaterialsModule,
      FlexLayoutModule,
      SharedComponentUtilsModule,
      PaginationModule,
   ],
   declarations: [
       AuditLogComponent,
   ],
   exports: [
       AuditLogComponent
   ]
})
export class AuditLogModule {

}