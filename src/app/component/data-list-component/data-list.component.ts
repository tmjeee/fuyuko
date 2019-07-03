import {Component, Input} from '@angular/core';
import {ItemAndAttributeSet} from '../../model/item-attribute.model';


@Component({
  selector: 'app-data-list',
  templateUrl: './data-list.component.html',
  styleUrls: ['./data-list.component.scss']
})
export class DataListComponent {
    @Input() itemAndAttributeSet: ItemAndAttributeSet;
}
