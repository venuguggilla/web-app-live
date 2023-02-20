import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { SecurityService } from './security.service';

@Injectable({
    providedIn: 'root'
})
export class SecurityResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _securityService: SecurityService)
    {
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
        return this._securityService.getData();
    }
}
