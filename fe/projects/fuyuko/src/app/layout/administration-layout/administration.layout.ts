import {Component} from '@angular/core';
import {AbstractGenSubLayoutComponent} from '../abstract-gen-sub.layout';
import {AppNotificationService} from '../../service/app-notification-service/app-notification.service';
import {AuthService} from '../../service/auth-service/auth.service';
import {SettingsService} from '../../service/settings-service/settings.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LoadingService} from '../../service/loading-service/loading.service';

@Component({
    templateUrl: './administration.layout.html',
    styleUrls: ['./administration.layout.scss']
})
export class AdministrationLayoutComponent extends AbstractGenSubLayoutComponent {

    constructor(notificationService: AppNotificationService,
                authService: AuthService,
                settingsService: SettingsService,
                route: ActivatedRoute,
                router: Router,
                loadingService: LoadingService) {
        super(notificationService, authService, settingsService, route, router, loadingService);
    }

}
