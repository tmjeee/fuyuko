import {Component, EventEmitter, Input, Output} from '@angular/core';
import {View} from '@fuyuko-common/model/view.model';
import {NotificationsService} from 'angular2-notifications';
import {ValidationService} from '../../service/validation-service/validation.service';
import {MatDialog} from '@angular/material/dialog';
import {ValidationCreationDialogComponent} from './validation-creation-dialog.component';
import {tap} from 'rxjs/operators';

export interface ValidationRunComponentEvent {
   name: string;
   description: string;
}


@Component({
   selector: 'app-validation-run',
   templateUrl: './validation-run.component.html',
   styleUrls: ['./validation-run.component.scss']
})
export class ValidationRunComponent {

   @Input() view!: View;
   @Output() events: EventEmitter<ValidationRunComponentEvent>;

   constructor(private notificationsService: NotificationsService,
               private validationService: ValidationService,
               private matDialog: MatDialog) {
      this.events = new EventEmitter<ValidationRunComponentEvent>();
   }


   runValidation($event: MouseEvent) {
      if (!this.view) {
         this.notificationsService.warn(`No active view`, `No active view to run validation on!`);
         return;
      }

      this.matDialog.open<ValidationCreationDialogComponent, any, {name: string, description: string}>(
          ValidationCreationDialogComponent, {
            width: `90vw`,
            height: `90vh`,
            data: {}
      }).afterClosed().pipe(
          tap((r: {name: string, description: string} | undefined) => {
              if (r) { // not cancelled
               this.events.emit({
                  name: r.name,
                  description: r.description
               });
              }
          })
      ).subscribe();
   }

}
