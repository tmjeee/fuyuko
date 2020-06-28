import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Pagination} from "../../utils/pagination.utils";
import {PageEvent} from "@angular/material/paginator";

export interface PaginationComponentEvent {
   pageEvent: PageEvent;

}

@Component({
   selector: 'app-pagination',
   templateUrl: './pagination.component.html',
   styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {

   @Input() pagination: Pagination;
   @Output() events: EventEmitter<PaginationComponentEvent>

   constructor() {
       this.events = new EventEmitter<PaginationComponentEvent>();
   }

   onPaginatorEvent($event: PageEvent) {
      this.events.emit({
         pageEvent: $event
      });
   }
}
