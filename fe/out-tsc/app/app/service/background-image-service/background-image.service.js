import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
const total = 11;
const ALL = [
    { name: 'background-01', file: 'background-01.jpg', location: '/assets/images/login-background/background-01.jpg' },
    { name: 'background-02', file: 'background-02.jpg', location: '/assets/images/login-background/background-02.jpg' },
    { name: 'background-03', file: 'background-03.jpg', location: '/assets/images/login-background/background-03.jpg' },
    { name: 'background-04', file: 'background-04.jpg', location: '/assets/images/login-background/background-04.jpg' },
    { name: 'background-05', file: 'background-05.jpg', location: '/assets/images/login-background/background-05.jpg' },
    { name: 'background-06', file: 'background-06.jpg', location: '/assets/images/login-background/background-06.jpg' },
    { name: 'background-07', file: 'background-07.jpg', location: '/assets/images/login-background/background-07.jpg' },
    { name: 'background-08', file: 'background-08.jpg', location: '/assets/images/login-background/background-08.jpg' },
    { name: 'background-09', file: 'background-09.jpg', location: '/assets/images/login-background/background-09.jpg' },
    { name: 'background-10', file: 'background-10.jpg', location: '/assets/images/login-background/background-10.jpg' },
    { name: 'background-11', file: 'background-11.jpg', location: '/assets/images/login-background/background-11.jpg' },
];
let BackgroundImageService = class BackgroundImageService {
    allBackgroundImages() {
        return ALL;
    }
    randomBackgroundImage() {
        return ALL[Math.floor(Math.random() * (total - 1))];
    }
};
BackgroundImageService = tslib_1.__decorate([
    Injectable()
], BackgroundImageService);
export { BackgroundImageService };
//# sourceMappingURL=background-image.service.js.map