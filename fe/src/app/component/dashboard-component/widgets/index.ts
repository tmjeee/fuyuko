import {ClockWidgetComponent} from './clock-widget/clock-widget.component';
import {WeatherWidgetComponent} from './weather-widget/weather-widget.component';
import {StockTradingWidgetComponent} from "./stock-trading-widget/stock-trading-widget.component";

export const DASHBOARD_WIDGET_INFOS = [
    ClockWidgetComponent.info(),
    WeatherWidgetComponent.info(),
    StockTradingWidgetComponent.info(),
];

/*
  clock widget
  https://www.zeitverschiebung.net/en/clock-widget?size=large&timezone=Australia/Sydney&type=city&id=2147714#location

  weather widget
  https://weatherwidget.io/

  stock widget
  https://www.tradingview.com/widget/advanced-chart/
 */

