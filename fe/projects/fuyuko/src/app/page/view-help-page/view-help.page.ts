import {Component, OnInit} from '@angular/core';
import {HelpService} from '../../service/help.service/help.service';
import {tap} from 'rxjs/operators';

const HELP_POSTFIX = `HELP_VIEW.md`;


@Component({
  templateUrl: './view-help.page.html',
  styleUrls: ['./view-help.page.scss']
})
export class ViewHelpPageComponent implements OnInit {

  help = '';

  constructor(private helpService: HelpService) {
  }

  ngOnInit(): void {
    this.helpService.getHelp(HELP_POSTFIX).pipe(tap((html: string) => {
      this.help = html;
    })).subscribe();
  }

}
