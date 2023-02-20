import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AccountService } from '../account.service';


@Component({
    selector     : 'exchange-fiat',
    templateUrl  : './exchange.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ExchangeFiatComponent implements OnInit
{
    oparationStatus = 'exchange';
    selectedAccountDetails: any;
    otherCurrencyExchange: any;
    /**
     * Constructor
     */
    constructor(
        public matDialogRef: MatDialogRef<ExchangeFiatComponent>,
        private _accountService: AccountService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
         // console.log(this._accountService.)
         this._accountService.exchangeAmount$.subscribe((otherCurrencyExchange)=>{
            this.otherCurrencyExchange = otherCurrencyExchange;
            console.log(otherCurrencyExchange);
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Save and close
     */
     close(): void
    {
        // Close the dialog
        this.matDialogRef.close();
    }
    continue(): void {
        // console.log(this.otherCurrencyExchange.finalObject);
        this.oparationStatus = 'processing';
        this._accountService.convertBalance(this.otherCurrencyExchange.finalObject).subscribe((response) => {
            if(response.status === 200){
                this.oparationStatus = 'success';
            }else{
                this.oparationStatus = 'failed';
            }
            // console.log(response);
        }, () => this.oparationStatus = 'failed');
    }
}
