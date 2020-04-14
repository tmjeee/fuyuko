import {NgModule} from "@angular/core";
import {SafePipe} from "./safe.pipe";
import {LoadIfDirective} from "./load-if.directive";


@NgModule({
   declarations: [
       SafePipe,
       LoadIfDirective,
   ],
   exports: [
       SafePipe,
       LoadIfDirective,
   ]
})
export class SharedComponentUtilsModule {

}