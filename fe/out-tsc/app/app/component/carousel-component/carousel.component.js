import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
let CarouselComponent = class CarouselComponent {
    constructor() {
        this.images = [];
        this.currentIndex = 0;
        this.imageWidth = '500px';
        this.imageHeight = '200px';
    }
    ngOnInit() {
        if (!this.images || this.images.length === 0) {
            this.images = ['assets/images/item/no-image.png'];
        }
        this.imageUrl = this.images[0];
    }
    ngAfterViewInit() {
    }
    nextImage($event) {
        const index = ((this.currentIndex < (this.images.length - 1)) ? ++this.currentIndex : this.currentIndex);
        this.imageUrl = this.images[(index) % this.images.length];
    }
    prevImage($event) {
        const index = ((this.currentIndex > 0) ? --this.currentIndex : 0);
        this.imageUrl = this.images[(index) % this.images.length];
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], CarouselComponent.prototype, "images", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], CarouselComponent.prototype, "imageWidth", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], CarouselComponent.prototype, "imageHeight", void 0);
CarouselComponent = tslib_1.__decorate([
    Component({
        selector: 'app-carousel',
        templateUrl: './carousel.component.html',
        styleUrls: ['./carousel.component.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [])
], CarouselComponent);
export { CarouselComponent };
//# sourceMappingURL=carousel.component.js.map