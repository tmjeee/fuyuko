import {Component, Input} from '@angular/core';

/**
 * Usage:
 *
 * <app-static-notice [level]="'INFO'">
 *    <div title>....</div>
 *    <div content>...</div>
 * </app-static-notice>
 */

@Component({
    selector: 'app-static-notice',
    templateUrl: './static-notice.component.html',
    styleUrls: ['./static-notice.component.scss']
})
export class StaticNoticeComponent {

   @Input() level!: 'INFO' | 'SUCCESS' | 'WARN' | 'ERROR';


}
