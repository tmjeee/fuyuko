import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges} from '@angular/core';
import {User} from '../../model/user.model';
import {FormBuilder, FormControl} from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {UserManagementService} from '../../service/user-management-service/user-management.service';
import {debounceTime, filter, map, startWith} from 'rxjs/operators';
import {of} from 'rxjs/internal/observable/of';
import {switchMap} from 'rxjs/internal/operators/switchMap';
import {DataSource} from '@angular/cdk/table';
import {CollectionViewer} from '@angular/cdk/collections';


export type UserSearchFn = (user: string) => Observable<User[]>;

export type UserTableComponentEventType = 'delete' | 'selection';

export interface UserTableComponentEvent {
  type: UserTableComponentEventType;
  user: User;
}

class UserTableDataSource implements DataSource<User> {

  constructor(private userManagementService: UserManagementService) { }

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

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss']
})
export class UserTableComponent implements OnInit, OnChanges {

  @Input() searchFieldPlaceholder: string;
  @Input() searchFieldLabel: string;
  @Input() searchFieldHint: string;

  @Input() users: User[];
  @Input() userSearchFn: UserSearchFn;
  @Output() events: EventEmitter<UserTableComponentEvent> = new EventEmitter();

  dataSource: UserTableDataSource;

  formControlUserSearch: FormControl;
  userSearchResult: Observable<User[]>;

  displayedColumns: string[] = ['username', 'firstName', 'lastName', 'email', 'actions'];

  constructor(private formBuilder: FormBuilder, private userManagementService: UserManagementService) {}

  ngOnInit(): void {
    this.dataSource = new UserTableDataSource(this.userManagementService);
    this.dataSource.update(this.users);
    this.userSearchResult = of([]);
    this.formControlUserSearch = this.formBuilder.control('');
    this.userSearchResult = this.formControlUserSearch
      .valueChanges
      .pipe(
        startWith(''),
        filter((v: User | string) => typeof v === 'string'),
        debounceTime(1000),
        switchMap((v: string) => {
          return this.userSearchFn(v);
        })
      );
  }

  displayFn(user: User | string): string {
    if (typeof user !== 'string') {
      return user.username;
    }
    return user;
  }

  onUserSearchSelected(event: MatAutocompleteSelectedEvent) {
    const user: User = event.option.value;
    this.events.emit({
      type: 'selection',
      user
    } as UserTableComponentEvent);
  }

  onCancelClicked(event: Event, user: User) {
    this.events.emit({
      type: 'delete', user
    } as UserTableComponentEvent);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.user) {
      const change: SimpleChange = changes.user;
      const users: User[] = change.currentValue;
      this.dataSource.update(users);
    }
  }
}
