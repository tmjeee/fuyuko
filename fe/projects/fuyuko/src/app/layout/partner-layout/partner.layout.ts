import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractGenLayoutComponent} from '../abstract-gen.layout';
import {AppNotificationService} from '../../service/app-notification-service/app-notification.service';
import {AuthService} from '../../service/auth-service/auth.service';
import {SettingsService} from '../../service/settings-service/settings.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LoadingService} from '../../service/loading-service/loading.service';

@Component({
    templateUrl: './partner.layout.html',
    styleUrls: ['./partner.layout.scss']
})
export class PartnerLayoutComponent extends AbstractGenLayoutComponent implements OnInit, OnDestroy {

    constructor(notificationService: AppNotificationService,
                authService: AuthService,
                settingsService: SettingsService,
                router: Router,
                route: ActivatedRoute,
                loadingService: LoadingService) {
        super(notificationService, authService, settingsService, router, route, loadingService);
    }
}
