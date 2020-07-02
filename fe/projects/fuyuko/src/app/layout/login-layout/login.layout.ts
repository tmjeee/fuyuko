import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {BackgroundImage, BackgroundImageService} from '../../service/background-image-service/background-image.service';

@Component({
  templateUrl: './login.layout.html',
  styleUrls: ['./login.layout.scss']
})
export class LoginLayoutComponent implements OnInit, OnDestroy {

  backgroundImage: BackgroundImage;
  handler: any;

  allCachedImages: HTMLImageElement[] = [];

  constructor(private backgroundImageService: BackgroundImageService,
              private ngZone: NgZone) {}

  ngOnInit(): void {
    // eagerly cache all background images for smooth transition
    for (const bgImage of this.backgroundImageService.allBackgroundImages()) {
        const img: HTMLImageElement = new Image();
        img.src = bgImage.location;
        this.allCachedImages.push(img);
    }
    this.backgroundImage = this.backgroundImageService.randomBackgroundImage();
    this.changeBackgroundImage();
  }

  ngOnDestroy(): void {
    if (this.handler) {
        clearTimeout(this.handler);
    }
  }

  changeBackgroundImage() {
    this.ngZone.runOutsideAngular(() => {
      this.handler = setTimeout(() => {
        this.backgroundImage = this.backgroundImageService.randomBackgroundImage();
        this.changeBackgroundImage();
      }, 10000);
    });
  }
}
