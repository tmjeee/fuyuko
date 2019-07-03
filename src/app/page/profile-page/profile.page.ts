import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {Avatar} from '../../model/avatar.model';
import {AvatarService} from '../../service/avatar-service/avatar.service';
import {AvatarComponentEvent} from '../../component/avatar-component/avatar.component';
import {NotificationsService} from 'angular2-notifications';
import {Theme, ThemeService} from '../../service/theme-service/theme.service';
import {MatSelectChange} from '@angular/material';
import {ProfileInfoComponentEvent} from '../../component/profile-info-component/profile-info.component';
import {PasswordComponentEvent} from '../../component/password-component/password.component';
import {AuthService} from '../../service/auth-service/auth.service';
import {User} from '../../model/user.model';


@Component({
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePageComponent implements OnInit, OnDestroy {

  ready: boolean;
  allPredefinedAvatars: Avatar[];
  myself: User;
  allThemes: Theme[];

  constructor(private avatarService: AvatarService,
              private themeService: ThemeService,
              private authService: AuthService,
              private notificationsService: NotificationsService) {}

  ngOnInit(): void {
    this.allThemes = this.themeService.allThemes();
    this.allPredefinedAvatars = this.avatarService.allPredefinedAvatars();
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
    this.authService.saveMyself(this.myself);
    this.notificationsService.success('Success', 'Theme changed');
  }

  onAvatarComponentEvent(event: AvatarComponentEvent) {
    this.myself.avatarUrl = event.avatar.url;
    this.authService.saveMyself(this.myself);
    this.notificationsService.success('Success', 'Avatar updated');
  }

  onProfileInfoEvent(event: ProfileInfoComponentEvent) {
    this.myself.firstName = event.firstName;
    this.myself.lastName = event.lastName;
    this.myself.email = event.email;
    this.myself.username = event.username;
    this.authService.saveMyself(this.myself);
    this.notificationsService.success('Success', 'Profile information updated');
  }

  onPasswordEvent(event: PasswordComponentEvent) {
    this.authService.savePassword(this.myself, event.password);
    this.notificationsService.success('Success', 'Password updated');
  }
}
