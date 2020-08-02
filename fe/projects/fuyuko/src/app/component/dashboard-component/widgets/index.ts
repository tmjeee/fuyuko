import {ClockWidgetComponent} from './clock-widget/clock-widget.component';
import {WeatherWidgetComponent} from './weather-widget/weather-widget.component';
import {StockTradingWidgetComponent} from "./stock-trading-widget/stock-trading-widget.component";
import {MostActiveUsersWidgetComponent} from "./most-active-users-widget/most-active-users-widget.component";
import {UserVisitsInsightWidgetComponent} from "./user-visits-insight-widget/user-visits-insight-widget.component";
import {GlobalMissingAttributeValuesWidgetComponent} from "./global-missing-attribute-values-widget/global-missing-attribute-values-widget.component";
import {MissingAttributeValueWidgetComponent} from "./missing-attribute-values-widget/missing-attribute-value-widget.component";
import {ViewValidationSummaryWidgetComponent} from "./view-validation-summary-widget/view-validation-summary-widget.component";
import {ViewValidationRangeSummaryWidgetComponent} from "./view-validation-range-summary-widget/view-validation-range-summary-widget.component";
import {ViewAttributeValidationSummaryWidgetComponent} from "./view-attribute-validation-summary-widget/view-attribute-validation-summary-widget.component";
import {ViewAttributeValidationRangeSummaryWidgetComponent} from "./view-attribute-validation-range-summary-widget/view-attribute-validation-range-summary-widget.component";

export const DASHBOARD_WIDGET_INFOS = [
    ClockWidgetComponent.info(),
    WeatherWidgetComponent.info(),
    StockTradingWidgetComponent.info(),
    MostActiveUsersWidgetComponent.info(),
    UserVisitsInsightWidgetComponent.info(),
    GlobalMissingAttributeValuesWidgetComponent.info(),
    MissingAttributeValueWidgetComponent.info(),
    ViewValidationSummaryWidgetComponent.info(),
    ViewValidationRangeSummaryWidgetComponent.info(),
    ViewAttributeValidationSummaryWidgetComponent.info(),
    ViewAttributeValidationRangeSummaryWidgetComponent.info(),
];

