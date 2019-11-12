import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import {AvatarDialogComponent, AvatarDialogComponentData} from './avatar-dialog.component';
import {map} from 'rxjs/operators';
import {GlobalAvatar} from '../../model/avatar.model';
import {User} from '../../model/user.model';
import config from '../../../assets/config.json';

export interface AvatarComponentEvent {
  avatar: GlobalAvatar;
}


@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {

  @Input() user: User;
  @Input() width: string;
  @Input() height: string;
  @Input() editable: boolean;
  @Input() allPredefinedAvatars: GlobalAvatar[];

  @Output() events: EventEmitter<AvatarComponentEvent>;

  dialogOpened: boolean;

  constructor(private matDialog: MatDialog) {
    this.width = '45px';
    this.height = '45px';
    this.editable = false;
    this.dialogOpened = false;
    this.events = new EventEmitter();
  }

  ngOnInit(): void {
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
        map((result: GlobalAvatar) => {
          this.dialogOpened = false;
          if (result) {
              this.events.emit({ avatar: result} as AvatarComponentEvent);
          }
        })
      ).subscribe();
  }

  userAvatarUrl(userId: number): string {
    return `${config.api_host_url}/${userId}`;
  }
}
