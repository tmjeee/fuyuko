import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {View} from '../../model/view.model';
import {ApiResponse} from '../../model/response.model';
import config from '../../../assets/config.json';
import {HttpClient} from '@angular/common/http';
import {catchError, tap} from "rxjs/operators";

const URL_ALL_VIEWS = `${config.api_host_url}/views`;
const URL_UPDATE_VIEW = `${config.api_host_url}/views/update`;
const URL_DELETE_VIEW = `${config.api_host_url}/views/delete`;

@Injectable()
export class ViewService {

  private subject: BehaviorSubject<View>;

  constructor(private httpClient: HttpClient) {
    this.subject = new BehaviorSubject<View>(null);
  }

  init() {
    this.getAllViews().pipe(
        tap((v: View[]) => {
            console.log('**** views', v);
            if (v && v.length > 0) {
                console.log('************** fire view', v[0]);
                this.subject.next(v[0]);
            }
        }),
        catchError((e: Error, o: any) => {
            console.error(e);
            return of(null);
        })
    ).subscribe();
  }

  asObserver(): Observable<View> {
    return this.subject.asObservable();
  }

  setCurrentView(v: View) {
    this.subject.next(v);
  }


  getAllViews(): Observable<View[]> {
      return this.httpClient.get<View[]>(URL_ALL_VIEWS);
  }

  saveViews(updatedViews: View[]): Observable<ApiResponse> {
     return this.httpClient.post<ApiResponse>(URL_UPDATE_VIEW, (updatedViews ? updatedViews : []));
  }

  deleteViews(deletedViews: View[]): Observable<ApiResponse> {
      return this.httpClient.request<ApiResponse>('delete', URL_DELETE_VIEW, { body: (deletedViews ? deletedViews : [])});
  }
}
