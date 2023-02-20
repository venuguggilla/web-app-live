
import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ApexOptions } from 'ng-apexcharts';
import { TransactionService } from '../../finance-dashboard/transaction/transaction.service';
import { UserService } from 'app/services/common/user/user.service';
import { AccountDetails, PrimeryCurrency, User } from 'app/services/common/user/user.types';

@Component({
    selector       : 'settings-notifications',
    templateUrl    : './notifications.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsNotificationsComponent implements OnInit
{
    @ViewChild('recentTransactionsTable', {read: MatSort}) recentTransactionsTableMatSort: MatSort;

    data: any;
    accountBalanceOptions: ApexOptions;
    recentTransactionsDataSource: MatTableDataSource<any> = new MatTableDataSource();
    recentTransactionsTableColumns: string[] = ['paymentID', 'tableName'];
    user: User;
    userPrimeryCurrency: any;
    primeryCurrency: PrimeryCurrency;
    accounts$: Observable<AccountDetails>;
    selectedAccount: AccountDetails;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    /**
     * Constructor
     */
    constructor(
        private _transactionService: TransactionService,
        private _userService: UserService)
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

            // Get the accounts
            this.accounts$ = this._userService.account$;
            this.accounts$.subscribe((account: AccountDetails) => {
                this.selectedAccount = account[0];
            });

        // Get the data
        this._transactionService.data$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                // Store the data
                this.data = data;

                // Store the table data
                this.recentTransactionsDataSource.data = data;

                // Prepare the chart data
                this._prepareChartData();
            });
    }

    /**
     * After view init
     */
    // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
    ngAfterViewInit(): void
    {
        // Make the data source sortable
        this.recentTransactionsDataSource.sort = this.recentTransactionsTableMatSort;
    }

    /**
     * On destroy
     */
    // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
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
}
