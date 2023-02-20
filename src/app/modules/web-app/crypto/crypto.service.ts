/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiEndpointService } from 'app/services/common/api-endpoint.service';
import { CommonService } from 'app/services/common/common.service';

interface Scripts {
    name: string;
    src: string;
  }


export const ScriptStore: Scripts[] = [
    { name: 'mini-chart', src: 'https://d33t3vvu2t2yu5.cloudfront.net/tv.js' },
  ];
  @Injectable({
    providedIn: 'root'
  })
export class TransactionService
{
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);
    private scripts: any = {};
    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _apiEndpoint: ApiEndpointService,
        private _commonService: CommonService)
    {
       
    }

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

    getData(): void
    {
       
    }    
}
