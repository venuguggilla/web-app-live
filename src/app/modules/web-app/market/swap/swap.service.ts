import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { CommonService } from 'app/services/common/common.service';

@Injectable({
    providedIn: 'root'
})
export class SwapService {
    public _selectedDetails: BehaviorSubject<any> = new BehaviorSubject(null);
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

    get selectedDetails$(): Observable<any>
    {
        return this._selectedDetails.asObservable();
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
     * Get All wallets data
     */
    //  getAllWallets(): Observable<any> {
    //     return this._httpClient.get(`${this._commonService.baseUrl}account/v1/swap/get-all-wallets`).pipe(
    //         tap((allWallets: any) => {
    //         })
    //     );
    // }

    /**
     * Get Price Respect Pair
     */
     getPriceRespectToPair(symble): Observable<any> {
        return this._httpClient.post(`${this._commonService.baseUrl}account/v1/swap/get-price-respect-to-pair`,symble);
    }

    /**
     * Get Exchange Fee
     */
      getExchangeFee(symble): Observable<any> {
        return this._httpClient.post(`${this._commonService.baseUrl}account/v1/swap/get-exchange-fee`,symble);
    }

    /**
     * Get Exchange Fee
     */
     getBuyExchangeFee(symble): Observable<any> {
        return this._httpClient.post(`${this._commonService.baseUrl}account/v1/market/get-exchange-fee`,symble);
    }

    /**
     * Get Exhange Calculation
     */
     getExhangeCalculation(symble): Observable<any> {
        if(symble.value){
            return this._httpClient.post(`${this._commonService.baseUrl}account/v1/swap/get-exhange-calculation`,symble);
        }
    }
    /**
     * Get Exhange Calculation
     */
     getBuyExhangeCalculation(symble): Observable<any> {
        return this._httpClient.post(`${this._commonService.baseUrl}account/v1/market/get-exchange-calculation`,symble);
    }
    swap(type,finalObject): any {
        // console.log('type',type);
        if(type === 'BUY' || type === 'SELL'){
            // console.log('finla',type,finalObject);
            return this._httpClient.post(`${this._commonService.baseUrl}account/v1/market/`,finalObject).pipe(
                tap((response: any) => {
                    console.log('buyres',response);
                })
            );
        }
        if(type === 'SWAP'){
        console.log('finla',type,finalObject);
            return this._httpClient.post(`${this._commonService.baseUrl}account/v1/swap/`,finalObject).pipe(
                tap((response: any) => {
                    console.log('buyres',response);
                })
            );
        }
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
     /**
      * Get exchangeFeePercentage min and max amount
      */
      getFeePercentageMinMax(): Observable<any> {
        return this._httpClient.get(`${this._commonService.baseUrl}account/v1/minimum-limit/WALLET_SEND`);
    }
     /**
      * Get exchangeFeePercentage min and max amount
      */
      getAssetMinValidation(): Observable<any> {
        return this._httpClient.get(`${this._commonService.baseUrl}account/v1/deposit-and-withdrawal-fees`);
    }

    /**
     * Get Exchange Fee
     */
     getCheckLimit(symble): Observable<any> {
        return this._httpClient.post(`${this._commonService.baseUrl}account/v1/wallet/check-limit`,symble);
    }
}
