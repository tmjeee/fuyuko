import {ClockWidgetComponent} from './clock-widget/clock-widget.component';
import {WeatherWidgetComponent} from './weather-widget/weather-widget.component';
import {StockTradingWidgetComponent} from "./stock-trading-widget/stock-trading-widget.component";

export const DASHBOARD_WIDGET_INFOS = [
    ClockWidgetComponent.info(),
    WeatherWidgetComponent.info(),
    StockTradingWidgetComponent.info(),
];

