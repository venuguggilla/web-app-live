import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, takeUntil, tap } from 'rxjs';
import { ApiEndpointService } from 'app/services/common/api-endpoint.service';
import { CommonService } from 'app/services/common/common.service';
import { UserService } from 'app/services/common/user/user.service';
import { User } from 'app/services/common/user/user.types';

@Injectable({
    providedIn: 'root'
})
export class TransactionService
{
    selectedAccountDetails: any;
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService,
        private _apiEndpoint: ApiEndpointService,
        private _commonService: CommonService)
    {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for data
     */
    get data$(): Observable<any>
    {
        return this._data.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    /**
     * Get data
     */

    getData(): Observable<any>
    {
        if( this.selectedAccountDetails === undefined){
            this._userService.account$.subscribe((user) =>{
                this.selectedAccountDetails = user[0];
            });
        }
        const accountTransationDetails ={
            accountId:this.selectedAccountDetails.ledgerId,
            accountType:this.selectedAccountDetails.accountType
        };
        // eslint-disable-next-line max-len
        return this._httpClient.get(`${this._commonService.baseUrl + this._apiEndpoint.webApp.userData.getTxTransactions}?accountId=${accountTransationDetails.accountId}&accountType=${accountTransationDetails.accountType}`)
            .pipe(
            tap((response: any) => {
                this._data.next(response.data.data);
            })
        );
    }
}
