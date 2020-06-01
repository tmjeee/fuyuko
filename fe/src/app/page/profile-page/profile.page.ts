import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {finalize, map, tap} from 'rxjs/operators';
import {GlobalAvatar} from '../../model/avatar.model';
import {AvatarService} from '../../service/avatar-service/avatar.service';
import {AvatarComponentEvent} from '../../component/avatar-component/avatar.component';
import {NotificationsService} from 'angular2-notifications';
import {Theme, ThemeService} from '../../service/theme-service/theme.service';
import { MatSelectChange } from '@angular/material/select';
import {ProfileInfoComponentEvent} from '../../component/profile-info-component/profile-info.component';
import {PasswordComponentEvent} from '../../component/password-component/password.component';
import {AuthService} from '../../service/auth-service/auth.service';
import {User} from '../../model/user.model';
import {GlobalCommunicationService} from '../../service/global-communication-service/global-communication.service';
import {FormBuilder, FormControl} from '@angular/forms';
import {UserAvatarResponse} from "../../model/api-response.model";
import {toNotifications} from "../../service/common.service";


@Component({
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePageComponent implements OnInit, OnDestroy {

  ready: boolean;
  avatarsReady: boolean;
  allPredefinedAvatars: GlobalAvatar[];
  myself: User;
  allThemes: Theme[];

  formControlTheme: FormControl;

  private subscription: Subscription;

  constructor(private avatarService: AvatarService,
              private themeService: ThemeService,
              private authService: AuthService,
              private globalCommunicationService: GlobalCommunicationService,
              private formBuilder: FormBuilder,
              private notificationsService: NotificationsService) {
      this.formControlTheme =  formBuilder.control('');
  }

  ngOnInit(): void {
    this.allThemes = this.themeService.allThemes();
    this.avatarService.allPredefinedAvatars().pipe(
        tap((globalAvatars: GlobalAvatar[]) => {
            this.allPredefinedAvatars = globalAvatars;
            this.avatarsReady = true;
        }),
        finalize(() => this.avatarsReady = true)
    ).subscribe();
    this.subscription = this.authService.asObservable()
      .pipe(
        map((myself: User) => {
          this.myself = myself;

          if (this.myself) { // myself can be null after logged out callback
              // @ts-ignore
              // tslint:disable-next-line:triple-equals
              const theme: Theme = this.allThemes.find((t: Theme) => t.theme as string == this.myself.theme);
              this.formControlTheme.setValue(theme);
          }
          this.ready = true;
        }),
        finalize(() => this.ready = true)
      ).subscribe();
  }

  ngOnDestroy(): void {
      if (this.subscription) {
          this.subscription.unsubscribe();
      }
  }

  onThemeSelectionChanged(event: MatSelectChange) {
    const theme: Theme = event.value as Theme;
    this.themeService.setTheme(theme);
    this.myself.theme = theme.theme.toString();
    this.formControlTheme.setValue(theme);
    this.authService.saveTheme(this.myself, this.myself.theme).pipe(
        tap((_: User) => {
            this.notificationsService.success('Success', 'Theme changed');
        })
    ).subscribe();
  }

  onAvatarComponentEvent(event: AvatarComponentEvent) {
    const avatar: GlobalAvatar | File = event.avatar;
    const f = (r: UserAvatarResponse) => {
      this.globalCommunicationService.reloadAvatar();
      toNotifications(this.notificationsService, r);
    };
    if (avatar instanceof File) {
      this.avatarService.saveUserCustomAvatar(this.myself.id, avatar)
          .pipe( tap(f.bind(this) as (r: UserAvatarResponse) => void)).subscribe();
    } else if (avatar) { // not falsy
      this.avatarService.saveUserAvatar(this.myself.id, avatar.name)
          .pipe(tap(f.bind(this) as (r: UserAvatarResponse) => void)).subscribe();
    }
  }

  onProfileInfoEvent(event: ProfileInfoComponentEvent) {
    this.myself.firstName = event.firstName;
    this.myself.lastName = event.lastName;
    this.myself.email = event.email;
    this.authService
        .saveMyself(this.myself)
        .pipe(
            tap((_: User) => {
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
