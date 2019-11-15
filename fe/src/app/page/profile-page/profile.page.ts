import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {GlobalAvatar, UserAvatarResponse} from '../../model/avatar.model';
import {AvatarService} from '../../service/avatar-service/avatar.service';
import {AvatarComponentEvent} from '../../component/avatar-component/avatar.component';
import {NotificationsService} from 'angular2-notifications';
import {Theme, ThemeService} from '../../service/theme-service/theme.service';
import { MatSelectChange } from '@angular/material/select';
import {ProfileInfoComponentEvent} from '../../component/profile-info-component/profile-info.component';
import {PasswordComponentEvent} from '../../component/password-component/password.component';
import {AuthService} from '../../service/auth-service/auth.service';
import {User} from '../../model/user.model';
import {GlobalCommunicationService} from "../../service/global-communication-service/global-communication.service";


@Component({
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePageComponent implements OnInit, OnDestroy {

  ready: boolean;
  allPredefinedAvatars: GlobalAvatar[];
  myself: User;
  allThemes: Theme[];

  constructor(private avatarService: AvatarService,
              private themeService: ThemeService,
              private authService: AuthService,
              private globalCommunicationService: GlobalCommunicationService,
              private notificationsService: NotificationsService) {
  }

  ngOnInit(): void {
    this.allThemes = this.themeService.allThemes();
    this.avatarService.allPredefinedAvatars().pipe(
        tap((globalAvatars: GlobalAvatar[]) => {
            this.allPredefinedAvatars = globalAvatars;
        })
    ).subscribe();
    this.authService.asObservable()
      .pipe(
        map((myself: User) => {
          this.myself = myself;
          this.ready = true;
        })
      ).subscribe();
  }

  ngOnDestroy(): void {
  }

  onThemeSelectionChanged(event: MatSelectChange) {
    const theme: Theme = event.value as Theme;
    this.themeService.setTheme(theme);
    this.myself.theme = theme.theme.toString();
    this.authService.saveTheme(this.myself.theme).pipe(
        tap((_) => {
            this.notificationsService.success('Success', 'Theme changed');
        })
    ).subscribe();
  }

  onAvatarComponentEvent(event: AvatarComponentEvent) {
    const avatar: GlobalAvatar | File = event.avatar;
    const f = (r: UserAvatarResponse) => {
      this.globalCommunicationService.reloadAvatar();
      this.notificationsService.success('Success', `Avatar updated`);
    };
    if (avatar instanceof File) {
      this.avatarService.saveUserCustomAvatar(avatar)
          .pipe( tap(f.bind(this))).subscribe();
    } else if (avatar) { // not falsy
      this.avatarService.saveUserAvatar(avatar.name)
          .pipe(tap(f.bind(this))).subscribe();
    }
  }

  onProfileInfoEvent(event: ProfileInfoComponentEvent) {
    this.myself.firstName = event.firstName;
    this.myself.lastName = event.lastName;
    this.myself.email = event.email;
    this.authService
        .saveMyself(this.myself)
        .pipe(
            tap((_) => {
              this.notificationsService.success('Success', 'Profile information updated');
            })
        ).subscribe();
  }

  onPasswordEvent(event: PasswordComponentEvent) {
    this.authService
        .savePassword(this.myself, event.password)
        .pipe(
            tap((_) => {
              this.notificationsService.success('Success', 'Password updated');
            })
        ).subscribe();
  }
}
