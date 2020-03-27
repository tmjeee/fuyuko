import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppMaterialsModule} from '../../app-materials.module';
import {DataEditorModule} from '../data-editor-component/data-editor.module';
import {JobsModule} from '../jobs-component/jobs.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {DashboardComponent} from './dashboard.component';
import {WidgetContainerComponent} from './widget-container.component';
import {ClockWidgetComponent} from './widgets/clock-widget/clock-widget.component';
import {WeatherWidgetComponent} from './widgets/weather-widget/weather-widget.component';
import {SharedComponentUtilsModule} from "../shared-component-utils/shared-component-utils.module";
import {StockTradingWidgetComponent} from "./widgets/stock-trading-widget/stock-trading-widget.component";

@NgModule({
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        AppMaterialsModule,
        DataEditorModule,
        FlexLayoutModule,
        JobsModule,
        SharedComponentUtilsModule,
    ],
    declarations: [
        DashboardComponent,
        WidgetContainerComponent,

        // dashboard widgets
        ClockWidgetComponent,
        WeatherWidgetComponent,
        StockTradingWidgetComponent,
    ],
    exports: [
        DashboardComponent,
        WidgetContainerComponent,

        // dashboard widgets
        ClockWidgetComponent,
        WeatherWidgetComponent,
        StockTradingWidgetComponent,
    ],
    entryComponents: [
        ClockWidgetComponent,
        WeatherWidgetComponent,
        StockTradingWidgetComponent,
    ]
})
export class DashboardModule {}
