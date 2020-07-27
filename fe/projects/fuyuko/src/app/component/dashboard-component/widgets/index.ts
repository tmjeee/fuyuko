import {ClockWidgetComponent} from './clock-widget/clock-widget.component';
import {WeatherWidgetComponent} from './weather-widget/weather-widget.component';
import {StockTradingWidgetComponent} from "./stock-trading-widget/stock-trading-widget.component";
import {MostActiveUsersWidgetComponent} from "./most-active-users-widget/most-active-users-widget.component";
import {UserVisitsInsightWidgetComponent} from "./user-visits-insight-widget/user-visits-insight-widget.component";

export const DASHBOARD_WIDGET_INFOS = [
    ClockWidgetComponent.info(),
    WeatherWidgetComponent.info(),
    StockTradingWidgetComponent.info(),
    MostActiveUsersWidgetComponent.info(),
    UserVisitsInsightWidgetComponent.info(),
];

