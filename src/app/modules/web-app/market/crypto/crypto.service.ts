import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { CommonService } from 'app/services/common/common.service';

@Injectable({
    providedIn: 'root'
})
export class CryptoService {
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);
    private _networkList: BehaviorSubject<any> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _commonService: CommonService, private _httpClient: HttpClient) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for data
     */
    get data$(): Observable<any> {
        return this._data.asObservable();
    }

    /**
     * Getter for network list
     */
    get networkList$(): Observable<any> {
        return this._networkList.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get data
     */
    getData(): Observable<any> {
        return this._httpClient.get('api/dashboards/crypto').pipe(
            tap((response: any) => {
                this._data.next(response);
            })
        );
    }

    /**
     * Get All Network List
     */
    getAllNetworkList(asset = 'USDT'): Observable<any> {
        return this._httpClient.get(`${this._commonService.baseUrl}account/v1/get-all-network-list/${asset}`).pipe(
            tap((response: any) => {
                this._networkList.next(response.data);
            })
        );
    }
}
