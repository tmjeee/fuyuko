import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {DashboardLayoutComponent} from './dashboard.layout';
import {AppMaterialsModule} from '../../app-materials.module';
import {AvatarComponent} from '../../component/avatar-component/avatar.component';
import {NotificationComponent} from '../../component/notification-component/notification.component';
import {SideNavComponent} from '../../component/side-nav-component/side-nav.component';
import {RouterModule} from '@angular/router';
import {AppNotificationService} from '../../service/app-notification-service/app-notification.service';
import {AuthService} from '../../service/auth-service/auth.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ThemeService} from '../../service/theme-service/theme.service';
import {SettingsService} from '../../service/settings-service/settings.service';
import {RouterTestingModule} from '@angular/router/testing';
import {GlobalCommunicationService} from '../../service/global-communication-service/global-communication.service';
import {BrowserLocationHistoryService} from '../../service/browser-location-history-service/browser-location-history.service';
import {of} from "rxjs";
import {LoadingService} from "../../service/loading-service/loading.service";


describe('DashboardLayoutComponent', () => {

    let fixture: ComponentFixture<DashboardLayoutComponent>;
    let component: DashboardLayoutComponent;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [AppMaterialsModule, RouterTestingModule, HttpClientTestingModule],
            declarations: [DashboardLayoutComponent, AvatarComponent, NotificationComponent, SideNavComponent],
            providers: [AppNotificationService, AuthService, ThemeService, SettingsService,
                GlobalCommunicationService, BrowserLocationHistoryService, LoadingService]
        }).compileComponents();
    }));

    beforeEach(() => {
        spyOn(SettingsService.prototype, 'getSettings').and.returnValue(of([]));
        fixture = TestBed.createComponent(DashboardLayoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeDefined();
    });

});
