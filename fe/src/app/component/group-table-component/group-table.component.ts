import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges} from '@angular/core';
import {Group} from '../../model/group.model';
import {DataSource} from '@angular/cdk/table';
import {BehaviorSubject, Observable} from 'rxjs';
import {CollectionViewer} from '@angular/cdk/collections';
import {FormBuilder, FormControl} from '@angular/forms';
import {switchMap} from 'rxjs/internal/operators/switchMap';
import {debounceTime, filter, startWith} from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

export type GroupSearchFn = (group: string) => Observable<Group[]>;

export enum GroupTableComponentEventType {
  CANCEL = 'DELETE' as any,
  SEARCH = 'ADD' as any
}

export interface GroupTableComponentEvent {
  type: GroupTableComponentEventType;
  group: Group;
}

@Component({
  selector: 'app-group-table',
  templateUrl: './group-table.component.html',
  styleUrls: ['./group-table.component.scss']
})
export class GroupTableComponent implements OnInit, OnChanges {

  @Input() searchFieldPlaceholder: string;
  @Input() searchFieldHint: string;
  @Input() searchFieldLabel: string;

  @Input() groups: Group[];
  @Input() groupSearchFn: GroupSearchFn;

  @Output() events: EventEmitter<GroupTableComponentEvent>;

  formControlGroupSearch: FormControl;
  groupSearchResult: Observable<Group[]>;
  dataSource: GroupTableComponentDataSource;
  displayedColumns: string[] = ['name', 'description', 'status'];

  constructor(private formBuilder: FormBuilder) {
    this.dataSource = new GroupTableComponentDataSource();
    this.formControlGroupSearch = formBuilder.control('');
    this.events = new EventEmitter();
  }

  ngOnInit(): void {
    this.dataSource.update(this.groups);
    this.groupSearchResult = this.formControlGroupSearch
      .valueChanges
      .pipe(
        startWith(''),
        filter((groupSearch: Group | string) => (typeof groupSearch === 'string')),
        debounceTime(1000),
        switchMap((groupSearch: string) => {
           return this.groupSearchFn(groupSearch);
        })
      );
  }

  displayFn(group: Group | string): string {
    if (typeof group === 'string') {
      return group;
    }
    return group.name;
  }

  onCancelClicked(event: Event, group: Group) {
    this.events.emit({
      type: GroupTableComponentEventType.CANCEL,
      group
    } as GroupTableComponentEvent);
  }

  onGroupSearchSelected(event: MatAutocompleteSelectedEvent) {
    const group: Group = event.option.value;
    this.events.emit({
      type: GroupTableComponentEventType.SEARCH,
      group
    } as GroupTableComponentEvent);
    this.formControlGroupSearch.setValue('');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.groups) {
      const simpleChange: SimpleChange = changes.groups;
      const g: Group[] = simpleChange.currentValue;
      this.dataSource.update(g);
    }
  }
}

class GroupTableComponentDataSource extends DataSource<Group> {

  private subject: BehaviorSubject<Group[]> = new BehaviorSubject([]);

  update(g: Group[]) {
    this.subject.next(g);
  }

  connect(collectionViewer: CollectionViewer): Observable<Group[] | ReadonlyArray<Group>> {
    return this.subject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.subject.complete();
  }

}
