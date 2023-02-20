import { Injectable } from '@angular/core';
import { defaulNavData, Navigation } from 'app/core/navigation/navigation.types';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NavigationService
{
    private _navigation: ReplaySubject<Navigation> = new ReplaySubject<Navigation>(1);

    /**
     * Constructor
     */
    constructor()
    {
        /**
         * Set default navigation
         */
        this._navigation.next({default: defaulNavData} as any);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for navigation
     */
    get navigation$(): Observable<Navigation>
    {
        return this._navigation.asObservable();
    }
}
