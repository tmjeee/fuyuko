import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router, Event as RouterEvent, NavigationEnd, ActivatedRouteSnapshot} from '@angular/router';
import {filter, map} from 'rxjs/operators';


@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {

  routeSideNavData: string;

  @Output()
  logoutEvent: EventEmitter<void>;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.logoutEvent = new EventEmitter();
  }

  ngOnInit(): void {
    this.routeSideNavData = this.findSideNavData([this.route.snapshot]);
    this.router.events
      .pipe(
        filter((e: RouterEvent) => e instanceof NavigationEnd),
        map((e: NavigationEnd) => {
          this.routeSideNavData = this.findSideNavData([this.route.snapshot]);
        })
      ).subscribe();
  }

  findSideNavData(r: ActivatedRouteSnapshot[]): string {
    let result: string = null;
    for (const rr of r) {
      result = rr.data.sideNav;
      if (!result) {
        result =  this.findSideNavData(rr.children);
        if (result) {
          return result;
        }
      } else {
        return result;
      }
    }
    return result;
  }

  logout($event: MouseEvent) {
    this.logoutEvent.emit(null);
  }
}
