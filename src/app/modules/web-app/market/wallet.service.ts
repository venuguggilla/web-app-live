/* eslint-disable */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiEndpointService } from 'app/services/common/api-endpoint.service';
import { CommonService } from 'app/services/common/common.service';
import { BehaviorSubject, filter, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class WalletService {
    private _wallet: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _wallets: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    private _assets: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    private _walletTotalBalance: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    private _depositAddress: BehaviorSubject<any[] | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _commonService: CommonService,
        private _httpClient: HttpClient,
        private _apiEndpointService: ApiEndpointService) { }


    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for wallets
     */
    get wallets$(): Observable<any[]> {
        return this._wallets.asObservable();
    }

    /**
     * Getter for wallet
     */
    get wallet$(): Observable<any> {
        return this._wallet.asObservable();
    }

    /**
     * Getter for assets
     */
    get assets$(): Observable<any[]> {
        return this._assets.asObservable();
    }

    /**
     * Getter for walletDesign
     */
    get walletDesign$(): any {
        return this._commonService.walletDesign;
    }

    /**
     * Getter for walletTotalBalance
     */
    get walletTotalBalance$(): any {
        return this._walletTotalBalance.asObservable();
    }

    /**
     * Getter for depositAddress
     */
    get depositAddress$(): any {
        return this._depositAddress.asObservable();
    }

    /**
     * Get walletTotalBalance
     */
    getWalletTotalBalance(): Observable<any[]> {
        return this._httpClient.get<any[]>(`${this._commonService.baseUrl}${this._apiEndpointService.webApp.wallet.totalBalance}`).pipe(
            tap((response: any) => {
                this._walletTotalBalance.next(response.data || null);
            })
        );
    }


    /**
     * Get Wallets
     */
    getAssets(): Observable<any[]> {
        return this._httpClient.get<any[]>(`${this._commonService.baseUrl}${this._apiEndpointService.webApp.asset.getAll}`).pipe(
            tap((response: any) => {
                this._assets.next(response.data || []);
            })
        );
    }

    /**
     * Get Wallets
     */
    getWallets(): Observable<any[]> {
        return this._httpClient.get<any[]>(`${this._commonService.baseUrl}${this._apiEndpointService.webApp.wallet.getAll}`).pipe(
            tap((wallets: any) => {
                this._wallets.next(wallets.data || []);
            })
        );
    }

    /**
     * Get wallet by id
     */
    getWalletById(id: string): Observable<any> {
        return this._wallets.pipe(
            take(1),
            map((wallets) => {
                // Find the wallet
                const wallet = wallets.find(item => item.walletId === id) || null;

                // Update the wallet
                this._wallet.next(wallet);

                // Return the wallet
                return wallet;
            }),
            switchMap((wallet) => {
                if (!wallet) {
                    const err = new Error('Could not found wallet with id of ' + id + '!');
                    return throwError(() => err);
                }

                return of(wallet);
            })
        );
    }

    /**
     * Get DepositAddres
     */
     getDepositAddress(coinInfo : any): Observable<any[]> {
        return this._httpClient.post<any[]>(`${this._commonService.baseUrl}${this._apiEndpointService.webApp.wallet.getDepositAddress}`,coinInfo).pipe(
            tap((response: any) => {
                this._depositAddress.next(response.data || null);
            })
        );
    }

    /**
     * Create Wallet
     */
    createWallet(wallet: any): Observable<any> {
        return this.wallets$.pipe(
            take(1),
            switchMap(wallets => this._httpClient.post<any>(`${this._commonService.baseUrl}${this._apiEndpointService.webApp.wallet.create}`, wallet).pipe(
                map((newWallet) => {

                    // Update the wallets with the new wallet
                    this._wallets.next([newWallet, ...wallets]);

                    // Return the new wallet
                    return newWallet;
                })
            ))
        );
    }

    /**
     * Update Wallet
     *
     * @param id
     * @param wallet
     */
    updateWallet(id: string, wallet: any): Observable<any> {
        return this.wallets$.pipe(
            take(1),
            switchMap(wallets =>
                this._httpClient.post<any>(`${this._commonService.baseUrl}${this._apiEndpointService.webApp.wallet.update}${wallet.oldWalletName}/${wallet.walletName}`, wallet).pipe(
                    map((updatedWallet) => {

                        // Find the index of the updated wallet
                        const index = wallets.findIndex(item => item.walletId === id);

                        // Update the wallet
                        wallets[index] = { ...wallets[index], ...wallet };

                        // Update the wallets
                        this._wallets.next(wallets);

                        // Return the updated wallet
                        return updatedWallet;
                    }),
                    switchMap(updatedWallet => this.wallets$.pipe(
                        take(1),
                        filter((item: any) => item && item.walletId === id),
                        tap(() => {

                            // Update the wallet if it's selected
                            this._wallet.next(updatedWallet);

                            // Return the updated wallet
                            return updatedWallet;
                        })
                    ))
                ))
        );
    }
}

