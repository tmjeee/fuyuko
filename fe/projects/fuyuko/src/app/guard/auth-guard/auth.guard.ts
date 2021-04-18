import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '../../service/auth-service/auth.service';
import {User} from '@fuyuko-common/model/user.model';
import {Injectable} from '@angular/core';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private myAuthService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const mySelf: User = this.myAuthService.myself();
    if (mySelf) {
      return true;
    } else {
      return this.router.createUrlTree(['/login-layout', 'login']);
    }
  }
}

