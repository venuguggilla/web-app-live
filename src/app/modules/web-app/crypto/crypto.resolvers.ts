import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { TransactionService } from './crypto.service';

@Injectable({
    providedIn: 'root'
})
export class TransactionResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _transactionService: TransactionService)
    { }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): void
    { }
}
