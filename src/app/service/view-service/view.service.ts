import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {View} from '../../model/view.model';
import {User} from '../../model/user.model';
import {AuthService} from '../auth-service/auth.service';
import {map} from 'rxjs/operators';



@Injectable()
export class ViewService {

  ALL_VIEWS: View[] = [
    {id: 1, name: 'view 1', description: 'view 01'} as View,
    {id: 2, name: 'view 2', description: 'view 02'} as View,
    {id: 3, name: 'view 3', description: 'view 03'} as View,
    {id: 4, name: 'view 4', description: 'view 04'} as View,
    {id: 5, name: 'view 5', description: 'view 05'} as View,
    {id: 6, name: 'view 6', description: 'view 06'} as View,
    {id: 7, name: 'view 7', description: 'view 07'} as View,
    {id: 8, name: 'view 8', description: 'view 08'} as View,
    {id: 9, name: 'view 9', description: 'view 09'} as View,
  ];

  private subject: BehaviorSubject<View>;

  constructor(private authService: AuthService) {
    this.subject = new BehaviorSubject<View>(null);
  }

  asObserver(): Observable<View> {
    return this.subject.asObservable();
  }

  setCurrentView(v: View) {
    this.subject.next(v);
  }


  getAllViews(): Observable<View[]> {
    return of([...this.ALL_VIEWS]);
  }

  saveViews(updatedViews: View[]): Observable<View[]> {
    // todo:
    if (updatedViews) {
      this.ALL_VIEWS = this.ALL_VIEWS.map((v: View) => {
          const updated: View = updatedViews.find((vv: View) => vv.id === v.id);
          if (updated) {
            return updated;
          }
          return v;
      });
    }
    return of([...this.ALL_VIEWS]);
  }

  deleteViews(deletedViews: View[]): Observable<View[]> {
    // todo:
    if (deletedViews) {
      this.ALL_VIEWS = this.ALL_VIEWS.filter((v: View) => {
          const deleted: View = deletedViews.find((vv: View) => vv.id === v.id);
          return !!!deleted;
      });
    }
    return of([...this.ALL_VIEWS]);
  }
}
