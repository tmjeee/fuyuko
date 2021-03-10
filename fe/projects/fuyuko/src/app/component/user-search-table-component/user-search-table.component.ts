import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChange,
  SimpleChanges
} from '@angular/core';
import {User} from '@fuyuko-common/model/user.model';
import {DataSource} from '@angular/cdk/table';
import {CollectionViewer} from '@angular/cdk/collections';
import {BehaviorSubject, Observable} from 'rxjs';
import {FormBuilder, FormControl} from '@angular/forms';
import {map} from 'rxjs/operators';
import {SelfRegistration} from '@fuyuko-common/model/self-registration.model';

export type UserSearchFn = (username: string) => Observable<User[] | SelfRegistration[]>;

export interface TableEntry { id: number, username: string, firstName: string, lastName: string };

export interface UserSearchTableComponentEvent {
  type: string;
  user: TableEntry;
}

class UserSearchTableDataSource implements DataSource<TableEntry> {

  subject: BehaviorSubject<TableEntry[]> = new BehaviorSubject([]);

  update(users: TableEntry[]) {
    this.subject.next(users);
  }

  connect(collectionViewer: CollectionViewer): Observable<TableEntry[] | ReadonlyArray<TableEntry>> {
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
export class UserSearchTableComponent implements OnInit, OnChanges {

  @Input() searchFieldPlaceholder: string;
  @Input() searchFieldLabel: string;
  @Input() searchFieldHint: string;

  @Input() users: User[] | SelfRegistration[];
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
      this.userSearch();
  }

  userSearch() {
    this.userSearchFn(this.formControlUserSearch.value)
        .pipe(
            map((users: User[] | SelfRegistration[]) => {
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

  ngOnChanges(changes: SimpleChanges): void {
      const change: SimpleChange = changes.users;
      if (this.dataSource) {
        // const users: User[] = change.currentValue;
        // this.dataSource.update(users);
        this.userSearch();
      }
  }
}
