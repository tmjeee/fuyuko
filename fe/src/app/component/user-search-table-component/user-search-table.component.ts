import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from '../../model/user.model';
import {UserSearchFn} from '../user-table-component/user-table.component';
import {DataSource} from '@angular/cdk/table';
import {CollectionViewer} from '@angular/cdk/collections';
import {BehaviorSubject, Observable} from 'rxjs';
import {FormBuilder, FormControl} from '@angular/forms';
import {map} from 'rxjs/operators';

export type UserSearchFn = (user: string) => Observable<User[]>;


export interface UserSearchTableComponentEvent {
  type: string;
  user?: User;
}

class UserSearchTableDataSource implements DataSource<User> {

  subject: BehaviorSubject<User[]> = new BehaviorSubject([]);

  update(users: User[]) {
    this.subject.next(users);
  }

  connect(collectionViewer: CollectionViewer): Observable<User[] | ReadonlyArray<User>> {
    return this.subject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.subject.complete();
  }
}


export interface ActionType {
  type: string;
  icon: string;
  tooltip: string;
}

@Component({
  selector: 'app-user-search-table',
  templateUrl: './user-search-table.component.html',
  styleUrls: ['./user-search-table.component.scss']
})
export class UserSearchTableComponent implements OnInit {

  @Input() searchFieldPlaceholder: string;
  @Input() searchFieldLabel: string;
  @Input() searchFieldHint: string;

  @Input() users: User[];
  @Input() userSearchFn: UserSearchFn;
  @Input() actionTypes: ActionType[];
  @Output() events: EventEmitter<UserSearchTableComponentEvent> = new EventEmitter();

  dataSource: UserSearchTableDataSource;
  formControlUserSearch: FormControl;
  displayedColumns: string[] = ['username', 'firstName', 'lastName', 'email', 'actions'];

  constructor(private formBuilder: FormBuilder) {
    this.formControlUserSearch = formBuilder.control('');
    this.dataSource = new UserSearchTableDataSource();
  }

  ngOnInit(): void {
    if (this.users) {
      this.dataSource.update(this.users);
    }
  }

  onUserSearchTriggered($event: Event) {
    this.userSearchFn(this.formControlUserSearch.value)
      .pipe(
        map((users: User[]) => {
          this.dataSource.update(users);
        })
      ).subscribe();
  }

  onActionTypeClicked($event: MouseEvent, actionType: ActionType, user: any) {
    this.events.emit({
      type: actionType.type,
      user
    } as UserSearchTableComponentEvent);

  }
}
