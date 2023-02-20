/* eslint-disable */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiEndpointService } from 'app/services/common/api-endpoint.service';
import { CommonService } from 'app/services/common/common.service';
import {
    AccountDetails,
    PrimeryCurrency,
    User,
    UserTotalDetails,
} from 'app/services/common/user/user.types';
import { map, Observable, ReplaySubject, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);
    private _getFullUser: ReplaySubject<UserTotalDetails> =
        new ReplaySubject<UserTotalDetails>(1);
    private _primeryCurrency: ReplaySubject<PrimeryCurrency> =
        new ReplaySubject<PrimeryCurrency>(1);
    private _accountDetails: ReplaySubject<AccountDetails> =
        new ReplaySubject<AccountDetails>(1);
    getUserId;
    
    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _commonService: CommonService,
        private _apiEndpoint: ApiEndpointService
    ) {
        try {
            console.log(
                this._commonService.getUserId(),
                'this._commonService.getUserId()'
            );

            this.getUserId = '62e3887c1126ce6eb0095d88';
        } catch (error) {}
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for user profile data
     *
     * @param value
     */
    set user(value: User) {
        // Store the value
        this._user.next(value);
    }

    get user$(): Observable<User> {
        return this._user.asObservable();
    }
    /**
     * Setter & getter for full user data
     *
     * @param value
     */
    set geFullUser(value: UserTotalDetails) {
        // Store the value
        this._getFullUser.next(value);
    }

    get geFullUser$(): Observable<UserTotalDetails> {
        return this._getFullUser.asObservable();
    }

    /**
     * Setter & getter for user primery currency
     *
     * @param value
     */
    set primeryCurrency(value: PrimeryCurrency) {
        // Store the value
        this._primeryCurrency.next(value);
    }

    get primeryCurrency$(): Observable<PrimeryCurrency> {
        return this._primeryCurrency.asObservable();
    }

    /**
     * Setter & getter for user
     *
     * @param value
     */
    set account(value: AccountDetails) {
        // Store the value
        this._accountDetails.next(value);
    }

    get account$(): Observable<AccountDetails> {
        return this._accountDetails.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    /**
     * Get the current logged in user data
     */
    get(): Observable<any> {
        const url = `${this._commonService.baseUrl}${this._apiEndpoint.webApp.userData.profile}?userId=${this.getUserId}`;

        return this._httpClient.get<User>(url).pipe(
            tap((response) => {
                const { userId, email, username } = response.data;
                const { fullName, firstName, imageSrc } = response.data.profile;
                const user = {
                    id: userId,
                    username: username,
                    name: fullName,
                    firstName: firstName,
                    email: email,
                    avatar: imageSrc,
                    status: 'online',
                };

                this._getFullUser.next(response.data);
                this._user.next(user);
            })
        );
    }

    /**
     * Update the user
     *
     * @param user
     */
    update(user: User): Observable<any> {
        return this._httpClient.patch<User>('api/common/user', { user }).pipe(
            map((response) => {
                this._user.next(response);
            })
        );
    }

    /**
     * Get the current logged in user  account data
     */
    getUserAccounts(): Observable<any> {
        return this._httpClient
            .get<AccountDetails[]>(
                `${this._commonService.baseUrl}${this._apiEndpoint.webApp.userData.account}?userId=${this.getUserId}`
            )
            .pipe(
                map((response: any) => {
                    this._accountDetails.next(response.data.account);
                })
            );
    }

    /**
     * Get the current logged in user  primary currency data
     */
    getUserPrimaryCurrencies(): Observable<any> {
        return this._httpClient
            .get<PrimeryCurrency>(
                `${this._commonService.baseUrl}${this._apiEndpoint.webApp.userData.primaryCurrency}?userId=${this.getUserId}`
            )
            .pipe(
                map((response: any) => {
                    const { symbol } = response?.data?.primeryCurrency;
                    this._primeryCurrency.next(symbol);
                })
            );
    }
}
