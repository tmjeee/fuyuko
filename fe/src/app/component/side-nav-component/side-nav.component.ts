import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AbstractSideNavComponent} from './abstract-side-nav.component';


@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent extends AbstractSideNavComponent {

  @Output()
  logoutEvent: EventEmitter<void>;

  constructor(protected route: ActivatedRoute, protected router: Router) {
    super(route, router);
    this.logoutEvent = new EventEmitter();
  }

  logout($event: MouseEvent) {
    this.logoutEvent.emit(null);
  }
}
