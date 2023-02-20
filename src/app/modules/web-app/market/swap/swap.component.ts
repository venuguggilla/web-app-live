/* eslint-disable @typescript-eslint/naming-convention */
import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import { UserService } from 'app/services/common/user/user.service';
import { AccountDetails } from 'app/services/common/user/user.types';
import { Observable, Subject } from 'rxjs';
import { WalletService } from '../wallet.service';
@Component({
    selector: 'swap',
    templateUrl: './swap.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SwapComponent implements OnInit, AfterViewInit, OnDestroy {
    wallets$: Observable<any[]>;
    accounts$: Observable<AccountDetails>;
    getAllWallets$: Observable<any[]>;
    walletDesign: any;
    selectedBtn = 'buy';

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _walletService: WalletService,
        private _userService: UserService,
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

        // Get the accounts
        this.accounts$ = this._userService.account$;

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

}
