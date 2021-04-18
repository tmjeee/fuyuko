import {Component, OnInit} from '@angular/core';
import {HelpService} from '../../service/help.service/help.service';
import {tap} from 'rxjs/operators';

const HELP_POSTFIX = `HELP_PRICING.md`;

@Component({
  templateUrl: './pricing-help.page.html',
  styleUrls: ['./pricing-help.page.scss']
})
export class PricingHelpPageComponent implements OnInit {

  help = '';

  constructor(private helpService: HelpService) {
  }

  ngOnInit(): void {
    this.helpService.getHelp(HELP_POSTFIX).pipe(tap((html: string) => {
      this.help = html;
    })).subscribe();
  }
}
