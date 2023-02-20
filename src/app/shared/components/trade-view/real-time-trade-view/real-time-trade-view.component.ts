/* eslint-disable @typescript-eslint/naming-convention */
import { AfterViewInit, Component, Input } from '@angular/core';

declare const TradingView: any;

@Component({
  selector: 'app-real-time-trade-view',
  template: '<div id="tradingview_f2d64"></div>',
})
export class RealTimeTradeViewComponent implements AfterViewInit {
  @Input() symbolPair: string = '';

  ngAfterViewInit(): void {
    new TradingView.widget(
      {
        'width': '100%',
        'height': '100%',
        'symbol': this.symbolPair,
        'interval': '1',
        'theme': 'light',
        'timezone': 'Etc/UTC',
        'style': '1',
        'locale': 'en',
        'toolbar_bg': '#f1f3f6',
        'enable_publishing': false,
        'hide_top_toolbar': true,
        'hide_legend': true,
        'save_image': false,
        'container_id': 'tradingview_f2d64'
      }
    );
  }

}
