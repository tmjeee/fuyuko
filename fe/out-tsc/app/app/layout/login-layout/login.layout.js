import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { BackgroundImageService } from '../../service/background-image-service/background-image.service';
let LoginLayoutComponent = class LoginLayoutComponent {
    constructor(backgroundImageService) {
        this.backgroundImageService = backgroundImageService;
    }
    ngOnInit() {
        this.backgroundImage = this.backgroundImageService.randomBackgroundImage();
    }
};
LoginLayoutComponent = tslib_1.__decorate([
    Component({
        templateUrl: './login.layout.html',
        styleUrls: ['./login.layout.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [BackgroundImageService])
], LoginLayoutComponent);
export { LoginLayoutComponent };
//# sourceMappingURL=login.layout.js.map