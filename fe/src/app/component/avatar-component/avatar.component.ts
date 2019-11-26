import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import {AvatarDialogComponent, AvatarDialogComponentData} from './avatar-dialog.component';
import {map, tap} from 'rxjs/operators';
import {GlobalAvatar} from '../../model/avatar.model';
import {User} from '../../model/user.model';
import config from '../../../assets/config.json';
import {GlobalCommunicationService} from '../../service/global-communication-service/global-communication.service';
import {Subscription} from 'rxjs';

export interface AvatarComponentEvent {
  avatar: GlobalAvatar | File;
}

const URL_USER_AVATAR = `${config.api_host_url}/user/:userId/avatar`;

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit, OnDestroy {

  @Input() user: User;
  @Input() width: string;
  @Input() height: string;
  @Input() editable: boolean;
  @Input() allPredefinedAvatars: GlobalAvatar[];

  @Output() events: EventEmitter<AvatarComponentEvent>;

  dialogOpened: boolean;
  d: number;

  subscription: Subscription;

  constructor(private matDialog: MatDialog,
              private globalCommunicationService: GlobalCommunicationService) {
    this.width = '45px';
    this.height = '45px';
    this.editable = false;
    this.dialogOpened = false;
    this.events = new EventEmitter();
    this.d = Math.random();
  }

  ngOnInit(): void {
      this.subscription = this.globalCommunicationService
          .avatarReloadObservable()
          .pipe(
              tap((_) => {
                  this.reload();
              })
          ).subscribe();
  }

  ngOnDestroy(): void {
      this.subscription.unsubscribe();
  }

  reload() {
      this.d = Math.random();
  }

  onEditClicked(event: Event) {
    if (this.dialogOpened) {
      return;
    }
    const matDialogRef: MatDialogRef<AvatarDialogComponent> = this.matDialog.open(AvatarDialogComponent,
      {
        data: {
          user: this.user,
          allPredefinedAvatars: this.allPredefinedAvatars
        } as AvatarDialogComponentData
      } as MatDialogConfig);
    matDialogRef.afterOpened()
      .pipe(
        map((r: void) => {
          this.dialogOpened = true;
        })
      ).subscribe();
    matDialogRef.afterClosed()
      .pipe(
        map((result: GlobalAvatar | File) => {
          this.dialogOpened = false;
          if (result) {
              this.events.emit({ avatar: result} as AvatarComponentEvent);
          }
        })
      ).subscribe();
  }

  userAvatarUrl(userId: number): string {
      return URL_USER_AVATAR.replace(':userId', `${userId}`).concat(`?=${this.d}`);
  }

}
