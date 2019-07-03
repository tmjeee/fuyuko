import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material';
import {AvatarDialogComponent, AvatarDialogComponentData} from './avatar-dialog.component';
import {map} from 'rxjs/operators';
import {Avatar} from '../../model/avatar.model';
import {User} from '../../model/user.model';

export interface AvatarComponentEvent {
  avatar: Avatar;
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
  @Input() allPredefinedAvatars: Avatar[];

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
        map((result: Avatar) => {
          this.dialogOpened = false;
          this.events.emit({ avatar: result} as AvatarComponentEvent);
        })
      ).subscribe();
  }

}
