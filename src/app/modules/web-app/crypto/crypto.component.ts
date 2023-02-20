/* eslint-disable */
import { Component, OnInit, AfterViewInit } from '@angular/core';
declare const TradingView: any;

@Component({
    selector       : 'transaction',
    templateUrl    : './crypto.component.html',
})
export class TransactionComponent implements OnInit, AfterViewInit
{
    constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(){

    new TradingView.widget(
      {
      "title": "Stocks",
      "width": 770,
      "height": 450,
      "locale": "in",
      "showSymbolLogo": true,
      "symbolsGroups": [],
      "colorTheme": "light",
      "container_id": "tradingview_f2d64"
    }
    );
  }
}