/* eslint-disable @typescript-eslint/naming-convention */
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'app/services/common/user/user.service';
import { AccountDetails } from 'app/services/common/user/user.types';
import { Observable, Subject } from 'rxjs';
import { WalletService } from '../../wallet.service';
import { SwapConfirmPopupComponent } from '../confirm-popup/confirm.component';
import { SwapComponent } from '../swap.component';
import { SwapService } from '../swap.service';

@Component({
  selector: 'swap-buy',
  templateUrl: './buy.component.html'
})
export class BuyComponent implements OnInit, AfterViewInit, OnDestroy {

    wallets$: Observable<any[]>;
    accounts$: Observable<AccountDetails>;
    getAllWallets$: Observable<any[]>;
    fromAssets = [];
    toAssets = [];
    walletDesign: any;
    getAssetMinValidation: any;
    selectedBtn = 'buy';
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
    buyFromData = {
        exchangeFeePercentage:'',
        selectedAmount:'',
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
        errorMsg:'',
        PrimaryCurrency:'',
        primaryCurrnecySymble:''
    };
    buyToData = {
        oneCoinEqlToEUR:'',
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
        totalAmountInEur:'',
        errorMsg:'',
        networks:[]
    };

    asseteAmount: string;

    buyForm = this._formBuilder.group({
        from: this._formBuilder.group({
            wallet: [''],
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



  constructor(private _formBuilder: UntypedFormBuilder,
    private _walletService: WalletService,
    private changeDetectorRef: ChangeDetectorRef,
    private _userService: UserService,
    private _swapService: SwapService,
    public _swapComponent: SwapComponent,
    private _matDialog: MatDialog,
) {

}

  ngOnInit(): void {
       // Get the Data
       this._swapService.getAssetMinValidation().subscribe((value)=>{
        this.getAssetMinValidation = value;
        this.changeDetectorRef.detectChanges();
    });
       this.wallets$ = this._walletService.wallets$;
       this.walletDesign = this._walletService.walletDesign$;

       // Get the products
       this.accounts$ = this._userService.account$;
       this.buy();
  }


  buy(): void {
      this.accounts$.subscribe((account: AccountDetails) => {
          this.buyForm.get('from').get('wallet').setValue(account[0], { onlySelf: true, emitEvent: true });
          this.buyAvalableAmount = account[0].availableBalance;
          this.buyFromData.selectedAccount = account[0];
          this.buyForm.get('from').patchValue({
              amount: account[0].availableBalance
          });
        //   this.getAllFromData();
      });

      this.wallets$.subscribe((w) => {
          this.PrimaryCurrency = w[0]?.totalPortfolioBalance?.currency;
          this.primaryCurrnecySymble = w[0]?.totalPortfolioBalance?.symbol;
          this.buyFromData.PrimaryCurrency = w[0]?.totalPortfolioBalance?.currency;
          this.buyFromData.primaryCurrnecySymble = w[0]?.totalPortfolioBalance?.symbol;
          if (!!w.length) {
              setTimeout(() => {
                  this.buyForm.get('to').get('wallet').setValue(w[0], { onlySelf: true, emitEvent: true });
              }, 1000);
          }
      });
      this.buyForm.get('to').get('wallet').valueChanges.subscribe((val) => {
          this.buyToData.toWalletId = val.walletId;
          this.buyToData.toWalletName = val.walletName;
          if (val) {
              this.toAssets = val?.asset || [];
              const assetTemp = this.toAssets.length ? this.toAssets[0] : [];
              this.buyForm.get('to').patchValue({
                  asset: assetTemp,
                  amount: assetTemp.availableAmount
              });
          }
      });

      this.buyForm.get('to').get('asset').valueChanges.subscribe((val) => {
          if (val) {
              this.buyToData.toAddress = val.address;
              this.buyToData.coinImage = val.coinImage;
              this.buyToData.selectedAssetsSymbol = val.testnetName;
              this.buyToData.walletType = val.walletType;
              this.buyToData.networks = val.network;
              this.getAllFromData();
              this.changeDetectorRef.detectChanges();
          }
      });
  }
  buyButtonValidate(): void {
      this._swapService.getFeePercentageMinMax().subscribe((value)=>{
          this.buyFromData.errorMsg = '';
          if(Number(value.data.minLimit) <= this.buyForm.get('from').get('amount').value){
              this.ProceedFromValidate = true;
          }else{
              this.ProceedFromValidate = false;
              this.buyFromData.errorMsg = 'Minimum Input is ' + value.data.minLimit;

          }
          if(Number(value.data.maxLimit) >= this.buyForm.get('from').get('amount').value){
              this.ProceedFromValidate = true;
          }else{
              this.ProceedFromValidate = false;
              this.buyFromData.errorMsg = 'Maximum Input is ' + value.data.maxLimit;
          }
          if(Number(this.buyAvalableAmount) >= this.buyForm.get('from').get('amount').value){
              this.ProceedFromValidate = true;
          }else{
              this.ProceedFromValidate = false;
              this.buyFromData.errorMsg = 'Avalable Amount ' + this.buyAvalableAmount;
          }
          this.changeDetectorRef.detectChanges();
      });
  }

  buyAssetMinValidation(): void{
      const network = this.buyToData.networks.length===1?this.buyToData.networks[0]:'BSC';
      const value = this.getAssetMinValidation;
      this.buyToData.selectedAssetsNetwork = network;
      value.data.filter((find)=>{
        if(find.symbol === this.buyToData.selectedAssetsSymbol && find.network === network){
            console.log(find);
            if(Number(find.minCount) <= this.buyForm.get('to').get('amount').value){
                this.ProceedToValidate = true;
                this.buyToData.errorMsg = '';
            }else{
                this.ProceedToValidate = false;
                this.buyToData.errorMsg = 'Minimum Assets value is ' + find.minCount;
            }
        }
    });
    this.changeDetectorRef.detectChanges();
  }
  getAllFromData(): void {
    this.getBuyExchangeCalc('from');
    this.buyButtonValidate();
  }
  getAllToData(): void {
    this.buyGetPriceRespectToPair('to');
  }
  // buy =================================
  buyInputOnKeyPress(gettingFrom): void {
      if(gettingFrom === 'from'){
         this.getAllFromData();
         this.buyButtonValidate();
      }else{
        this.getBuyExchangeCalcEUR();
      }
    //   this.buyFromData.selectedAmount = this.buyForm.get('from').get('amount').value;
  }
  getBuyExchangeCalc(fromto): void {
      if(fromto === 'from'){
          const fromSymbleToGetPrice = {
              'primaryCurrency': this.PrimaryCurrency,
              'side': 'buy',
              'symbol': this.PrimaryCurrency +'/'+ this.buyToData.selectedAssetsSymbol,
              'value': this.buyForm.get('from').get('amount').value,
              'inputFieldType':'FIAT'
            };
            console.log(this.buyForm.get('from').get('amount').value);
            const inputValue = Number(this.buyForm.get('from').get('amount').value);
            if(inputValue){
                this._swapService.getBuyExhangeCalculation(fromSymbleToGetPrice).subscribe((price)=>{
                    if(price.message !== 'OK'){
                        this.buyFromData.amountRespectToTwo = '';
                        this.buyFromData.minimumSwapLimitMsg = price.message;
                        this.changeDetectorRef.detectChanges();
                    }else{
                        this.buyFromData.minimumSwapLimitMsg = '';
                        this.buyFromData.amountRespectToTwo = price.data.amountToGive;
                        this.buyForm.get('to').get('amount').setValue(price.data.amountToGive);
                        this.buyGetExchangeFee('from');
                        this.buyGetPriceRespectToPair('from');
                        this.getBuyExchangeCalc2('from');
                        this.buyAssetMinValidation();
                        this.changeDetectorRef.detectChanges();
                    }
                });
            }else{
                this.buyForm.get('to').get('amount').setValue(0);
                this.buyAssetMinValidation();
            }
      }
  }
  getBuyExchangeCalc2(fromto): void {
      if(fromto === 'from'){
          const fromSymbleToGetPrice = {
              'primaryCurrency': this.PrimaryCurrency,
              'side': 'buy',
              'symbol': this.buyToData.selectedAssetsSymbol+'/'+this.PrimaryCurrency,
              'value': this.buyForm.get('to').get('amount').value,
              'inputFieldType':'CRYPTO'
            };
            const inputValue = Number(this.buyForm.get('from').get('amount').value);
            if(inputValue){
                this._swapService.getBuyExhangeCalculation(fromSymbleToGetPrice).subscribe((price)=>{
                    if(price.message !== 'OK'){
                        this.buyFromData.amountRespectToTwo = '';
                        this.buyFromData.minimumSwapLimitMsg = price.message;
                        this.changeDetectorRef.detectChanges();
                    }else{
                        this.buyFromData.oacurrentPrice = price.data.thirdPartyPrice;
                        this.changeDetectorRef.detectChanges();
                    }
                });
            }else{
                this.buyForm.get('to').get('amount').setValue(0);
                this.buyAssetMinValidation();
            }
      }
  }
  getBuyExchangeCalcEUR(): void {

    const fromSymbleToGetPrice = {
        'primaryCurrency': this.PrimaryCurrency,
        'side': 'buy',
        'symbol': this.buyToData.selectedAssetsSymbol+'/'+this.PrimaryCurrency,
        'value': this.buyForm.get('to').get('amount').value,
        'inputFieldType':'CRYPTO'
        };
        const inputValue = Number(this.buyForm.get('to').get('amount').value);
        console.log(this.buyForm.get('to').get('amount').value);
        if(inputValue){
            this._swapService.getBuyExhangeCalculation(fromSymbleToGetPrice).subscribe((price)=>{
                if(price.message !== 'OK'){
                    this.buyFromData.amountRespectToTwo = '';
                    this.buyFromData.minimumSwapLimitMsg = price.message;
                    this.changeDetectorRef.detectChanges();
                }else{
                    this.buyFromData.minimumSwapLimitMsg = '';
                    this.buyFromData.amountRespectToTwo = price.data.amountToGive;
                    this.buyForm.get('from').get('amount').setValue(price.data.amountToGive);
                    this.buyGetExchangeFee('from');
                    this.buyGetPriceRespectToPair('from');
                    this.getBuyExchangeCalc2('from');
                    this.buyAssetMinValidation();
                    this.buyButtonValidate();
                    this.changeDetectorRef.detectChanges();
                }
            });
        }else{
            this.buyForm.get('from').get('amount').setValue(0);
            this.buyAssetMinValidation();
        }
        this.changeDetectorRef.detectChanges();
}

//   getBuyPriceRespectToPair(fromto): void {
//       if(fromto === 'from'){
//           const fromSymbleToGetPrice = {
//               'symbol': this.fromData.selectedAssetsSymbol+'/'+'EUR'
//             };
//            this._swapService.getPriceRespectToPair(fromSymbleToGetPrice).subscribe((price)=>{
//               this.buyFromData.amountRespectToOne = price.data.totalQuantity;
//               this.changeDetectorRef.detectChanges();
//           });
//       }else{
//       }
//   }
  buyGetExchangeFee(fromto): void {
      if(fromto === 'from'){
          const fromSymbleToGetPrice = {
              'amount':  this.buyForm.get('to').get('amount').value,
            };
            if(fromSymbleToGetPrice.amount){
                this._swapService.getBuyExchangeFee(fromSymbleToGetPrice).subscribe((price)=>{
                    if(price.message !== 'OK'){
                        this.buyFromData.amountRespectToTwo = '';
                        this.buyFromData.minimumSwapLimitMsg = price.message;
                        this.changeDetectorRef.detectChanges();
                    }else{
                        this.buyFromData.exchangeFee = price.data.exchangeFee;
                        this.buyFromData.exchangeFeePercentage = price.data.exchangeFeePercentage;
                        this.buyFromData.totalAmount = price.data.totalAmount;
                        this.changeDetectorRef.detectChanges();
                    }
                });
            }
      }
      if(fromto === 'from'){
        const fromSymbleToGetPrice = {
            'amount':  this.buyForm.get('from').get('amount').value,
          };
          if(fromSymbleToGetPrice.amount){
              this._swapService.getBuyExchangeFee(fromSymbleToGetPrice).subscribe((price)=>{
                  if(price.message !== 'OK'){
                      this.changeDetectorRef.detectChanges();
                  }else{
                      this.fromExchangeFee.amount = price.data.amount;
                      this.fromExchangeFee.exchangeFee = price.data.exchangeFee;
                      this.fromExchangeFee.exchangeFeePercentage = price.data.exchangeFeePercentage;
                      this.fromExchangeFee.totalAmount = price.data.totalAmount;
                      this.changeDetectorRef.detectChanges();
                  }
              });
          }
    }
  }
  buyGetPriceRespectToPair(fromto): void {
      if(fromto === 'from'){
          const fromSymbleToGetPrice = {
              'symbol': this.buyToData.selectedAssetsSymbol+'/'+'EUR'
            };
           this._swapService.getPriceRespectToPair(fromSymbleToGetPrice).subscribe((price)=>{
              this.buyFromData.amountRespectToOne = price.data.totalQuantity;
              this.changeDetectorRef.detectChanges();
          });
      }else{
          const fromSymbleToGetPrice = {
              'symbol': this.buyToData.selectedAssetsSymbol+'/'+'EUR'
            };
            this._swapService.getPriceRespectToPair(fromSymbleToGetPrice).subscribe((price)=>{
              this.buyToData.oneCoinEqlToEUR = price.data.totalQuantity;
              this.changeDetectorRef.detectChanges();
          });
      }
  }
// end buy =================================

//   onSwitch(): void {
//       const fromData = this.swapForm.get('from').value;
//       this.swapForm.patchValue({ from: { ...this.swapForm.get('to').value }, to: { ...fromData } });
//   }

  onBuy(): void {
    // eur to btc from swap compnent
    // {
    //     "amountRespectToOne": "20928.64927874",
    //     "amountToCreditOrDebit": "1029.64",
    //     "coinImage": "https://scallop-bucket.s3.eu-west-1.amazonaws.com/upload_file/EUR_ACCOUNT.png",
    //     "exchangeFee": "0.000730375134000000",
    //     "fromAccountId": "A21A1AVG",
    //     "fromAccountName": "ANNA KAUR KRISTIANSEN",
    //     "fromBic": "MODRIE22XXX",
    //     "fromIban": "IE58MODR99035501697641",
    //     "oacurrentPrice": "21128.40986814",
    //     "quantity": "0.0486916756",
    //     "side": "buy",
    //     "subType": "MARKET_BUY",
    //     "symbol": "BTC/EUR",
    //     "toAddress": "112h1aVNWNfn7mn8zEw5QeDFry4eSbLrMX",
    //     "toWalletId": "1566279497682685954",
    //     "type": "BEST_RATE"
    // }
    // eur to btc from buy compnent
    // {
    //     "amountRespectToOne": "20922.35415379",
    //     "amountToCreditOrDebit": "1029.64",
    //     "coinImage": "https://scallop-bucket.s3.eu-west-1.amazonaws.com/upload_file/EUR_ACCOUNT.png",
    //     "exchangeFee": "0.000730684026000000",
    //     "fromAccountId": "A21A1AVG",
    //     "fromAccountName": "ANNA KAUR KRISTIANSEN",
    //     "fromBic": "MODRIE22XXX",
    //     "fromIban": "IE58MODR99035501697641",
    //     "oacurrentPrice": "21121.19228519",
    //     "quantity": "0.0487122684",
    //     "side": "buy",
    //     "subType": "MARKET_BUY",
    //     "symbol": "BTC/EUR",
    //     "toAddress": "112h1aVNWNfn7mn8zEw5QeDFry4eSbLrMX",
    //     "toWalletId": "1566279497682685954",
    //     "type": "BEST_RATE"
    // }
      const account: any = this.buyFromData.selectedAccount;
      const swapFinalpaylod: any = {
          'amountRespectToOne': this.buyFromData.amountRespectToOne,
          'amountToCreditOrDebit': this.buyForm.get('from').get('amount').value,
          'coinImage': account.imageUrl,
          'exchangeFee': this.buyFromData.exchangeFee,
          // 'feesIncurrency': Number(this.buyFromData.amountRespectToOne) * Number(this.buyFromData.exchangeFee),
          'fromAccountId': account.ledgerId,
          'fromAccountName': account.accountName,
          'fromBic': account.bic,
          'fromIban': account.iban,
          'oacurrentPrice': this.buyFromData.oacurrentPrice,
          'quantity':  this.buyForm.get('to').get('amount').value ,
          'side': 'buy',
          'subType': 'MARKET_BUY',
          'symbol': this.buyToData.selectedAssetsSymbol+'/EUR',
          'toAddress': this.buyToData.toAddress,
          'toWalletId': this.buyToData.toWalletId,
          'type': 'BEST_RATE'
      };
      const finalDataObject = {
          from:this.buyFromData,
          to:this.buyToData,
          oparationType : 'buy',
          finalObject:swapFinalpaylod,
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
                    this.buyFromData.errorMsg = 'unable to process your transaction daily limit exceeded';
                    this.changeDetectorRef.detectChanges();
                }
            });
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
