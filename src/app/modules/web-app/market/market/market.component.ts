/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/naming-convention */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { ApexOptions } from 'ng-apexcharts';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { MarketService } from './market.service';
@Component({
    selector: 'crypto',
    templateUrl: './market.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketComponent implements OnInit, OnDestroy {
    appConfig: any;
    daliyData = [];
    currencies = ['EUR', 'USD'];
    selectedCurrency = 'EUR';
    symbolPair = 'BNBEUR';
    symbols$: Observable<any[]>;
    data: any;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    isRealTimeTrade = new BehaviorSubject<boolean>(true);
    watchlistChartOptions: ApexOptions = {};
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _marketService: MarketService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {

                // Set the drawerMode and drawerOpened if 'lg' breakpoint is active
                if (matchingAliases.includes('lg')) {
                    this.drawerMode = 'side';
                    this.drawerOpened = true;
                }
                else {
                    this.drawerMode = 'over';
                    this.drawerOpened = false;
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the data
        this._marketService.data$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {

                let txt: any;
                // eslint-disable-next-line guard-for-in
                for (const x in data) {
                    txt = data[x];
                    const chatData = [];
                    console.log(txt);
                    txt.chartData.forEach((element) => {
                        // console.log(element);
                        // Create a new JavaScript Date object based on the timestamp
                        // multiplied by 1000 so that the argument is in milliseconds, not seconds.
                        const date = new Date(element.x * 1000);
                        // Hours part from the timestamp
                        const hours = date.getHours();
                        // Minutes part from the timestamp
                        const minutes = '0' + date.getMinutes();
                        // Seconds part from the timestamp
                        const seconds = '0' + date.getSeconds();
                        chatData.push({
                            x: hours + ':' + minutes.substr(-2),
                            y: element.y
                        });
                    });
                    const tokenDaliyData = {
                        title: txt.coinFullName,
                        iso: txt.coinName,
                        amount: txt.price,
                        trend: {
                            dir: 'up',
                            amount: 2.35
                        },
                        series: [
                            {
                                name: 'Price',
                                data: chatData
                            }
                        ]
                    };
                    this.daliyData.push(tokenDaliyData);
                    console.log(this.daliyData, 'sdfsdf');
                }
                console.log(data);
                // Store the data
                this.data = data;

                // Prepare the chart data
                this._prepareChartData();
            });


        // Get the symbols
        this._marketService.getSymbols(this.selectedCurrency).subscribe();
        this.symbols$ = this._marketService.symbols$;
    }

    onSelectCurrency(currency: string): void {
        console.log(currency);
        this.selectedCurrency = currency;
        this.mapRealTimeTradeData(`BNB${currency}`,'load');
        this._marketService.getSymbols(this.selectedCurrency).subscribe();
    }

    mapRealTimeTradeData(symbolPair: string,from): void {
        // console.log(symbolPair.slice(0, -6));
        this.isRealTimeTrade.next(false);
        if(from === 'load'){
            this.symbolPair = symbolPair;
        }else{
            this.symbolPair = symbolPair.slice(0, -6);
        }
        setTimeout(() => {
            this.isRealTimeTrade.next(true);
        }, 100);
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Prepare the chart data from the data
     *
     * @private
     */
    private _prepareChartData(): void {

        // Watchlist options
        this.watchlistChartOptions = {
            chart: {
                animations: {
                    enabled: false
                },
                width: '100%',
                height: '100%',
                type: 'line',
                sparkline: {
                    enabled: true
                }
            },
            colors: ['#A0AEC0'],
            stroke: {
                width: 2,
                curve: 'smooth'
            },
            tooltip: {
                enabled: false
            },
            xaxis: {
                type: 'category'
            }
        };
    }
}
