import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot,
} from '@angular/router';
import { UserService } from 'app/services/common/user/user.service';
import { Observable, of, switchMap, zip } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SettingsResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _userService: UserService) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> {
        return this._userService
            .getUserAccounts()
            .pipe(
                switchMap((account) =>
                    zip(
                        of(account),
                        this._userService.getUserPrimaryCurrencies()
                    )
                )
            );
    }
}
