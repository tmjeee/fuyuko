import {Component, OnInit} from '@angular/core';
import {HelpService} from '../../service/help.service/help.service';
import {tap} from 'rxjs/operators';


const HELP_POSTFIX = `HELP_JOBS.md`;



@Component({
    templateUrl: './jobs-help.page.html',
    styleUrls: ['./jobs-help.page.scss']
})
export class JobsHelpPageComponent implements OnInit {

    help = '';

    constructor(private helpService: HelpService) {
    }

    ngOnInit(): void {
        this.helpService.getHelp(HELP_POSTFIX).pipe(tap((html: string) => {
            this.help = html;
        })).subscribe();
    }

}
