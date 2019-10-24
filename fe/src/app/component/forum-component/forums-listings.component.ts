import {Component, Input} from '@angular/core';
import {Forum} from '../../model/forum.model';


@Component({
   selector: 'app-forums-listings',
   templateUrl: './forums-listings.component.html',
   styleUrls: ['./forums-listings.component.scss']
})
export class ForumsListingsComponent {

   @Input() forums: Forum[];

}
