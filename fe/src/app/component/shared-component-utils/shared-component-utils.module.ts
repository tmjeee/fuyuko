import {NgModule} from "@angular/core";
import {SafePipe} from "../../utils/safe.pipe";


@NgModule({
   declarations: [
       SafePipe
   ],
   exports: [
       SafePipe
   ]
})
export class SharedComponentUtilsModule {

}