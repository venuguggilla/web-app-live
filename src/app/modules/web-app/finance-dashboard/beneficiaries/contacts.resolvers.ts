import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { UserService } from 'app/services/common/user/user.service';
import { catchError, forkJoin, Observable, throwError } from 'rxjs';
import { AccountService } from '../account/account.service';
import { ContactsService } from './contacts.service';
import { Contact, Country, Tag } from './contacts.types';

@Injectable({
    providedIn: 'root'
})
export class ContactsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _contactsService: ContactsService,
        private _userService: UserService)
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
        return forkJoin({
            accounts : this._userService.getUserAccounts(),
            contacts: this._contactsService.getContacts()
        });
    }
}

@Injectable({
    providedIn: 'root'
})
export class ContactsContactResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _contactsService: ContactsService,
        private _router: Router,private _accountService: AccountService
    )
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Contact>
    {
        return this._accountService.getContactById(route.paramMap.get('id'))
                   .pipe(
                       // Error here means the requested contact is not available
                       catchError((error) => {

                           // Log the error
                           console.error(error);

                           // Get the parent url
                           const parentUrl = state.url.split('/').slice(0, -1).join('/');

                           // Navigate to there
                           this._router.navigateByUrl(parentUrl);

                           // Throw an error
                           return throwError(error);
                       })
                   );
    }
}

@Injectable({
    providedIn: 'root'
})
export class ContactsCountriesResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _contactsService: ContactsService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Country[]>
    {
        return this._contactsService.getCountries();
    }
}

@Injectable({
    providedIn: 'root'
})
export class ContactsTagsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _contactsService: ContactsService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Tag[]>
    {
        return this._contactsService.getTags();
    }
}
