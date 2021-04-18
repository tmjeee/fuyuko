import {Component, OnInit} from '@angular/core';
import {User} from '@fuyuko-common/model/user.model';
import {Settings} from '@fuyuko-common/model/settings.model';
import {SettingsComponentEvent} from '../../component/settings-component/settings.component';
import {AuthService} from '../../service/auth-service/auth.service';
import {SettingsService} from '../../service/settings-service/settings.service';
import {finalize, tap} from 'rxjs/operators';
import {NotificationsService} from 'angular2-notifications';
import {LoadingService} from '../../service/loading-service/loading.service';


@Component({
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss']
})
export class SettingsPageComponent implements OnInit {

  currentUser: User;

  ready: boolean;
  settings: Settings;

  constructor(private authService: AuthService,
              private notificationService: NotificationsService,
              private settingsService: SettingsService,
              private loadingService: LoadingService) {
  }

  ngOnInit(): void {
    this.reload();
  }

  reload() {
    this.ready = false;
    this.loadingService.startLoading();
    this.currentUser = this.authService.myself();
    this.settingsService.getSettings(this.currentUser)
        .pipe(
            tap((s: Settings) => {
              this.settings = s;
              this.ready = true;
            }),
            finalize(() => {
                this.ready = true;
                this.loadingService.stopLoading();
            })
        ).subscribe();
  }

  onSettingsEvent($event: SettingsComponentEvent) {
    this.settingsService.saveSettings(this.currentUser, $event.settings)
        .pipe(
            tap((s: Settings) => {
                this.settings = s;
                this.notificationService.success('Saved', 'Settings changes save');
            })
        ).subscribe();
  }
}
