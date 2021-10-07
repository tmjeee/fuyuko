import {
  AfterViewInit, ChangeDetectorRef,
  Component,
  ElementRef, EventEmitter,
  Input,
  OnChanges,
  OnInit, Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {ItemImage} from '@fuyuko-common/model/item.model';
import {MatDialog} from '@angular/material/dialog';
import {UploadItemImageDialogComponent} from './upload-item-image-dialog.component';
import {tap} from 'rxjs/operators';

export interface CarouselItemImage extends ItemImage {
  imageUrl: string;
}


export interface CarouselComponentEvent {
  type: 'markAsPrimary' | 'delete' | 'upload';
  itemId: number;
  file?: File;  // only when type is 'upload'
  image?: CarouselItemImage;  // only when type is 'markAsPrimary' and 'delete'
}

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit, AfterViewInit, OnChanges  {

  @Input() images: CarouselItemImage[];
  @Input() itemId!: number;
  @Input() allowEdit: boolean;
  @Input() imageWidth: string;
  @Input() imageHeight: string;

  @Output() events: EventEmitter<CarouselComponentEvent>;

  readonly EMPTY_IMAGES: CarouselItemImage[] = [
    {
      id: -1,
      name: 'no-image',
      size: 24738,
      mimeType: 'image/png',
      imageUrl: `assets/images/item/no-image.png`
    }  as CarouselItemImage
  ];

  currentImage!: CarouselItemImage;
  currentIndex: number;

  @ViewChild('image') elementRef!: ElementRef;

  constructor(private matDialog: MatDialog) {
    this.allowEdit = true;
    this.images = [];
    this.currentIndex = 0;
    this.imageWidth = '500px';
    this.imageHeight = '200px';
    this.events = new EventEmitter<CarouselComponentEvent>();
  }

  ngOnInit(): void {
    this.reload();
  }

  ngOnChanges(changes: SimpleChanges): void {
      if (changes.images && changes.images.currentValue) {
      }
  }
  reload() {
    if (!this.images || this.images.length === 0) {
      this.images = [...this.EMPTY_IMAGES];
    }
    this.currentImage = this.images[0];
  }

  ngAfterViewInit(): void {
  }

  nextImage($event: MouseEvent) {
    const index = ((this.currentIndex < (this.images.length - 1)) ? ++this.currentIndex : this.currentIndex);
    this.currentImage =  this.images[(index) % this.images.length];
  }

  prevImage($event: MouseEvent) {
    const index = ((this.currentIndex > 0) ? --this.currentIndex : 0);
    this.currentImage = this.images[(index) % this.images.length];
  }

  onMarkAsPrimary($event: MouseEvent) {
    this.events.emit({
      type: 'markAsPrimary',
      itemId: this.itemId,
      image: this.currentImage
    });
  }

  onDelete($event: MouseEvent) {
    this.events.emit({
      type: 'delete',
      itemId: this.itemId,
      image: this.currentImage
    });
  }

  onUpload($event: MouseEvent) {
    this.matDialog
        .open(UploadItemImageDialogComponent, {
          width: '90vw',
          height: '90vh'
        })
        .afterClosed()
        .pipe(
          tap((r: File) => {
            if (r) {
              this.events.emit({
                type: 'upload',
                itemId: this.itemId,
                file: r
              });
            }
          })
        ).subscribe();
  }
}
