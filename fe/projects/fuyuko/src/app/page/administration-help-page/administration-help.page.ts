import {Component} from '@angular/core';
import {HelpService} from '../../service/help.service/help.service';
import {tap} from 'rxjs/operators';


const HELP_POSTFIX = `HELP_ADMINISTRATION.md`;

@Component({
   templateUrl: './administration-help.page.html',
   styleUrls: ['./administration-help.page.scss']
})
export class AdministrationHelpPageComponent {

   help = '';

   constructor(private helpService: HelpService) {
   }

   ngOnInit(): void {
      this.helpService.getHelp(HELP_POSTFIX).pipe(tap((html: string) => {
         this.help = html;
      })).subscribe();
   }
}
