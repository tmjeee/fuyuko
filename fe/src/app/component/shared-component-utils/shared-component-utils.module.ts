import {NgModule} from "@angular/core";
import {SafePipe} from "./safe.pipe";
import {LoadIfDirective} from "./load-if.directive";
import {LoadingComponent} from "./loading-component/loading.component";


@NgModule({
   declarations: [
       SafePipe,
       LoadIfDirective,
       LoadingComponent,
   ],
   exports: [
       SafePipe,
       LoadIfDirective,
       LoadingComponent,
   ]
})
export class SharedComponentUtilsModule {

}