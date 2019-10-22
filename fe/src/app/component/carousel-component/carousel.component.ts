import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';


@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit, AfterViewInit  {

  @Input() images: string[];
  @Input() imageWidth: string;
  @Input() imageHeight: string;

  imageUrl: string;

  currentIndex: number;

  constructor() {
    this.images = [];
    this.currentIndex = 0;
    this.imageWidth = '500px';
    this.imageHeight = '200px';
  }

  ngOnInit(): void {
    if (!this.images || this.images.length === 0) {
      this.images = ['assets/images/item/no-image.png'];
    }
    this.imageUrl = this.images[0];
  }

  ngAfterViewInit(): void {
  }

  nextImage($event: MouseEvent) {
    const index = ((this.currentIndex < (this.images.length - 1)) ? ++this.currentIndex : this.currentIndex);
    this.imageUrl =  this.images[(index) % this.images.length];
  }

  prevImage($event: MouseEvent) {
    const index = ((this.currentIndex > 0) ? --this.currentIndex : 0);
    this.imageUrl = this.images[(index) % this.images.length];
  }
}
