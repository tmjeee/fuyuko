import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMaterialsModule } from '../../app-materials.module';
import { CarouselComponent } from './carousel.component';
let CarouselModule = class CarouselModule {
};
CarouselModule = tslib_1.__decorate([
    NgModule({
        imports: [
            CommonModule,
            BrowserAnimationsModule,
            FormsModule,
            ReactiveFormsModule,
            AppMaterialsModule,
        ],
        declarations: [
            CarouselComponent
        ],
        exports: [
            CarouselComponent
        ]
    })
], CarouselModule);
export { CarouselModule };
//# sourceMappingURL=carousel.module.js.map