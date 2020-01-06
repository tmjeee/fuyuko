import {Component, Input, ViewChild} from '@angular/core';
import {Item, ItemImage, PricedItem} from '../../model/item.model';
import config from '../../utils/config.util';
import {Attribute} from '../../model/attribute.model';
import {MatSidenav} from '@angular/material/sidenav';

const URL_GET_ITEM_IMAGE = () => `${config().api_host_url}/item/image/:itemImageId`;

@Component({
    selector: 'app-partner-data-list',
    templateUrl: './partner-data-list.component.html',
    styleUrls: ['./partner-data-list.component.scss']
})
export class PartnerDataListComponent {

    @Input() attributes: Attribute[];
    @Input() pricedItems: PricedItem[];
    @ViewChild('sideNav', {static: true}) sideNav: MatSidenav;

    selectedPricedItem: PricedItem;

    getItemImagesUrl(item: Item): string[] {
        if (item && item.images) {
            // const p = `/item/image/:itemImageId`;
            return item.images.map((i: ItemImage) => URL_GET_ITEM_IMAGE().replace(':itemImageId', `${i.id}`));
        }
        return [];
    }

    onItemClicked($event: Event, item: PricedItem) {
        $event.stopImmediatePropagation();
        this.selectedPricedItem = item;
        this.sideNav.open();
    }
}
