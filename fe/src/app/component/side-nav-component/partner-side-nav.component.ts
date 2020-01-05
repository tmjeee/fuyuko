import {Component, EventEmitter, Output} from '@angular/core';
import {AbstractSideNavComponent} from './abstract-side-nav.component';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-partner-side-nav',
    templateUrl: './partner-side-nav.component.html',
    styleUrls: ['./partner-side-nav.component.scss']
})
export class PartnerSideNavComponent extends  AbstractSideNavComponent {
    @Output()
    logoutEvent: EventEmitter<void>;


    constructor(protected route: ActivatedRoute, protected router: Router) {
        super(route, router);
        this.logoutEvent = new EventEmitter<void>();
    }

    logout($event: MouseEvent) {
        this.logoutEvent.emit(null);
    }
}
