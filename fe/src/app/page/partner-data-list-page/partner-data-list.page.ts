import {Component, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';

@Component({
    templateUrl: './partner-data-list.page.html',
    styleUrls: ['./partner-data-list.page.scss']
})
export class PartnerDataListPageComponent {

    @ViewChild('sideNav', { static: true }) sideNav: MatSidenav;


    toggleSideNav($event: MouseEvent) {
        this.sideNav.toggle();
    }
}
