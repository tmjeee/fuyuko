import {HelpService} from "../../service/help.service/help.service";
import {tap} from "rxjs/operators";
import {Component} from "@angular/core";

const HELP_POSTFIX = `HELP_CATEGORY.md`;

@Component({
   templateUrl: './category-help.page.html',
   styleUrls: ['./category-help.page.scss']
})
export class CategoryHelpPageComponent {

    help: string = '';

    constructor(private helpService: HelpService) {
    }

    ngOnInit(): void {
        this.helpService.getHelp(HELP_POSTFIX).pipe(tap((html: string) => {
            this.help = html;
        })).subscribe();
    }
}