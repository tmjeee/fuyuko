import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Forum} from '../../model/forum.model';
import * as moment from 'moment';

export interface ForumListingsComponentEvent {
   forumId: number;
};

@Component({
   selector: 'app-forums-listings',
   templateUrl: './forums-listings.component.html',
   styleUrls: ['./forums-listings.component.scss']
})
export class ForumsListingsComponent {

   @Input() forums: Forum[];
   @Output() events: EventEmitter<ForumListingsComponentEvent>;

   constructor() {
      this.events = new EventEmitter<ForumListingsComponentEvent>();
   }


   formatDate(d: Date): string {
      return moment(d).format('DD/MM/YYYY hh:mm:ss a');
   }

   onViewFormDetails($event: MouseEvent, forum: Forum) {
      $event.preventDefault();
      $event.stopImmediatePropagation();
      this.events.emit({
         forumId: forum.id
      } as ForumListingsComponentEvent);

   }
}
