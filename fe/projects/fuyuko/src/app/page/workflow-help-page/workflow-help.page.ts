import {Component} from '@angular/core';
import {HelpService} from '../../service/help.service/help.service';
import {tap} from 'rxjs/operators';


const HELP_POSTFIX = `HELP_WORKFLOW.md`;

@Component({
   templateUrl: './workflow-help.page.html',
   styleUrls: ['./workflow-help.page.scss']
})
export class WorkflowHelpPageComponent {

   help = '';

   constructor(private helpService: HelpService) {
   }

   ngOnInit(): void {
      this.helpService.getHelp(HELP_POSTFIX).pipe(tap((html: string) => {
         this.help = html;
      })).subscribe();
   }
}
