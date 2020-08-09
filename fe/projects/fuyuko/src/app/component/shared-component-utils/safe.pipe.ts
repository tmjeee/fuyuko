import {Pipe, PipeTransform} from "@angular/core";
import {DomSanitizer} from "@angular/platform-browser";


@Pipe({
    name: 'safe',
    pure: true
})
export class SafePipe implements PipeTransform {

    constructor(private domSanitizer: DomSanitizer) {}

    transform(value: any, ...args: any[]): any {
        switch(args[0]) {
            case 'html':
                return this.domSanitizer.bypassSecurityTrustHtml(value);
            case 'style':
                return this.domSanitizer.bypassSecurityTrustStyle(value);
            case 'script':
                return this.domSanitizer.bypassSecurityTrustScript(value);
            case 'url':
                return this.domSanitizer.bypassSecurityTrustUrl(value);
            case 'resourceUrl':
                return this.domSanitizer.bypassSecurityTrustResourceUrl(value);
            default:
                throw new Error(`Invalid safe type provided ${args[0]}`);
        }
    }
}