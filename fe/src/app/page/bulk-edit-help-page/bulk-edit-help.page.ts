import {Component} from '@angular/core';
import {HelpService} from "../../service/help.service/help.service";
import {tap} from "rxjs/operators";

const HELP_POSTFIX = `HELP_BULK_EDIT.md`;

@Component({
  templateUrl: './bulk-edit-help.page.html',
  styleUrls: ['./bulk-edit-help.page.scss']
})
export class BulkEditHelpPageComponent {

  help: string = '';

  constructor(private helpService: HelpService) {
  }

  ngOnInit(): void {
    this.helpService.getHelp(HELP_POSTFIX).pipe(tap((html: string) => {
      this.help = html;
    })).subscribe();
  }
}
