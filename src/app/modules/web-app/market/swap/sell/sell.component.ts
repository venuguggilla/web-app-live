
/* eslint-disable @typescript-eslint/naming-convention */
import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation ,ChangeDetectorRef} from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'app/services/common/user/user.service';
import { AccountDetails } from 'app/services/common/user/user.types';
import { Observable, Subject } from 'rxjs';
import { WalletService } from '../../wallet.service';
import { SwapConfirmPopupComponent } from '../confirm-popup/confirm.component';
import { SwapService } from '../swap.service';

@Component({
  selector: 'swap-sell',
  templateUrl: './sell.component.html'
})
export class SellComponent implements OnInit, AfterViewInit, OnDestroy {

    wallets$: Observable<any[]>;
    accounts$: Observable<AccountDetails>;
    getAllWallets$: Observable<any[]>;
    fromAssets = [];
    toAssets = [];
    walletDesign: any;
    selectedBtn = 'buy';
    ProceedSellValidate = false;
    ProceedFromValidate = false;
    ProceedToValidate = false;
    swapTO = '';
    buyAvalableAmount = '';
    primaryCurrnecySymble = '';
    PrimaryCurrency = '';
    quntity = 1;
    types = ['one','sjs'];
    fromExchangeFee ={
        amount: '',
        exchangeFee: '',
        exchangeFeePercentage: '',
        totalAmount: ''
    };
    sellFromData = {
        asseteAmount : '',
        selectedAssetsSymbol : '',
        selectedAssetsNetwork : '',
        amountRespectToOne:'',
        convertedToToFrom:'',
        walletType:'',
        coinImage:'',
        toAddress: '',
        toWalletId: '',
        toWalletName: '',
        amountRespectToTwo: '',
        oacurrentPrice: '',
        totalAmount:'',
        exchangeFeePercentage:'',
        exchangeFee:'',
        minimumSwapLimitMsg: '',
        errorMsg: '',
        networks: [],
        PrimaryCurrency:'',
        primaryCurrnecySymble:''
    };
    sellToData = {
        exchangeFeePercentage:'',
        totalAmount:'',
        selectedAccount:{},
        asseteAmount : '',
        selectedAssetsSymbol : '',
        minimumBalance:'',
        minimumSwapLimitMsg:'',
        networks:[],
        walletType:'',
        coinImage:'',
        amountRespectToOne: '',
        amountRespectToTwo: '',
        amountToCreditOrDebit: '',
        exchangeFee: '',
        fromAddress: '',
        fromWalletId: '',
        fromWalletName: '',
        quantity: '',
        oacurrentPrice:'',
        oneCoinEqlToEUR:'',
        totalAmountInEur:'',
        errorMsg: ''
    };
    asseteAmount: string;


    sellForm = this._formBuilder.group({
        from: this._formBuilder.group({
            wallet: [''],
            asset: [''],
            amount: [''],
        }),
        to: this._formBuilder.group({
            wallet: [''],
            asset: [''],
            amount: [''],
        }),
    });

    buyToAssets: any;
    sellToAssets: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();


    /**
     * Constructor
     */
    constructor(private _formBuilder: UntypedFormBuilder,
        private _walletService: WalletService,
        private changeDetectorRef: ChangeDetectorRef,
        private _userService: UserService,
        private _swapService: SwapService,
        private _matDialog: MatDialog,
    ) {

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Get the Data
        this.wallets$ = this._walletService.wallets$;
        this.walletDesign = this._walletService.walletDesign$;

        // Get the products
        this.accounts$ = this._userService.account$;
        this.sell();
    }

    sell(): void {
        this.accounts$.subscribe((account: AccountDetails) => {
            this.sellForm.get('to').get('wallet').setValue(account[0], { onlySelf: true, emitEvent: true });
            this.buyAvalableAmount = account[0].availableBalance;
            this.sellToData.selectedAccount = account[0];
        });

        this.wallets$.subscribe((w) => {
            this.PrimaryCurrency = w[0]?.totalPortfolioBalance?.currency;
            this.primaryCurrnecySymble = w[0]?.totalPortfolioBalance?.symbol;
            this.sellFromData.PrimaryCurrency = w[0]?.totalPortfolioBalance?.currency;
            this.sellFromData.primaryCurrnecySymble = w[0]?.totalPortfolioBalance?.symbol;
            if (!!w.length) {
                setTimeout(() => {
                    this.sellForm.get('from').get('wallet').setValue(w[0], { onlySelf: true, emitEvent: true });
                }, 1000);
            }
        });





        this.sellForm.get('from').get('wallet').valueChanges.subscribe((val) => {
            this.sellFromData.toWalletId = val.walletId;
            this.sellFromData.toWalletName = val.walletName;
            if (val) {
                this.sellToAssets = val?.asset || [];
                const assetTemp = this.sellToAssets.length ? this.sellToAssets[0] : [];
                this.sellForm.get('from').patchValue({
                    asset: assetTemp,
                    amount: assetTemp.availableAmount
                });
            }
            this.sellGetExchangeFee('from');
            this.sellGetPriceRespectToPair('from');
        });

        this.sellForm.get('from').get('asset').valueChanges.subscribe((val) => {
            if (val) {
                console.log('vaaal', val);
                this.sellForm.get('from').patchValue({ amount: val.availableAmount });
                this.sellFromData.asseteAmount = val.availableAmount;
                this.sellFromData.toAddress = val.address;
                this.sellFromData.coinImage = val.coinImage;
                this.sellFromData.selectedAssetsSymbol = val.testnetName;
                this.sellFromData.walletType = val.walletType;
                this.sellFromData.networks = val.network;
                // this.buyGetExchangeFee('from');
                this.sellGetExchangeFee('from');
                this.getSellExchangeCalc('from');
                this.sellGetPriceRespectToPair('from');
                this.changeDetectorRef.detectChanges();
            }
        });
    }


    getSellOnKeyPress(gettingFrom): void {
        if(gettingFrom === 'from'){
            this.getSellExchangeCalc(gettingFrom);
            this.sellGetPriceRespectToPair(gettingFrom);
        }else{
            this.getSellExchangeCalc(gettingFrom);
        }
    }



    sellAssetMinValidation(): void{
        const network = this.sellFromData.networks.length===1?this.sellFromData.networks[0]:'BSC';
        this.sellFromData.selectedAssetsNetwork = network;
        this._swapService.getAssetMinValidation().subscribe((value)=>{
            value.data.filter((find)=>{
                if(find.symbol === this.sellFromData.selectedAssetsSymbol && find.network === network){
                    console.log(find);
                    if(Number(find.minCount) <= this.sellForm.get('from').get('amount').value){
                        this.ProceedSellValidate = true;
                        this.sellFromData.errorMsg = '';
                        this.changeDetectorRef.detectChanges();
                    }else{
                        this.ProceedSellValidate = false;
                        this.sellFromData.errorMsg = 'Minimum Assets input value is ' + find.minCount;
                        this.changeDetectorRef.detectChanges();
                        return;
                    }
                    if(Number(this.sellFromData.asseteAmount) >= this.sellForm.get('from').get('amount').value){
                        this.ProceedSellValidate = true;
                        this.sellFromData.errorMsg = '';
                        this.changeDetectorRef.detectChanges();
                    }else{
                        this.ProceedSellValidate = false;
                        this.sellFromData.errorMsg  = 'Avalable Assets value ' + this.sellFromData.asseteAmount;
                        this.changeDetectorRef.detectChanges();
                        return;
                    }
                }
            });
        });
    }

    sellButtonValidate(): void {
        console.log(this.sellForm.get('to').get('amount').value);
        this.sellToData.errorMsg = '';
        this._swapService.getFeePercentageMinMax().subscribe((value)=>{
            if(Number(value.data.minLimit) <= this.sellForm.get('to').get('amount').value){
                this.ProceedFromValidate = true;
                this.changeDetectorRef.detectChanges();
            }else{
                this.ProceedFromValidate = false;
                this.sellToData.errorMsg = 'Minimum Input is ' + value.data.minLimit;
                this.changeDetectorRef.detectChanges();
                return;
            }
            if(Number(value.data.maxLimit) >= this.sellForm.get('to').get('amount').value){
                this.ProceedFromValidate = true;
                this.changeDetectorRef.detectChanges();
            }else{
                this.ProceedFromValidate = false;
                this.sellToData.errorMsg = 'Maximum Input is ' + value.data.maxLimit;
                this.changeDetectorRef.detectChanges();
                return;
            }
        });
    }

    // buyAssetMinValidation(): void{
    //     const network = this.sellToData.networks.length===1?this.sellToData.networks[0]:'BSC';
    //     const value = this.getAssetMinValidation;
    //     value.data.filter((find)=>{
    //       if(find.symbol === this.sellToData.selectedAssetsSymbol && find.network === network){
    //           console.log(find);
    //           if(Number(find.minCount) <= this.sellForm.get('to').get('amount').value){
    //               this.ProceedToValidate = true;
    //               this.sellToData.errorMsg = '';
    //           }else{
    //               this.ProceedToValidate = false;
    //               this.sellToData.errorMsg = 'Minimum Assets value is ' + find.minCount;
    //           }
    //       }
    //   });
    //   this.changeDetectorRef.detectChanges();
    // }

    sellGetPriceRespectToPair(fromto): void {
        if(fromto === 'from'){
            const fromSymbleToGetPrice = {
                'symbol': this.sellFromData.selectedAssetsSymbol+'/'+'EUR'
              };
             this._swapService.getPriceRespectToPair(fromSymbleToGetPrice).subscribe((price)=>{
                this.sellFromData.amountRespectToOne = price.data.totalQuantity;
                this.changeDetectorRef.detectChanges();
            });
        }else{
            const fromSymbleToGetPrice = {
                'symbol': this.sellToData.selectedAssetsSymbol+'/'+'EUR'
              };
              this._swapService.getPriceRespectToPair(fromSymbleToGetPrice).subscribe((price)=>{
                this.sellToData.oneCoinEqlToEUR = price.data.totalQuantity;
                this.changeDetectorRef.detectChanges();
            });
        }
    }

    getSellExchangeCalc(fromto): void {
        if(fromto === 'from'){
            const fromSymbleToGetPrice = {
                'primaryCurrency': this.PrimaryCurrency,
                'side': 'sell',
                'symbol': this.sellFromData.selectedAssetsSymbol +'/'+this.PrimaryCurrency,
                'value': this.sellForm.get('from').get('amount').value,
                'inputFieldType':'CRYPTO'
            };
            this._swapService.getBuyExhangeCalculation(fromSymbleToGetPrice).subscribe((price)=>{
                if(price.message !== 'OK'){
                    this.sellFromData.minimumSwapLimitMsg = price.message;
                    this.changeDetectorRef.detectChanges();
                }else{
                    this.sellFromData.minimumSwapLimitMsg = '';
                    this.sellFromData.amountRespectToTwo = price.data.amountToGive;
                    this.sellFromData.oacurrentPrice = price.data.thirdPartyPrice;
                    this.sellToData.totalAmountInEur = price.data.amountToGive;
                    this.sellForm.get('to').get('amount').setValue(price.data.amountToGive);
                    this.sellGetExchangeFee('from');
                    this.sellButtonValidate();
                    this.sellAssetMinValidation();
                    this.changeDetectorRef.detectChanges();
                }
            });
        }else{
            const fromSymbleToGetPrice = {
                'primaryCurrency': this.PrimaryCurrency,
                'side': 'sell',
                'symbol': this.PrimaryCurrency+'/'+this.sellFromData.selectedAssetsSymbol,
                'value': this.sellForm.get('to').get('amount').value,
                'inputFieldType':'FIAT'
            };
            this._swapService.getBuyExhangeCalculation(fromSymbleToGetPrice).subscribe((price)=>{
                if(price.message !== 'OK'){
                    this.sellFromData.minimumSwapLimitMsg = price.message;
                    this.changeDetectorRef.detectChanges();
                }else{
                    this.sellFromData.minimumSwapLimitMsg = '';
                    this.sellFromData.amountRespectToTwo = price.data.amountToGive;
                    this.sellFromData.oacurrentPrice = price.data.thirdPartyPrice;
                    this.sellToData.totalAmountInEur = price.data.amountToGive;
                    this.sellForm.get('from').get('amount').setValue(price.data.amountToGive);
                    this.sellAssetMinValidation();
                    this.sellButtonValidate();
                    this.changeDetectorRef.detectChanges();
                }
            });
        }
    }

    sellGetExchangeFee(fromto): void {
        if(fromto === 'from'){
            const fromSymbleToGetPrice = {
                'amount':  this.sellForm.get('from').get('amount').value,
            };
            this._swapService.getBuyExchangeFee(fromSymbleToGetPrice).subscribe((price)=>{
                if(price.message !== 'OK'){
                    this.sellFromData.amountRespectToTwo = '';
                    this.sellFromData.minimumSwapLimitMsg = price.message;
                    this.changeDetectorRef.detectChanges();
                }else{
                    this.sellFromData.exchangeFee = price.data.exchangeFee;
                    this.sellFromData.exchangeFeePercentage = price.data.exchangeFeePercentage;
                    this.sellFromData.totalAmount = price.data.totalAmount;
                    this.fromExchangeFee.amount = price.data.amount;
                    this.fromExchangeFee.exchangeFee = price.data.exchangeFee;
                    this.fromExchangeFee.exchangeFeePercentage = price.data.exchangeFeePercentage;
                    this.fromExchangeFee.totalAmount = price.data.totalAmount;
                    this.changeDetectorRef.detectChanges();
                }
            });
        }
    }



    onSell(): void {
        // btc to eur from swap compnent
        // {
        //     "amountRespectToOne": "20942.39206003",
        //     "amountToCreditOrDebit": "90.8256883969059079",
        //     "coinImage": "https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=023",
        //     "exchangeFee": "0.0000650539500000",
        //     "fromAddress": "112h1aVNWNfn7mn8zEw5QeDFry4eSbLrMX",
        //     "fromWalletId": "1566279497682685954",
        //     "oacurrentPrice": "21047.63021108",
        //     "quantity": "0.00433693",
        //     "side": "sell",
        //     "subType": "MARKET_SELL",
        //     "symbol": "BTC/EUR",
        //     "toAccountId": "A21A1AVG",
        //     "toAccountName": "ANNA KAUR KRISTIANSEN",
        //     "toBic": "MODRIE22XXX",
        //     "toIban": "IE58MODR99035501697641",
        //     "type": "BEST_RATE"
        // }
        // btc to eur from sell compnent
        // {
        //     "amountRespectToOne": "20958.37048986",
        //     "amountToCreditOrDebit": "90.8977632199078312",
        //     "coinImage": "https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=023",
        //     "exchangeFee": "0.0000650539500000",
        //     "fromAddress": "112h1aVNWNfn7mn8zEw5QeDFry4eSbLrMX",
        //     "fromWalletId": "1566279497682685954",
        //     "oacurrentPrice": "21064.33258074",
        //     "quantity": "0.00433693",
        //     "side": "sell",
        //     "subType": "MARKET_SELL",
        //     "symbol": "BTC/EUR",
        //     "toAccountId": "A21A1AVG",
        //     "toAccountName": "ANNA KAUR KRISTIANSEN",
        //     "toBic": "MODRIE22XXX",
        //     "toIban": "IE58MODR99035501697641",
        //     "type": "BEST_RATE"
        // }
        const account: any = this.sellToData.selectedAccount;
        const sellFinalpaylod: any = {
            'amountRespectToOne': this.sellFromData.amountRespectToOne,
            'amountToCreditOrDebit': this.sellForm.get('to').get('amount').value,
            'coinImage': this.sellFromData.coinImage,
            'exchangeFee': this.sellFromData.exchangeFee,
            'fromAddress': this.sellFromData.toAddress,
            'fromWalletId': this.sellFromData.toWalletId,
            'oacurrentPrice': this.sellFromData.oacurrentPrice,
            'quantity': this.sellForm.get('from').get('amount').value,
            'side': 'sell',
            'subType': 'MARKET_SELL',
            'symbol': this.sellFromData.selectedAssetsSymbol+'/EUR',
            'toAccountId': account.ledgerId,
            'toAccountName': account.accountName,
            'toBic': account.bic,
            'toIban': account.iban,
            'type': 'BEST_RATE'
        };
        // console.log(sellFinalpaylod);
        const finalDataObject = {
            from:this.sellFromData,
            to:this.sellToData,
            oparationType : 'sell',
            finalObject:sellFinalpaylod,
            totalAmount: Number(this.fromExchangeFee.totalAmount),
            fromExchangeFee:this.fromExchangeFee,
            buttonValidation: false
        };
        console.log(finalDataObject);
            const fromSymbleToGetPrice ={
            'currency': 'EUR',
            'orderType': 'BUY',
            'transactionAmount': finalDataObject.totalAmount
        };
        this._swapService.getCheckLimit(fromSymbleToGetPrice).subscribe((checkLimit)=>{
            if(checkLimit.data === false){
                if(Number(this.buyAvalableAmount) >= finalDataObject.totalAmount){
                    finalDataObject.buttonValidation = true;
                    this.swapConfirmPop(finalDataObject);
                    this.changeDetectorRef.detectChanges();
                }else{
                    finalDataObject.buttonValidation = false;
                    this.swapConfirmPop(finalDataObject);
                }
            }else{
                this.ProceedFromValidate = false;
                this.sellToData.errorMsg = 'unable to process your transaction daily limit exceeded';
                this.changeDetectorRef.detectChanges();
            }
        });
        // if(Number(this.sellFromData.asseteAmount) >= finalDataObject.totalAmount){
        //     const fromSymbleToGetPrice ={
        //         'currency': 'EUR',
        //         'orderType': 'BUY',
        //         'transactionAmount': finalDataObject.totalAmount
        //     };
        //     this._swapService.getCheckLimit(fromSymbleToGetPrice).subscribe((checkLimit)=>{
        //         if(checkLimit.data === false){
        //             // this.swapConfirmPop(finalDataObject);
        //             this.changeDetectorRef.detectChanges();
        //         }else{
        //             this.changeDetectorRef.detectChanges();
        //         }
        //     });
        // }else{
        //     this.ProceedFromValidate = false;
        //     this.sellFromData.errorMsg = 'Required Asset Balance ' + finalDataObject.totalAmount;
        // }
            // const fromSymbleToGetPrice ={
            //     'currency': 'EUR',
            //     'orderType': 'BUY',
            //     'transactionAmount': this.sellForm.get('to').get('amount').value
            // };
            // this._swapService.getCheckLimit(fromSymbleToGetPrice).subscribe((checkLimit)=>{
            //     if(checkLimit.data === false){
            //         // this.swapConfirmPop(finalDataObject);
            //         this.changeDetectorRef.detectChanges();
            //     }else{
            //         this.ProceedFromValidate = false;
            //         this.sellFromData.errorMsg = 'Required Assets value ' + finalDataObject.totalAmount;
            //         this.changeDetectorRef.detectChanges();
            //     }
            // });
        // this.swapConfirmPop(finalDataObject);
    }
    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    ngAfterViewInit(): void {
    }
    swapConfirmPop(finalObject): void {
        this._swapService._selectedDetails.next(finalObject);
         // Open the dialog
         const dialogRef = this._matDialog.open(SwapConfirmPopupComponent);
         dialogRef.afterClosed().subscribe((result) => {
             console.log('Compose dialog was closed!');
         });
    }
}

