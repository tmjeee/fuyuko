import {NgModule, Provider} from '@angular/core';
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
import {SharedComponentUtilsModule} from '../shared-component-utils/shared-component-utils.module';
import {StockTradingWidgetComponent} from './widgets/stock-trading-widget/stock-trading-widget.component';
import {MostActiveUsersWidgetComponent} from './widgets/most-active-users-widget/most-active-users-widget.component';
import {UserVisitsInsightWidgetComponent} from './widgets/user-visits-insight-widget/user-visits-insight-widget.component';
import {GoogleChartsModule} from 'angular-google-charts';
import {GlobalMissingAttributeValuesWidgetComponent} from './widgets/global-missing-attribute-values-widget/global-missing-attribute-values-widget.component';
import {MissingAttributeValueWidgetComponent} from './widgets/missing-attribute-values-widget/missing-attribute-value-widget.component';
import {ViewValidationSummaryWidgetComponent} from './widgets/view-validation-summary-widget/view-validation-summary-widget.component';
import {ViewValidationRangeSummaryWidgetComponent} from './widgets/view-validation-range-summary-widget/view-validation-range-summary-widget.component';
import {ViewAttributeValidationSummaryWidgetComponent} from './widgets/view-attribute-validation-summary-widget/view-attribute-validation-summary-widget.component';
import {ViewAttributeValidationRangeSummaryWidgetComponent} from './widgets/view-attribute-validation-range-summary-widget/view-attribute-validation-range-summary-widget.component';

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
        GoogleChartsModule,
    ],
    declarations: [
        DashboardComponent,
        WidgetContainerComponent,
        // dashboard widgets
        ClockWidgetComponent,
        WeatherWidgetComponent,
        StockTradingWidgetComponent,
        MostActiveUsersWidgetComponent,
        UserVisitsInsightWidgetComponent,
        GlobalMissingAttributeValuesWidgetComponent,
        MissingAttributeValueWidgetComponent,
        ViewValidationSummaryWidgetComponent,
        ViewValidationRangeSummaryWidgetComponent,
        ViewAttributeValidationSummaryWidgetComponent,
        ViewAttributeValidationRangeSummaryWidgetComponent,
    ],
    exports: [
        DashboardComponent,
        WidgetContainerComponent,
        // dashboard widgets
        ClockWidgetComponent,
        WeatherWidgetComponent,
        StockTradingWidgetComponent,
        MostActiveUsersWidgetComponent,
        UserVisitsInsightWidgetComponent,
        GlobalMissingAttributeValuesWidgetComponent,
        MissingAttributeValueWidgetComponent,
        ViewValidationSummaryWidgetComponent,
        ViewValidationRangeSummaryWidgetComponent,
        ViewAttributeValidationSummaryWidgetComponent,
        ViewAttributeValidationRangeSummaryWidgetComponent,
    ]
})
export class DashboardModule {}
