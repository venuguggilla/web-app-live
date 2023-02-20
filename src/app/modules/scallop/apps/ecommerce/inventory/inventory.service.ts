import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, filter, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { InventoryBrand, InventoryCategory, InventoryPagination, InventoryProduct, InventoryTag, InventoryVendor } from 'app/modules/scallop/apps/ecommerce/inventory/inventory.types';
import { ApiEndpointService } from 'app/services/common/api-endpoint.service';
import { CommonService } from 'app/services/common/common.service';
import { ApiService } from 'app/services/common/auth/api.service';
import { PeriodicElement } from '../../contacts/settings/plan-billing/plan-billing.types';
import { FiatTransation } from '../../contacts/settings/transaction/transaction.types';

@Injectable({
    providedIn: 'root'
})
export class InventoryService
{
    // Private
    private _brands: BehaviorSubject<InventoryBrand[] | null> = new BehaviorSubject(null);
    private _categories: BehaviorSubject<InventoryCategory[] | null> = new BehaviorSubject(null);
    private _pagination: BehaviorSubject<InventoryPagination | null> = new BehaviorSubject(null);
    private _product: BehaviorSubject<InventoryProduct | null> = new BehaviorSubject(null);
    // eslint-disable-next-line @typescript-eslint/member-ordering
    wallest = new BehaviorSubject<any>('');
    // eslint-disable-next-line @typescript-eslint/member-ordering
    fiatTx = new BehaviorSubject<any>('');
    private _products: BehaviorSubject<InventoryProduct[] | null> = new BehaviorSubject(null);
    private _tags: BehaviorSubject<InventoryTag[] | null> = new BehaviorSubject(null);
    private _vendors: BehaviorSubject<InventoryVendor[] | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor( private _apiService: ApiService,private _httpClient: HttpClient,private _apiEndpoint: ApiEndpointService,private _commonService: CommonService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for brands
     */
    get brands$(): Observable<InventoryBrand[]>
    {
        return this._brands.asObservable();
    }

    /**
     * Getter for categories
     */
    get categories$(): Observable<InventoryCategory[]>
    {
        return this._categories.asObservable();
    }

    /**
     * Getter for pagination
     */
    get pagination$(): Observable<InventoryPagination>
    {
        return this._pagination.asObservable();
    }

    /**
     * Getter for product
     */
    get product$(): Observable<InventoryProduct>
    {
        return this._product.asObservable();
    }

    /**
     * Getter for products
     */
    get products$(): Observable<InventoryProduct[]>
    {
        return this._products.asObservable();
    }

    /**
     * Getter for tags
     */
    get tags$(): Observable<InventoryTag[]>
    {
        return this._tags.asObservable();
    }

    /**
     * Getter for vendors
     */
    get vendors$(): Observable<InventoryVendor[]>
    {
        return this._vendors.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get products
     *
     *
     * @param page
     * @param size
     * @param sort
     * @param order
     * @param search
     */
    getProducts(page: number = 0, size: number = 10, sort: string = 'name', order: 'asc' | 'desc' | '' = 'asc', search: string = ''):
        Observable<{data: any; pagination: InventoryPagination; products: InventoryProduct[]}>
    {
        const url = `${this._apiEndpoint.userData.getAllUser}`;
        return this._httpClient.post<{data: any; pagination: InventoryPagination; products: InventoryProduct[]}>
        (this._commonService.baseUrl + url, {
            endUserType: this._commonService.individual,
            ip: this._commonService.location,
            page:2,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            page_size: 10
        }).pipe(
            tap((response) => {
                const products = response.data.data;
                this._pagination.next(response.data.pagination);
                this._products.next(products);
            })
        );
    }

    /**
     * Get product by id
     */
    getProductById(userId: string): Observable<InventoryProduct>
    {
        return this._products.pipe(
            take(1),
            map((products) => {

                // Find the product
                const product = products.find(item => item.userId === userId) || null;

                // Update the product
                this._product.next(product);

                // Return the product
                return product;
            }),
            switchMap((product) => {

                if ( !product )
                {
                    return throwError('Could not found product with id of ' + userId + '!');
                }

                return of(product);
            })
        );
    }

/**
 * Block the User
 *
 * @param user
 */
 // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
 blockUser(user)
 {
    let url = this._commonService.baseUrl + this._apiEndpoint.userData.blockUser;
    url = url + `?ip=${this._commonService.location}&blockedUsrId=${user.userId}&userStatus=${user.userStatus}`;
    return this.tags$.pipe(
        take(1),
        switchMap(tags => this._httpClient.post<InventoryTag>(url,'').pipe(
            map((blocked) => {
                console.log(blocked);
            })
        ))
    );
 }
 // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
 blockUnblockaAccount(account)
 {
    let url = this._commonService.baseUrl + this._apiEndpoint.userData.blockUser;
    url = url + `?ip=${this._commonService.location}&blockedUsrId=${account.userId}&userStatus=${account.userStatus}`;
    return this.tags$.pipe(
        take(1),
        switchMap(tags => this._httpClient.post<InventoryTag>(url,'').pipe(
            map((blocked) => {
                console.log(blocked);
            })
        ))
    );
 }

  // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
  getWallets(userId):
  Observable<{data: any}>
    {
    let url = this._commonService.baseUrl + this._apiEndpoint.userData.user;
    url = `${url}/${this._commonService.selectedUserDetails.userId}/wallet`;
    return this._httpClient.get<{data: any}>(url);
    }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getWalletsTrasaction(userId: any)
    {
    let url = this._commonService.baseUrl + this._apiEndpoint.userData.user;
    url = `${url}/${userId}/transactions`;
        this._httpClient.post<{data: any}>(url, {page:0,pageSize:10,walletId:'1566279497682685954'}).subscribe((wallet)=> {
            this.wallest.next(wallet.data.data);
        });
    }
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
fiatTrasnaction(userTxData):
Observable<{data: any}>
{
    let url = this._commonService.baseUrl + this._apiEndpoint.userData.fiatTransactions;
    url =  `${url}?accountId=${userTxData.accountId}&accountType=${userTxData.accountType}&userIdForTxn=${userTxData.userIdForTxn}`;
    return this._httpClient.get<{data: any}>(url);
}
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
getTxAlert():
Observable<{data: any}>
{
    // Request URL: https://staging.scallopx.com/connector/v1/huntli/transactions/get/62e3887c1126ce6eb0095d88?page=2&pageSize=10
    let url = this._commonService.baseUrl + this._apiEndpoint.connector.getTxTransactions;
    url =  `${url}/62e3887c1126ce6eb0095d88?page=2&pageSize=10`;
    return this._httpClient.get<{data: any}>(url);
}
    /**
     * Delete the product
     *
     * @param id
     */
    deleteProduct(id: string): Observable<boolean>
    {
        return this.products$.pipe(
            take(1),
            switchMap(products => this._httpClient.delete('api/apps/ecommerce/inventory/product', {params: {id}}).pipe(
                map((isDeleted: boolean) => {

                    // Find the index of the deleted product
                    const index = products.findIndex(item => item.id === id);

                    // Delete the product
                    products.splice(index, 1);

                    // Update the products
                    this._products.next(products);

                    // Return the deleted status
                    return isDeleted;
                })
            ))
        );
    }


}
