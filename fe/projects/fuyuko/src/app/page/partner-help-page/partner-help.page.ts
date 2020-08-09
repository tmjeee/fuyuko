import {Component, OnInit} from '@angular/core';
import {HelpService} from "../../service/help.service/help.service";
import {tap} from "rxjs/operators";

const HELP_POSTFIX = `HELP_PARTNER.md`;

@Component({
    templateUrl: './partner-help.page.html',
    styleUrls: ['./partner-help.page.scss']
})
export class PartnerHelpPageComponent implements OnInit {

    help: string = '';

    constructor(private helpService: HelpService) {
    }

    ngOnInit(): void {
        this.helpService.getHelp(HELP_POSTFIX).pipe(tap((html: string) => {
            this.help = html;
        })).subscribe();
    }
}
