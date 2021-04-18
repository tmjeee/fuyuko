import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Item, ItemImage} from '@fuyuko-common/model/item.model';
import {Attribute} from '@fuyuko-common/model/attribute.model';
import {CarouselComponentEvent, CarouselItemImage} from '../carousel-component/carousel.component';
import config from '../../utils/config.util';
import {ItemEditorComponentEvent} from './item-editor.component';
import {ItemValueAndAttribute} from '@fuyuko-common/model/item-attribute.model';


const URL_GET_ITEM_IMAGE = () => `${config().api_host_url}/item/image/:itemImageId`;


export interface DataEditorEvent {
   item: Item;
   itemValueAndAttribute: ItemValueAndAttribute;
}

@Component({
   selector: 'app-item-info',
   templateUrl: './item-info.component.html',
   styleUrls: ['./item-info.component.scss']
})
export class ItemInfoComponent {

   @Input() item: Item;
   @Input() attributes: Attribute[];

   @Output() dataEditorEvent: EventEmitter<DataEditorEvent>;
   @Output() itemEditorEvent: EventEmitter<ItemEditorComponentEvent>;
   @Output() carouselEvent: EventEmitter<CarouselComponentEvent>;

   constructor() {
       this.dataEditorEvent = new EventEmitter<DataEditorEvent>();
       this.itemEditorEvent = new EventEmitter<ItemEditorComponentEvent>();
       this.carouselEvent = new EventEmitter<CarouselComponentEvent>();
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
   }

   onItemDataChange($event: ItemEditorComponentEvent) {
      switch ($event.type) {
         case 'name':
            this.item.name = $event.item.name;
            break;
         case 'description':
            this.item.description = $event.item.description;
            break;
      }
      this.itemEditorEvent.emit($event);
   }

   onAttributeDataChange($event: ItemValueAndAttribute, item: Item) {
      this.item[$event.attribute.id] = $event.itemValue;
      this.dataEditorEvent.emit({
         item,
         itemValueAndAttribute: $event
      } as DataEditorEvent);
   }

   onCarouselEvent($event: CarouselComponentEvent) {
      this.carouselEvent.emit($event);
   }
}
