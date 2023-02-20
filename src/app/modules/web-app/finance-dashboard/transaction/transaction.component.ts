import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'app/services/common/common.service';
import { map, merge, Subject, switchMap, takeUntil } from 'rxjs';
import { TransactionService } from './transaction.service';

@Component({
    selector: 'transaction',
    templateUrl: './transaction.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    data: any;
    dataSource: MatTableDataSource<any> = new MatTableDataSource();
    displayedColumns: string[] = ['paymentId', 'send', 'senderName', 'amount', 'status'];

    isLoading: boolean = false;
    userNameData: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    /**
     * Constructor
     */
    constructor(
        private _transactionService: TransactionService,private _commonService: CommonService) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Get the data
        this.userNameData = this._commonService.hardcodedName;
        this._transactionService.data$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                // Store the data
                this.data = data;
                const transactiond = data.map((d) => {
                    const transaction = {
                        paymentId: d.paymentDetails.paymentId,
                        send: d.send,
                        senderName: d.senderDetails.senderName,
                        credit: d.credit,
                        currency: d.paymentDetails.currency,
                        amount: d.paymentDetails.amount,
                        status: d.status
                    };
                    return transaction;
                });

                // Store the table data
                this.dataSource.data = transactiond;
            });
    }

    /**
     * After view init
     */

    ngAfterViewInit(): void {
        this.dataSource.paginator = this._paginator;
        this.dataSource.sort = this._sort;
    }

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
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

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
