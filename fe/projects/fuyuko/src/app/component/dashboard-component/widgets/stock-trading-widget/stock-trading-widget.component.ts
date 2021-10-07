import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {DashboardWidget, DashboardWidgetInfo} from '../../dashboard.model';
import {DashboardWidgetService} from '../../../../service/dashboard-service/dashboard-widget.service';
import uuid from 'uuid';

declare const TradingView: any;


/**
 * stock widget
 *  https://www.tradingview.com/widget/advanced-chart/
 */

@Component({
    templateUrl: './stock-trading-widget.component.html',
    styleUrls: ['./stock-trading-widget.component.scss']
})
export class StockTradingWidgetComponent extends DashboardWidget implements OnInit, AfterViewInit, OnDestroy {

    constructor(protected dashboardWidgetService: DashboardWidgetService) {
        super(dashboardWidgetService);
    }

    uid = `tradingview_${uuid()}`;

    static info(): DashboardWidgetInfo {
       return { id: 'stock-trading-widget', name: 'stock-trading-widget', type: StockTradingWidgetComponent };
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.f();
    }

    ngOnDestroy(): void {
    }


    f() {
        /*
        let s = document.createElement('script');
        s.src =`https://s3.tradingview.com/tv.js`;
        const fjs = (document.getElementsByTagName(`script`)[0] as HTMLScriptElement);
        fjs.parentNode.insertBefore(s, fjs);
         */
        setTimeout(() => {
            // tslint:disable-next-line:no-unused-expression
            new TradingView.widget(
                {
                    width: 980,
                    height: 610,
                    symbol: 'NASDAQ:AAPL',
                    interval: 'D',
                    timezone: 'Etc/UTC',
                    theme: 'light',
                    style: '1',
                    locale: 'en',
                    toolbar_bg: '#f1f3f6',
                    enable_publishing: false,
                    allow_symbol_change: true,
                    container_id: this.uid
                }
            );
        }, 3000);
    }


}
