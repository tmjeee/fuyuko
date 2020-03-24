import {Component, Input, ViewChild} from '@angular/core';
import {Attribute} from '../../model/attribute.model';
import {Item, ItemImage, PricedItem} from '../../model/item.model';
import config from '../../utils/config.util';
import {MatSidenav} from '@angular/material/sidenav';
import {CarouselItemImage} from "../carousel-component/carousel.component";


const URL_GET_ITEM_IMAGE = () => `${config().api_host_url}/item/image/:itemImageId`;

@Component({
    selector: 'app-partner-data-thumbnail',
    templateUrl: './partner-data-thumbnail.component.html',
    styleUrls: ['./partner-data-thumbnail.component.scss']
})
export class PartnerDataThumbnailComponent {

    @Input() attributes: Attribute[];
    @Input() pricedItems: PricedItem[];

    @ViewChild('sideNav', {static: true}) sideNav: MatSidenav;

    showMoreMap: Map<number, boolean>; /* <item id, can show more> */
    selectedPricedItem: PricedItem;

    constructor() {
        this.showMoreMap = new Map();
    }


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

    onViewDetailsClicked($event: MouseEvent, item: PricedItem) {
        this.selectedPricedItem = item;
        this.sideNav.open();
    }

    isShowMore(item: Item) {
        if (this.showMoreMap.has(item.id)) {
            return this.showMoreMap.get(item.id);
        } else {
            this.showMoreMap.set(item.id, false);
            return false;
        }
    }

    showMore($event: MouseEvent, item: Item) {
        $event.preventDefault();
        $event.stopImmediatePropagation();
        const showMore: boolean = this.isShowMore(item);
        this.showMoreMap.set(item.id, !showMore);
    }

    onCloseSideNav($event: MouseEvent) {
        this.sideNav.close();
    }
}
