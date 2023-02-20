import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-mini-trade-view',
  template: `
  <div style="cursor: pointer; overflow: hidden;position: relative;" (click)="selectedView.emit(symbol.symbolFormula)">
    <div class="font-bold text-2xl text-gray-400"
     style="position: absolute;top:2px;height: 45px;padding: 13px 20px;background: #fff;width: calc(100% - 5px);">
      {{symbol.coinFullName}}
    </div>
    <div class="tradingview-widget-container" style="height: 300px;pointer-events: none;" #containerDiv>
        <div class="tradingview-widget-container__widget"></div>
    </div>
  <div>
`,
})

export class MiniTradeViewComponent implements AfterViewInit {
  // wanted to be able to hide the widget if the symbol passed in was invalid (don't love their sad cloud face)
  @ViewChild('containerDiv', { static: false }) containerDiv: ElementRef;
  @Output() selectedView = new EventEmitter();

  // allows for loading with any symbol
  @Input() symbol: any = null;
  @Input() currency: string = null;
  settings: any = {};
  // id for being able to check for errors using postMessage
  widgetId: string = '';

  constructor(private _elRef: ElementRef) {
  }

  ngAfterViewInit(): void {
    // need to do this in AfterViewInit because of the Input
    setTimeout(() => {
      this.widgetId = `${this.symbol.coinFullName}_fundamnetals`;

      // postMessage listener for handling errors
      if (window.addEventListener) {
        window.addEventListener('message', (e: any) => {
          if (e && e.data) {
            // console.log(e);
            const payload = e.data;
            // if the frameElementId is from this component, the symbol was no good and we should hide the widget
            if (payload.name === 'tv-widget-no-data' && payload.frameElementId === this.widgetId) {
              this.containerDiv.nativeElement.style.display = 'none';
            }
          }
        },
          false,
        );
      }

      this.settings = {
        symbol: `${this.symbol.symbolFormula}`,
        width: '100%',
        height: 150,
        locale: 'in',
        dateRange: '12M',
        colorTheme: 'light',
        trendLineColor: 'rgba(41, 98, 255, 1)',
        underLineColor: 'rgba(41, 98, 255, 0.3)',
        underLineBottomColor: 'rgba(41, 98, 255, 0)',
        isTransparent: false,
        largeChartUrl: '',
        autosize: true
      };
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';
      script.async = true;
      script.id = this.widgetId;
      script.innerHTML = JSON.stringify(this.settings);
      this.containerDiv.nativeElement.appendChild(script);
      // const brandingDiv = document.createElement('div');
      // brandingDiv.innerHTML = `
      // <div class="tradingview-widget-container">
      // <div class="tradingview-widget-container__widget"></div>
      // <div class="tradingview-widget-copyright">
      // <a href="https://in.tradingview.com/symbols/${this.symbol}/" rel="noopener" target="_blank">
      // <span class="blue-text">EUR USD rates</span></a> by TradingView</div>`;

    });
  }
}
