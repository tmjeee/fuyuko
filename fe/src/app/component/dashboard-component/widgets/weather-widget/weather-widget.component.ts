import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {DashboardWidget, DashboardWidgetInfo} from '../../../../model/dashboard.model';
import {DashboardWidgetService} from '../../../../service/dashboard-service/dashboard-widget.service';
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {MatSelectChange} from "@angular/material/select";
import uuid from "uuid";
import {AuthService} from "../../../../service/auth-service/auth.service";

export interface Location {
    displayName: string;
    internalName: string;
    internalUrl: string
}

/**
 * weather widget
 * https://weatherwidget.io/
 */

@Component({
    templateUrl: './weather-widget.component.html',
    styleUrls: ['./weather-widget.component.scss']
})
export class WeatherWidgetComponent extends DashboardWidget implements OnInit, OnDestroy, AfterViewInit {

    readonly locations: Location[] = [
        {
            displayName: 'Sydney, Australia',
            internalName: 'SYDNEY',
            internalUrl: 'https://forecast7.com/en/n33d87151d21/sydney/'
        },
        {
            displayName: 'Perth, Australia',
            internalName: 'PERTH',
            internalUrl: 'https://forecast7.com/en/n31d95115d86/perth/'
        },
        {
            displayName: 'Kuching, Malaysia',
            internalName: 'KUCHING',
            internalUrl: 'https://forecast7.com/en/1d61110d38/kuching/'
        },
        {
            displayName: 'Kuala Lumpur, Malaysia',
            internalName: 'KUALA LUMPUR',
            internalUrl: 'https://forecast7.com/en/3d16101d71/federal-territory-of-kuala-lumpur/'
        },
        {
            displayName: 'Los Angelas, America',
            internalName: 'LOS ANGELAS',
            internalUrl: 'https://forecast7.com/en/34d05n118d24/los-angeles/'
        }
    ];

    currentLocation: Location;

    id = WeatherWidgetComponent.info().id;
    name = WeatherWidgetComponent.info().name;

    uid = `${uuid()}-weatherwidget-io-js`;

    static info(): DashboardWidgetInfo {
        return { id: 'weather-widget', name: 'weather-widget', type: WeatherWidgetComponent };
    }

    constructor(dashboardWidgetService: DashboardWidgetService,
                private domSanitizer: DomSanitizer) {
        super(dashboardWidgetService);
    }

    sanitizeUrl(url: string): SafeUrl {
        return this.domSanitizer.bypassSecurityTrustUrl(url);
    }

    ngOnInit(): void {
        this.currentLocation = this.locations[0];
    }

    ngAfterViewInit(): void {
        this.f(document, 'script', this.uid);
    }

    ngOnDestroy(): void {
    }

    f(d, s, id) {
        let js, fjs = d.getElementsByTagName(s)[0];
        js = d.createElement(s);
        js.id = id;
        js.src = 'https://weatherwidget.io/js/widget.min.js';
        fjs.parentNode.insertBefore(js, fjs);
    }

    onLocationChange($event: MatSelectChange) {
        const location: Location = $event.source.value;
        this.currentLocation = location;
        this.f(document, 'script', this.uid);
    }
}
