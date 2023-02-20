import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { WalletService } from './wallet.service';

@Injectable({
    providedIn: 'root'
})
export class WalletResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _walletService: WalletService) { }

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
            wallets: this._walletService.getWallets(),
            assets: this._walletService.getAssets(),
            totalBalance: this._walletService.getWalletTotalBalance()
        });
    }
}
