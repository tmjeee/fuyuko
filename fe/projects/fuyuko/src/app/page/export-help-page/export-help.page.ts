import {Component, OnInit} from '@angular/core';
import {HelpService} from '../../service/help.service/help.service';
import {tap} from 'rxjs/operators';

const HELP_POSTFIX = `HELP_EXPORT.md`;

@Component({
    templateUrl: './export-help.page.html',
    styleUrls: ['./export-help.page.scss']
})
export class ExportHelpPageComponent implements OnInit {

    help = '';

    constructor(private helpService: HelpService) {
    }

    ngOnInit(): void {
        this.helpService.getHelp(HELP_POSTFIX).pipe(tap((html: string) => {
            this.help = html;
        })).subscribe();
    }
}
