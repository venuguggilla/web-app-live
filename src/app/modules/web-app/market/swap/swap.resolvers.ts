import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { UserService } from 'app/services/common/user/user.service';
import { forkJoin, Observable } from 'rxjs';
import { WalletService } from '../wallet.service';
import { SwapService } from './swap.service';

@Injectable({
    providedIn: 'root'
})
export class SwapResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _walletService: WalletService, private _swapService: SwapService,
        private _userService: UserService) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return forkJoin({
            accounts : this._userService.getUserAccounts(),
            wallets: this._walletService.getWallets(),
            data: this._swapService.getData()
            // allWallets: this._swapService.getAllWallets()
        });
    }
}
