import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'app/services/common/common.service';
import { UserService } from 'app/services/common/user/user.service';
import { AccountDetails, PrimeryCurrency, User } from 'app/services/common/user/user.types';
import { ApexOptions } from 'ng-apexcharts';
import { Observable, Subject, takeUntil } from 'rxjs';
import { TransactionService } from '../transaction/transaction.service';
import { AccountService } from './account.service';
import { ExchangeFiatComponent } from './receive-popup copy/exchange.component';
import { ReceiveFiatComponent } from './receive-popup/receive.component';

@Component({
    selector       : 'account',
    templateUrl    : './account.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountComponent implements OnInit, AfterViewInit, OnDestroy
{
    @ViewChild('recentTransactionsTable', {read: MatSort}) recentTransactionsTableMatSort: MatSort;
    @ViewChild('recentAccountTable', {read: MatSort}) recentAccountTableMatSort: MatSort;
    userNameData: any;
    data: any;
    accountBalanceOptions: ApexOptions;
    recentTransactionsDataSource: MatTableDataSource<any> = new MatTableDataSource();
    recentAccountDataSource: MatTableDataSource<any> = new MatTableDataSource();
    recentTransactionsTableColumns: string[] = ['paymentID', 'tableDate', 'tableName', 'tableAmount', 'tableStatus'];
    recentAccountTableColumns: string[] = ['accountId', 'Iban'];
    user: User;
    userPrimeryCurrency: any;
    primeryCurrency: PrimeryCurrency;
    accounts$: Observable<AccountDetails>;
    selectedAccount: AccountDetails;
    currencys: any;
    selectedCurrency: string = 'prymariCurrency';
    selectedCountry: string = 'EUR_ACCOUNT';
    otherCurrencyAccountselected: any;
    otherCurrencyAccount: any;
    finalObject ={
        oparationType:'exchange',
        finalObject: {},
        selectedToCurrency:'',
        formData: {},
        toAccount: ''
    };
    otherCurrency = this._formBuilder.group({
        from: this._formBuilder.group({
            accounts: [''],
            amount: [''],
        }),
        to: this._formBuilder.group({
            accounts: [''],
            amount: [''],
        }),
    });
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _accountService: AccountService,
        private _userService: UserService,
        private changeDetectorRef: ChangeDetectorRef,
        private _commonService: CommonService,
        private _transactionService: TransactionService,
        private _matDialog: MatDialog,
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
        // this.accounts$.subscribe((account: AccountDetails) => {
        //     this.otherCurrency.get('from').get('wallet').setValue(account[0], { onlySelf: true, emitEvent: true });
        // });

        this.userNameData = this._commonService.hardcodedName;
        // this._userService.get();
        // Subscribe to the user service
        this._userService.user$
            .pipe((takeUntil(this._unsubscribeAll)))
            .subscribe((user: User) => {
                this.user = user;
            });
        // Subscribe to the user.primeryCurrency service
        this._userService.primeryCurrency$
            .pipe((takeUntil(this._unsubscribeAll)))
            .subscribe((primeryCurrency: PrimeryCurrency) => {
                this.userPrimeryCurrency = {
                    symbol: primeryCurrency,
                    name:'venu'
                };
            });

            // Get the products
            this.accounts$ = this._userService.account$;
            this.accounts$.subscribe((account: AccountDetails) => {

            this.otherCurrency.get('from').get('accounts').setValue(account[0], { onlySelf: true, emitEvent: true });
            this.otherCurrency.get('from').get('amount').setValue(account[0].availableBalance, { onlySelf: true, emitEvent: true });
            this.selectedAccount = account[0];
            this.finalObject.formData = account[0];
            this._transactionService.selectedAccountDetails = this.selectedAccount;
                  // Store the table data
                //   this.recentAccountDataSource.data = this.data ;
            });

            this._accountService.loadOtherAccount().subscribe((otherAccounts) =>{
                const currencys ={
                    accountType: this.selectedAccount.accountType,
                    amount: this.selectedAccount.availableBalance,
                    businessProfileId: this.selectedAccount.ledgerId,
                    imageUrl: this.selectedAccount.imageUrl,
                    userId: this.selectedAccount.userId
                };
                this.currencys = [currencys, ...otherAccounts.data];
                this.otherCurrencyAccount = otherAccounts.data;
                this.otherCurrencyAccountselected = this.otherCurrencyAccount[0];
                // this.currencys = otherAccounts.data;
                console.log(this.selectedAccount.accountType);
                this.changeDetectorRef.detectChanges();
            });
        this._transactionService.data$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                // Store the data
                this.data = data.slice(0, 5);
                this.recentTransactionsDataSource.data = data.slice(0, 5);

            });
    }
    showOtherCurrencys(): void
    {
        this.selectedCurrency = 'otherCurrency';
        this.selectedCountry = this.otherCurrencyAccountselected.accountType;
        this.changeDetectorRef.detectChanges();
    }
    toggleCurrency(currency): void
    {
        this._accountService._selectedData.next(currency);
        if(currency.accountType ==='EUR_ACCOUNT'){
            this.otherCurrencyAccountselected = this.otherCurrencyAccount[0];
        }else{
            this.otherCurrencyAccountselected = currency;
        }
        this.changeDetectorRef.detectChanges();
    }
    /**
     * After view init
     */
    ngAfterViewInit(): void
    {
        // Make the data source sortable
        this.recentTransactionsDataSource.sort = this.recentTransactionsTableMatSort;
        this.recentAccountDataSource.sort = this.recentAccountTableMatSort;
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Prepare the chart data from the data
     *
     * @private
     */
    private _prepareChartData(): void
    {
        // Account balance
        this.accountBalanceOptions = {
            chart  : {
                animations: {
                    speed           : 400,
                    animateGradually: {
                        enabled: false
                    }
                },
                fontFamily: 'inherit',
                foreColor : 'inherit',
                width     : '100%',
                height    : '100%',
                type      : 'area',
                sparkline : {
                    enabled: true
                }
            },
            colors : ['#A3BFFA', '#667EEA'],
            fill   : {
                colors : ['#CED9FB', '#AECDFD'],
                opacity: 0.5,
                type   : 'solid'
            },
            series : this.data.accountBalance.series,
            stroke : {
                curve: 'straight',
                width: 2
            },
            tooltip: {
                followCursor: true,
                theme       : 'dark',
                x           : {
                    format: 'MMM dd, yyyy'
                },
                y           : {
                    formatter: (value): string => value + '%'
                }
            },
            xaxis  : {
                type: 'datetime'
            }
        };
    }
    // eslint-disable-next-line @typescript-eslint/member-ordering
    redirectToBeneficiaries(): void{

        let data: any;
        if(this.selectedCountry === 'EUR_ACCOUNT'){
            data = {
                accountType :'EUR',
                benModule :'MODULR',
            };
            this._accountService.getBeneficiaries(data);
        }else if(this.selectedCountry === 'GBP_ACCOUNT'){
            console.log(this.selectedCountry);
            data = {
                accountType :'GBP',
                benModule :'WISE',
            };
            this._accountService.getBeneficiaries(data);
        }else if(this.selectedCountry === 'SGD_ACCOUNT'){
            console.log(this.selectedCountry);
            data = {
                accountType :'SGD',
                benModule :'WISE',
            };
            this._accountService.getBeneficiaries(data);
        }
    }
    // eslint-disable-next-line @typescript-eslint/member-ordering
    receiveFiat(): void {
        this._accountService._selectedAccount.next(this.selectedAccount);
         // Open the dialog
         const dialogRef = this._matDialog.open(ReceiveFiatComponent);
         dialogRef.afterClosed().subscribe((result) => {
             console.log('Compose dialog was closed!');
         });
    }
    // eslint-disable-next-line @typescript-eslint/member-ordering
    exchangeConfirmPop(): void {
         // Open the dialog
         if(this.otherCurrency.get('to').get('accounts').value.accountType === 'GBP_ACCOUNT'){
            this.finalObject.selectedToCurrency = 'GBP';
         }else if(this.otherCurrency.get('to').get('accounts').value.accountType === 'SGD_ACCOUNT'){
            this.finalObject.selectedToCurrency = 'SGD';
         }else if(this.otherCurrency.get('to').get('accounts').value.accountType === 'MYR_ACCOUNT'){
            this.finalObject.selectedToCurrency = 'MYR';
         }
         this.finalObject.toAccount = this.otherCurrency.get('to').get('accounts').value.accountType;
         const finalObject = {
            'sourceCurrency': 'EUR',
            'targetCurrency': this.finalObject.selectedToCurrency,
            'sourceAmount': this.otherCurrency.get('from').get('amount').value,
          };
          this.finalObject.finalObject = finalObject;
        //   console.log('his.finalObject',this.finalObject);
         this._accountService._exchangeAmount.next(this.finalObject);
         const dialogRef = this._matDialog.open(ExchangeFiatComponent);
         dialogRef.afterClosed().subscribe((result) => {
            this.reloadPage();
             console.log('Compose dialog was closed!');
         });
    }
    // eslint-disable-next-line @typescript-eslint/member-ordering
    reloadPage(): void{
        location.reload();
    }
}
