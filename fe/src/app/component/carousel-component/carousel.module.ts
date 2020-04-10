import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppMaterialsModule} from '../../app-materials.module';
import {CarouselComponent} from './carousel.component';
import {UploadItemImageDialogComponent} from "./upload-item-image-dialog.component";

@NgModule({
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        AppMaterialsModule,
    ],
    declarations: [
        CarouselComponent,
        UploadItemImageDialogComponent,
    ],
    exports: [
        CarouselComponent,
        UploadItemImageDialogComponent,
    ],
    entryComponents: [
        UploadItemImageDialogComponent
    ]
})
export class CarouselModule {
}
