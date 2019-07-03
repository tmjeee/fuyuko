import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';


export type SearchType = 'basic' | 'advance';

export interface ItemSearchComponentEvent {
  type: SearchType;
  search: string;
}

@Component({
  selector: 'app-item-search',
  templateUrl: './item-search.component.html',
  styleUrls: ['./item-search.component.scss']
})
export class ItemSearchComponent {

  @Output() events: EventEmitter<ItemSearchComponentEvent>;

  formControlValue: FormControl;

  constructor(private formBuilder: FormBuilder) {
    this.events = new EventEmitter();
    this.formControlValue = formBuilder.control('', [Validators.required]);
  }


  onBasicSearch($event: Event) {
    if (this.formControlValue.invalid) {
      this.events.emit({
        type: 'basic',
        search: this.formControlValue.value
      } as ItemSearchComponentEvent);
    }
  }

  onAdvanceSearch($event) {
   if (this.formControlValue.invalid) {
     this.events.emit({
       type: 'advance',
       search: this.formControlValue.value
     } as ItemSearchComponentEvent);
   }
  }
}
