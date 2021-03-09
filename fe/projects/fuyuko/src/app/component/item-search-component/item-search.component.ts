import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormControl} from '@angular/forms';
import {ItemSearchType} from '@fuyuko-common/model/item.model';



export interface ItemSearchComponentEvent {
  type: ItemSearchType;
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
    this.formControlValue = formBuilder.control('');
  }


  onBasicSearch($event: Event) {
    this.events.emit({
      type: 'basic',
      search: this.formControlValue.value
    } as ItemSearchComponentEvent);
  }

  onAdvanceSearch($event: KeyboardEvent) {
   if (this.formControlValue.invalid) {
     this.events.emit({
       type: 'advance',
       search: this.formControlValue.value
     } as ItemSearchComponentEvent);
   }
  }
}
