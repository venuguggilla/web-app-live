import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiEndpointService } from 'app/services/common/api-endpoint.service';
import { CommonService } from 'app/services/common/common.service';

@Injectable({
    providedIn: 'root'
})
export class SecurityService
{
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _apiEndpoint: ApiEndpointService,
        private _commonService: CommonService
        )
    { }

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
        const url = this._commonService.baseUrl + this._apiEndpoint.account.getSecurityQuestions;
        return this._httpClient.get(url).pipe(
            tap((response: any) => {
                this._data.next(response.data);
            })
        );
    }
}
