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
import { SwapComponent } from '../swap.component';

@Component({
  selector: 'swap-exchange',
  templateUrl: './exchange.component.html'
})
export class ExchangeComponent implements OnInit, AfterViewInit, OnDestroy {


    wallets$: Observable<any[]>;
    accounts$: Observable<AccountDetails>;
    getAllWallets$: Observable<any[]>;
    fromAssets = [];
    toAssets = [];
    walletDesign: any;
    selectedBtn = 'buy';
    ProceedBuyValidate = false;
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
        totalAmount: ''
    };
    fromData = {
        asseteAmount : '',
        selectedAssetsSymbol : '',
        minimumBalance:'',
        minimumSwapLimitMsg:'',
        selectedAssetsNetwork:'',
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
        totalAmountInEur:'',
        errorMsg:''
    };
    toData = {
        asseteAmount : '',
        selectedAssetsSymbol : '',
        amountRespectToOne:'',
        convertedToToFrom:'',
        walletType:'',
        coinImage:'',
        toAddress: '',
        toWalletId: '',
        toWalletName: '',
        totalAmountInEur:'',
        errorMsg:'',
        networks:'',
    };

    asseteAmount: string;
    swapForm = this._formBuilder.group({
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
       this.wallets$ = this._walletService.wallets$;
       this.walletDesign = this._walletService.walletDesign$;

       // Get the products
       this.accounts$ = this._userService.account$;
       this.swap();
  }




  swap(): void {{
      this.accounts$.subscribe((account: AccountDetails) => {
          this.buyAvalableAmount = account[0].availableBalance;
      });

      this.wallets$.subscribe((w) => {
          this.PrimaryCurrency = w[0]?.totalPortfolioBalance?.currency;
          this.primaryCurrnecySymble = w[0]?.totalPortfolioBalance?.symbol;
          if (!!w.length) {
              setTimeout(() => {
                  this.swapForm.get('from').get('wallet').setValue(w[0], { onlySelf: true, emitEvent: true });
                  this.swapForm.get('to').get('wallet').setValue(w[0], { onlySelf: true, emitEvent: true });
              }, 1000);
          }
      });

      // valueChanges
      this.swapForm.get('from').get('wallet').valueChanges.subscribe((val) => {
          this.fromData.fromWalletId = val.walletId;
          this.fromData.fromWalletName = val.walletName;
          if (val) {
              this.fromAssets = val?.asset || [];
              const assetTemp = this.fromAssets.length ? this.fromAssets[0] : [];
              this.swapForm.get('from').patchValue({
                  asset: assetTemp,
                  amount: assetTemp.availableAmount
              });
          }
      });

      this.swapForm.get('from').get('asset').valueChanges.subscribe((val) => {
          if (val) {
              this.swapForm.get('from').patchValue({ amount: val.availableAmount });
              this.fromData.fromAddress = val.address;
              this.fromData.coinImage = val.coinImage;
              this.fromData.asseteAmount = val.availableAmount;
              this.fromData.selectedAssetsSymbol = val.testnetName;
              this.fromData.networks = val.network;
              this.fromData.walletType = val.walletType;
              this.getPriceRespectToPair('from');
            //   this.getExchangeFee('from');
              // if (!!val.fireblockAssetId && this.toAssets.length && this.toAssets.some(a => a.fireblockAssetId === val.fireblockAssetId)) {
              //     const i = this.toAssets.findIndex(a => a.fireblockAssetId === val.fireblockAssetId);
              //     this.toAssets.splice(i, 1);
              //     this.swapForm.get('to').get('asset').setValue(this.toAssets[0] || []);
              // }
          }
      });

      this.swapForm.get('to').get('wallet').valueChanges.subscribe((val) => {
          this.toData.toWalletId = val.walletId;
          this.toData.toWalletName = val.walletName;
          if (val) {
              this.toAssets = val?.asset || [];
              const assetTemp = this.toAssets.length ? this.toAssets[1] : [];
              this.swapForm.get('to').patchValue({
                  asset: assetTemp,
                  amount: 0
              });
          }
      });

      this.swapForm.get('to').get('asset').valueChanges.subscribe((val) => {
          if (val) {
              console.log('val',val);
              this.toData.toAddress = val.address;
              this.toData.coinImage = val.coinImage;
              this.toData.selectedAssetsSymbol = val.testnetName;
              this.toData.walletType = val.walletType;
              this.toData.networks = val.network;
              this.getPriceRespectToPair('to');
              this.getExhangeCalculation('from');
            //   this.getExhangeCalculationEUR('from');
              this.exchangeFromAssetMinValidation();
          }
      });





  }
  }

  getSwapExchangeOnKeyPress(gettingFrom): void {
      if(gettingFrom === 'from'){
        if(Number(this.swapForm.get('from').get('amount').value) !== 0){
            this.getExhangeCalculation('from');
        }else{
            this.swapForm.get('to').patchValue({ amount: 0 });
        }
        this.exchangeFromAssetMinValidation();
      }else{
        if(Number(this.swapForm.get('to').get('amount').value) !== 0){
            this.getExhangeCalculation('to');
        }
        else{
            this.swapForm.get('from').patchValue({ amount: 0 });
        }
        // this.exchangeFromAssetMinValidation();
      }
  }

  getPriceRespectToPair(fromto): void {
      if(fromto === 'from'){
          const fromSymbleToGetPrice = {
              'symbol': this.fromData.selectedAssetsSymbol+'/'+'EUR'
            };
           this._swapService.getPriceRespectToPair(fromSymbleToGetPrice).subscribe((price)=>{
              this.fromData.amountRespectToOne = price.data.totalQuantity;
              this.changeDetectorRef.detectChanges();
          });
      }else{
          const toSymbleToGetPrice = {
              'symbol': this.toData.selectedAssetsSymbol+'/'+'EUR'
            };
           this._swapService.getPriceRespectToPair(toSymbleToGetPrice).subscribe((price)=>{
              this.toData.amountRespectToOne = price.data.totalQuantity;
              this.changeDetectorRef.detectChanges();
          });
      }
  }

  getExhangeCalculation(fromto): void {
      if(fromto === 'from'){
          const fromSymbleToGetPrice = {
              'primaryCurrency': this.PrimaryCurrency,
              'symbol': this.fromData.selectedAssetsSymbol+'/'+this.toData.selectedAssetsSymbol,
              'value': this.swapForm.get('from').get('amount').value
            };
           this._swapService.getExhangeCalculation(fromSymbleToGetPrice).subscribe((price)=>{
             this.swapForm.get('to').patchValue({ amount: price.data.quantity });
             this.fromData.oacurrentPrice = price.data.oneAlphaPrice;
             this.fromData.totalAmountInEur = price.data.fromAssetConversionInPrimaryCurrency;
             this.toData.totalAmountInEur = price.data.toAssetConversionInPrimaryCurrency;
             this.fromData.quantity = price.data.quantity;
             this.getExchangeFee('from');
             this.exchangeToAssetMinValidation();
          });
      }else{
          const fromSymbleToGetPrice = {
              'primaryCurrency': this.PrimaryCurrency,
              'symbol': this.toData.selectedAssetsSymbol+'/'+this.fromData.selectedAssetsSymbol,
              'value': this.swapForm.get('to').get('amount').value
            };
           this._swapService.getExhangeCalculation(fromSymbleToGetPrice).subscribe((price)=>{
            this.swapForm.get('from').patchValue({ amount: price.data.quantity });
             this.fromData.oacurrentPrice = price.data.oneAlphaPrice;
             this.toData.totalAmountInEur = price.data.fromAssetConversionInPrimaryCurrency;
             this.fromData.totalAmountInEur = price.data.toAssetConversionInPrimaryCurrency;
             this.fromData.quantity = price.data.quantity;
             this.exchangeFromAssetMinValidation();
             this.exchangeToAssetMinValidation();

           });
      }
  }
//   getExhangeCalculationEUR(fromto): void {
//       if(fromto === 'from'){
//           const fromSymbleToGetPrice = {
//               'primaryCurrency': this.PrimaryCurrency,
//             //   'side': 'sell',
//               'symbol': this.fromData.selectedAssetsSymbol+'/'+this.PrimaryCurrency,
//               'value': this.swapForm.get('from').get('amount').value
//             };
//            this._swapService.getExhangeCalculation(fromSymbleToGetPrice).subscribe((price)=>{
//              this.swapForm.get('to').patchValue({ amount: price.data.quantity });
//              this.fromData.oacurrentPrice = price.data.oneAlphaPrice;
//             //  this.toData.totalAmountInEur = price.data.fromAssetConversionInPrimaryCurrency;
//              this.fromData.quantity = price.data.quantity;
//           });
//       }else{
//           const fromSymbleToGetPrice = {
//               'primaryCurrency': this.PrimaryCurrency,
//             //   'side': 'sell',
//               'symbol': this.toData.selectedAssetsSymbol+'/'+this.PrimaryCurrency,
//               'value': this.swapForm.get('to').get('amount').value
//             };
//            this._swapService.getExhangeCalculation(fromSymbleToGetPrice).subscribe((price)=>{
//           //    this.swapForm.get('to').patchValue({ amount: price.data.quantity });
//           this.fromData.amountRespectToTwo = price.data.quantity;
//           });
//       }
//   }

  getExchangeFee(fromto): void {
      if(fromto === 'from'){
          const fromSymbleToGetPrice = {
              'coinSymbol':this.fromData.selectedAssetsSymbol,
              'network': this.fromData.networks.length===1?this.fromData.networks[0]:'BSC',
              'amount': this.swapForm.get('from').get('amount').value
            };
           this._swapService.getExchangeFee(fromSymbleToGetPrice).subscribe((price)=>{
              if(price.message !== 'OK'){
                  this.fromData.amountRespectToTwo = '';
                  this.fromData.minimumSwapLimitMsg = price.message;
                  this.changeDetectorRef.detectChanges();
              }else{
                  this.fromData.minimumSwapLimitMsg = '';
                  this.fromData.minimumBalance = price.data.minimumWithdrawal;
                  this.fromData.exchangeFee = price.data.withdrawalFee;
                  this.fromExchangeFee.amount = price.data.amount;
                  this.fromExchangeFee.exchangeFee = price.data.withdrawalFee;
                  this.fromExchangeFee.totalAmount = price.data.totalAmount;
                  this.changeDetectorRef.detectChanges();
              }
          });
      }
  }





  exchangeFromAssetMinValidation(): void{
      const network = this.fromData.networks.length===1?this.fromData.networks[0]:'BSC';
      const amount = Number(this.swapForm.get('from').get('amount').value);
      const symbol = this.fromData.selectedAssetsSymbol;
      this.fromData.selectedAssetsNetwork = network;
      this._swapService.getAssetMinValidation().subscribe((value)=>{
          value.data.filter((find)=>{
              if(find.symbol === symbol && find.network === network){
                  if(Number(find.minCount) <= amount){
                      this.ProceedFromValidate = true;
                      this.fromData.errorMsg = '';
                      this.changeDetectorRef.detectChanges();
                  }else{
                      this.ProceedFromValidate = false;
                      this.fromData.errorMsg = 'Minimum Assets input value is ' + find.minCount;
                      this.changeDetectorRef.detectChanges();
                      return;
                  }
                  if(Number(this.fromData.asseteAmount) >= amount){
                      this.ProceedFromValidate = true;
                      this.fromData.errorMsg = '';
                      this.changeDetectorRef.detectChanges();
                  }else{
                      this.ProceedFromValidate = false;
                      this.fromData.errorMsg  = 'insufficient Assets Balance ' + this.fromData.asseteAmount;
                      this.changeDetectorRef.detectChanges();
                      return;
                  }
              }
          });
      });
  }
  exchangeToAssetMinValidation(): void{
      const network = this.toData.networks.length===1?this.toData.networks[0]:'BSC';
      const amount = Number(this.swapForm.get('to').get('amount').value);
      const symbol = this.toData.selectedAssetsSymbol;
      console.log(network,amount,symbol);
      this._swapService.getAssetMinValidation().subscribe((value)=>{
          value.data.filter((find)=>{
              if(find.symbol === symbol && find.network === network){
                  if(Number(find.minCount) <= amount){
                      this.ProceedToValidate = true;
                      this.toData.errorMsg = '';
                      this.changeDetectorRef.detectChanges();
                  }else{
                      console.log('false');
                      this.ProceedToValidate = false;
                      this.toData.errorMsg = 'Minimum Assets input value is ' + find.minCount;
                      this.changeDetectorRef.detectChanges();
                      return;
                  }
              }
          });
      });
  }





  onSwitch(): void {
      const fromData = this.swapForm.get('from').value;
      this.swapForm.patchValue({ from: { ...this.swapForm.get('to').value }, to: { ...fromData } });
  }


  onSwap(): void {
    // btc to eth from swap comp
    // {
    //     "amountRespectToOne": "20964.03058241",
    //     "amountRespectToTwo": "1485.69361885",
    //     "amountToCreditOrDebit": "0.00433693",
    //     "exchangeFee": "0.00023",
    //     "fromAddress": "112h1aVNWNfn7mn8zEw5QeDFry4eSbLrMX",
    //     "fromWalletId": "1566279497682685954",
    //     "oacurrentPrice": "0.06109274",
    //     "percentageValue": 0,
    //     "quantity": "0.06078728",
    //     "side": "sell",
    //     "subType": "SWAP",
    //     "symbol": "BTC/ETH",
    //     "toAddress": "0x000a8933afc785a2c27ec20f687decd75245a041",
    //     "toWalletId": "1566279497682685954",
    //     "type": "BEST_RATE"
    // }
    // btc to eth from exchange comp
    // {
    //     "amountRespectToOne": "20964.55768958",
    //     "amountRespectToTwo": "1484.95886427",
    //     "amountToCreditOrDebit": "0.00433693",
    //     "exchangeFee": "0.00023",
    //     "fromAddress": "112h1aVNWNfn7mn8zEw5QeDFry4eSbLrMX",
    //     "fromWalletId": "1566279497682685954",
    //     "oacurrentPrice": "0.06110654",
    //     "percentageValue": 0,
    //     "quantity": "0.06080273",
    //     "side": "sell",
    //     "subType": "SWAP",
    //     "symbol": "BTC/ETH",
    //     "toAddress": "0x000a8933afc785a2c27ec20f687decd75245a041",
    //     "toWalletId": "1566279497682685954",
    //     "type": "BEST_RATE"
    // }
      const swapFinalpaylod = {
          amountRespectToOne: this.fromData.amountRespectToOne,
          amountRespectToTwo: this.toData.amountRespectToOne,
          amountToCreditOrDebit: this.swapForm.get('from').get('amount').value,
          exchangeFee: this.fromData.exchangeFee,
          fromAddress: this.fromData.fromAddress,
          fromWalletId: this.fromData.fromWalletId,
          oacurrentPrice: this.fromData.oacurrentPrice,
          percentageValue: 0,
          quantity: this.swapForm.get('to').get('amount').value,
          side: 'sell',
          subType: 'SWAP',
          symbol: this.fromData.selectedAssetsSymbol+'/'+this.toData.selectedAssetsSymbol,
          toAddress: this.toData.toAddress,
          toWalletId: this.toData.toWalletId,
          type: 'BEST_RATE'
        };
      //    console.log(swapFinalpaylod);
      const finalDataObject = {
        from:this.fromData,
        to:this.toData,
        oparationType : 'exchange',
        finalObject:swapFinalpaylod,
        totalAmount: Number(this.fromExchangeFee.totalAmount),
        fromExchangeFee:this.fromExchangeFee,
        buttonValidation: false
      };
      console.log(finalDataObject);
      if(Number(this.fromData.asseteAmount) >= finalDataObject.totalAmount){
        finalDataObject.buttonValidation = true;
        this.swapConfirmPop(finalDataObject);
        this.changeDetectorRef.detectChanges();
    }else{
        finalDataObject.buttonValidation = false;
        this.swapConfirmPop(finalDataObject);
    }
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

