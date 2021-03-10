import {Component, OnInit} from '@angular/core';
import {HelpService} from '../../service/help.service/help.service';
import {tap} from 'rxjs/operators';

const HELP_POSTFIX = `HELP_SETTINGS.md`;

@Component({
  templateUrl: './settings-help.page.html',
  styleUrls: ['./settings-help.page.scss']
})
export class SettingsHelpPageComponent implements OnInit {

  help = '';

  constructor(private helpService: HelpService) {
  }

  ngOnInit(): void {
    this.helpService.getHelp(HELP_POSTFIX).pipe(tap((html: string) => {
      this.help = html;
    })).subscribe();
  }
}
