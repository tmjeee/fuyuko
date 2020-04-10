import {Component} from '@angular/core';
import {HelpService} from "../../service/help.service/help.service";
import {tap} from "rxjs/operators";

const HELP_POSTFIX = `HELP_PROFILE.md`;

@Component({
  templateUrl: './profile-help.page.html',
  styleUrls: ['./profile-help.page.scss']
})
export class ProfileHelpPageComponent {

  help: string = '';

  constructor(private helpService: HelpService) {
  }

  ngOnInit(): void {
    this.helpService.getHelp(HELP_POSTFIX).pipe(tap((html: string) => {
      this.help = html;
    })).subscribe();
  }
}
