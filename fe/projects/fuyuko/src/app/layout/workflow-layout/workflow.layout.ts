import {Component, OnDestroy, OnInit} from "@angular/core";
import {AbstractGenSubLayoutComponent} from "../abstract-gen-sub.layout";
import {AppNotificationService} from "../../service/app-notification-service/app-notification.service";
import {AuthService} from "../../service/auth-service/auth.service";
import {SettingsService} from "../../service/settings-service/settings.service";
import {ActivatedRoute, Router} from "@angular/router";
import {LoadingService} from "../../service/loading-service/loading.service";

@Component({
    templateUrl: './workflow.layout.html',
    styleUrls: ['./workflow.layout.scss']
})
export class WorkflowLayoutComponent extends AbstractGenSubLayoutComponent {
    
    constructor(notificationService: AppNotificationService,
                authService: AuthService,
                settingsService: SettingsService,
                router: Router,
                route: ActivatedRoute,
                loadingService: LoadingService) {
        super(notificationService, authService, settingsService, route, router, loadingService);
    }
}
