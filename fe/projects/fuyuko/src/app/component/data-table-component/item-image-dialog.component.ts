import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CarouselComponentEvent, CarouselItemImage} from '../carousel-component/carousel.component';


@Component({
    templateUrl: './item-image-dialog.component.html',
    styleUrls: ['./item-image-dialog.component.scss']
})
export class ItemImageDialogComponent {

    images: CarouselItemImage[];
    itemId: number;

    constructor(private matDialogRef: MatDialogRef<ItemImageDialogComponent>,
                @Inject(MAT_DIALOG_DATA) private data: {images: CarouselItemImage[], itemId: number} ) {
        this.images = data.images;
        this.itemId = data.itemId;
    }

    onCarouselEvent($event: CarouselComponentEvent) {
        this.matDialogRef.close($event);
    }

    onCloseClicked($event: MouseEvent) {
        this.matDialogRef.close(null);
    }
}
