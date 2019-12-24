import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { AvatarService } from '../../service/avatar-service/avatar.service';
import { NotificationsService } from 'angular2-notifications';
import { ThemeService } from '../../service/theme-service/theme.service';
import { AuthService } from '../../service/auth-service/auth.service';
import { GlobalCommunicationService } from "../../service/global-communication-service/global-communication.service";
let ProfilePageComponent = class ProfilePageComponent {
    constructor(avatarService, themeService, authService, globalCommunicationService, notificationsService) {
        this.avatarService = avatarService;
        this.themeService = themeService;
        this.authService = authService;
        this.globalCommunicationService = globalCommunicationService;
        this.notificationsService = notificationsService;
    }
    ngOnInit() {
        this.allThemes = this.themeService.allThemes();
        this.avatarService.allPredefinedAvatars().pipe(tap((globalAvatars) => {
            this.allPredefinedAvatars = globalAvatars;
        })).subscribe();
        this.authService.asObservable()
            .pipe(map((myself) => {
            this.myself = myself;
            this.ready = true;
        })).subscribe();
    }
    ngOnDestroy() {
    }
    onThemeSelectionChanged(event) {
        const theme = event.value;
        this.themeService.setTheme(theme);
        this.myself.theme = theme.theme.toString();
        this.authService.saveTheme(this.myself.theme).pipe(tap((_) => {
            this.notificationsService.success('Success', 'Theme changed');
        })).subscribe();
    }
    onAvatarComponentEvent(event) {
        const avatar = event.avatar;
        const f = (r) => {
            this.globalCommunicationService.reloadAvatar();
            this.notificationsService.success('Success', `Avatar updated`);
        };
        if (avatar instanceof File) {
            this.avatarService.saveUserCustomAvatar(this.myself.id, avatar)
                .pipe(tap(f.bind(this))).subscribe();
        }
        else if (avatar) { // not falsy
            this.avatarService.saveUserAvatar(this.myself.id, avatar.name)
                .pipe(tap(f.bind(this))).subscribe();
        }
    }
    onProfileInfoEvent(event) {
        this.myself.firstName = event.firstName;
        this.myself.lastName = event.lastName;
        this.myself.email = event.email;
        this.authService
            .saveMyself(this.myself)
            .pipe(tap((_) => {
            this.notificationsService.success('Success', 'Profile information updated');
        })).subscribe();
    }
    onPasswordEvent(event) {
        this.authService
            .savePassword(this.myself, event.password)
            .pipe(tap((_) => {
            this.notificationsService.success('Success', 'Password updated');
        })).subscribe();
    }
};
ProfilePageComponent = tslib_1.__decorate([
    Component({
        templateUrl: './profile.page.html',
        styleUrls: ['./profile.page.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [AvatarService,
        ThemeService,
        AuthService,
        GlobalCommunicationService,
        NotificationsService])
], ProfilePageComponent);
export { ProfilePageComponent };
//# sourceMappingURL=profile.page.js.map