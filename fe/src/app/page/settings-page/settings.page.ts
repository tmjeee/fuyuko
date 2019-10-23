import {Component, OnInit} from '@angular/core';
import {User} from '../../model/user.model';
import {Settings} from '../../model/settings.model';
import {SettingsComponentEvent} from '../../component/settings-component/settings.component';
import {AuthService} from '../../service/auth-service/auth.service';
import {SettingsService} from '../../service/settings-service/settings.service';
import {tap} from 'rxjs/operators';
import {NotificationsService} from 'angular2-notifications';


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
              private settingsService: SettingsService) {
  }

  ngOnInit(): void {
    this.reload();
  }

  reload() {
    this.ready = false;
    this.currentUser = this.authService.myself();
    this.settingsService.getSettings(this.currentUser)
        .pipe(
            tap((s: Settings) => {
              this.settings = s;
              this.ready = true;
            })
        ).subscribe();
  }

  onSettingsEvent($event: SettingsComponentEvent) {
    this.settingsService.saveSettings($event.settings)
        .pipe(
            tap((s: Settings) => {
                this.settings = s;
                this.notificationService.info('Saved', 'Settings changes save');
            })
        ).subscribe();
  }
}
