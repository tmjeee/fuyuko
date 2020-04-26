import {Component, OnDestroy, OnInit} from "@angular/core";
import {AbstractGenSubLayoutComponent} from "../abstract-gen-sub.layout";
import {Subscription} from "rxjs";
import {View} from "../../model/view.model";
import {AppNotificationService} from "../../service/app-notification-service/app-notification.service";
import {AuthService} from "../../service/auth-service/auth.service";
import {SettingsService} from "../../service/settings-service/settings.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ViewService} from "../../service/view-service/view.service";
import {map} from "rxjs/operators";
import {MatSelectChange} from "@angular/material/select";

@Component({
    templateUrl: './price.layout.html',
    styleUrls: ['./price.layout.scss']
})
export class PriceLayoutComponent extends AbstractGenSubLayoutComponent implements  OnInit, OnDestroy {

    constructor(notificationService: AppNotificationService,
                authService: AuthService,
                settingsService: SettingsService,
                route: ActivatedRoute, router: Router) {
        super(notificationService, authService, settingsService, route, router);
    }
}
