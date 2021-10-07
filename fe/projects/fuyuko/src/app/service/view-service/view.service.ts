import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {View} from '@fuyuko-common/model/view.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import config from '../../utils/config.util';
import {HttpClient} from '@angular/common/http';
import {catchError, map, tap} from 'rxjs/operators';
import {assertDefinedReturn} from '../../utils/common.util';

const URL_ALL_VIEWS = () => `${config().api_host_url}/views`;
const URL_UPDATE_VIEW = () => `${config().api_host_url}/views/update`;
const URL_DELETE_VIEW = () => `${config().api_host_url}/views/delete`;
const URL_GET_VIEW_BY_ID = () => `${config().api_host_url}/view/:viewId`;

@Injectable()
export class ViewService {

  private subject: BehaviorSubject<View | undefined>;

  constructor(private httpClient: HttpClient) {
    this.subject = new BehaviorSubject<View | undefined>(undefined);
  }

  init() {
    this.getAllViews().pipe(
        tap((v: View[]) => {
            if (v && v.length > 0) {
                this.subject.next(v[0]);
            }
        }),
        catchError((e: Error, o: any) => {
            console.error(e);
            return of(null);
        })
    ).subscribe();
  }

  destroy() {
  }

  asObserver(): Observable<View | undefined> {
    return this.subject.asObservable();
  }

  setCurrentView(v: View) {
    this.subject.next(v);
  }


  getAllViews(): Observable<View[]> {
      return this.httpClient
          .get<ApiResponse<View[]>>(URL_ALL_VIEWS())
          .pipe(
              map((r: ApiResponse<View[]>) => assertDefinedReturn(r.payload))
          );
  }

  saveViews(updatedViews: View[]): Observable<ApiResponse> {
     return this.httpClient.post<ApiResponse>(URL_UPDATE_VIEW(), (updatedViews ? updatedViews : []));
  }

  deleteViews(deletedViews: View[]): Observable<ApiResponse> {
      return this.httpClient.request<ApiResponse>('delete', URL_DELETE_VIEW(), { body: (deletedViews ? deletedViews : [])});
  }

  getViewById(viewId: string) {
    return this.httpClient
        .get<ApiResponse<View>>(URL_GET_VIEW_BY_ID().replace(':viewId', viewId))
        .pipe(
            map((r: ApiResponse<View>) => r.payload)
        );
  }
}
