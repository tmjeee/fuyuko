import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Group} from '@fuyuko-common/model/group.model';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipEvent, MatChipList} from '@angular/material/chips';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {filter, startWith, switchMap} from 'rxjs/operators';

export type GroupSearchFn = (group: string) => Observable<Group[]>;

export interface SendInviteComponentEvent {
  email: string;
  groups: Group[];
}

@Component({
  selector: 'app-send-invite',
  templateUrl: './send-invite.component.html',
  styleUrls: ['./send-invite.component.scss']
})
export class SendInviteComponent implements OnInit {

  selectedGroups: Group[];
  formControlGroup: FormControl;
  formControlEmail: FormControl;
  filteredGroups!: Observable<Group[]>;

  @Input() groupSearchFn!: GroupSearchFn;
  @Output() events: EventEmitter<SendInviteComponentEvent>;

  @ViewChild('chipList', { static: true }) matChipList!: MatChipList;
  @ViewChild('chipInput', { static: true }) chipInput!: ElementRef;

  constructor(private formBuilder: FormBuilder) {
    this.selectedGroups = [];
    this.formControlGroup = formBuilder.control('');
    this.formControlEmail = formBuilder.control('', [Validators.required, Validators.email]);
    this.events = new EventEmitter();
  }

  ngOnInit(): void {
    this.filteredGroups = this.formControlGroup
      .valueChanges
      .pipe(
        startWith(''),
        // filter((v: string | Group) => ((v) && (typeof v === 'string'))),
        filter(v => (v && (typeof v === 'string'))),
        switchMap((v: string) => {
          return this.groupSearchFn(v);
        })
      );
  }

  onGroupChipRemoved($event: MatChipEvent) {
    const g: Group = $event.chip.value;
    this.selectedGroups = this.selectedGroups.filter((grp: Group) => grp.id !== g.id);
    this.checkIfAnyGroupsAreSelected();
  }

  onGroupSelected($event: MatAutocompleteSelectedEvent) {
    const g: Group = $event.option.value;
    const gFound: Group | undefined = this.selectedGroups.find((grp: Group) => grp.id === g.id);
    if (!gFound) {
      this.selectedGroups.push(g);
    }
    this.formControlGroup.setValue('');
    this.checkIfAnyGroupsAreSelected();
  }

  onSendInvitation($event: MouseEvent) {
    this.events.emit({
      email: this.formControlEmail.value,
      groups: this.selectedGroups
    } as SendInviteComponentEvent);
    this.clearInputs();
  }

  isValid(): boolean {
    return (this.formControlEmail.valid && !!this.selectedGroups && this.selectedGroups.length > 0);
  }

  onGroupInputFocus($event: FocusEvent) {
    this.checkIfAnyGroupsAreSelected();
  }

  private clearInputs() {
    (this.chipInput.nativeElement as HTMLInputElement).value = '';
    this.formControlEmail.setValue('');
    this.formControlGroup.setValue('');
    this.formControlEmail.markAsUntouched();
    this.formControlEmail.markAsPristine();
    this.formControlGroup.markAsUntouched();
    this.formControlGroup.markAsPristine();
    this.selectedGroups = [];
    this.formControlEmail.updateValueAndValidity();
    this.formControlGroup.updateValueAndValidity();
  }

  private checkIfAnyGroupsAreSelected() {
    if (this.selectedGroups && this.selectedGroups.length <= 0) {
      this.matChipList.errorState = true;
    } else {
      this.matChipList.errorState = false;
    }
  }

}
