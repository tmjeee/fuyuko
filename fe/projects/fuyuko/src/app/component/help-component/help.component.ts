import {Component, Input} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
    selector: 'app-help',
    templateUrl: './help.component.html',
    styleUrls: ['./help.component.scss']
})
export class HelpComponent {

    @Input() help: string;

    constructor(private domSanitizer: DomSanitizer) {
    }


    sanitize(text: string) {
       return this.domSanitizer.bypassSecurityTrustHtml(text);
    }
}
