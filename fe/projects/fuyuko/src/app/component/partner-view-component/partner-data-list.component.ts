import {Component, Input, ViewChild} from '@angular/core';
import {Item, ItemImage, PricedItem} from '@fuyuko-common/model/item.model';
import config from '../../utils/config.util';
import {Attribute} from '@fuyuko-common/model/attribute.model';
import {MatSidenav} from '@angular/material/sidenav';
import {CarouselItemImage} from '../carousel-component/carousel.component';
import {getItemValue} from '@fuyuko-common/shared-utils/item.util';

const URL_GET_ITEM_IMAGE = () => `${config().api_host_url}/item/image/:itemImageId`;

@Component({
    selector: 'app-partner-data-list',
    templateUrl: './partner-data-list.component.html',
    styleUrls: ['./partner-data-list.component.scss']
})
export class PartnerDataListComponent {

    getItemValue = getItemValue;

    @Input() attributes: Attribute[] = [];
    @Input() pricedItems: PricedItem[] = [];
    @ViewChild('sideNav', {static: true}) sideNav!: MatSidenav;

    selectedPricedItem?: PricedItem;

    getCarouselImages(item: Item): CarouselItemImage[] {
        if (item && item.images) {
            // const p = `/item/image/:itemImageId`;
            return item.images.map((i: ItemImage) => ({
                ...i,
                itemId: item.id,
                imageUrl: URL_GET_ITEM_IMAGE().replace(':itemImageId', `${i.id}`)
            } as CarouselItemImage));
        }
        return [];
    }

    async onItemClicked($event: Event, item: PricedItem) {
        $event.stopImmediatePropagation();
        this.selectedPricedItem = item;
        await this.sideNav.open();
    }


    async onCloseSideNav($event: MouseEvent) {
        await this.sideNav.close();
    }
}
