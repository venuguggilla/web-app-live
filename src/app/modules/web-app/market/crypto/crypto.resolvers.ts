import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { WalletService } from '../wallet.service';
import { CryptoService } from './crypto.service';

@Injectable({
    providedIn: 'root'
})
export class CryptoResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _walletService: WalletService, private _cryptoService: CryptoService) {
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
            // wallets: this._walletService.getWallets(),
            data: this._cryptoService.getData()
        });
    }
}
