import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { ApiEndpointService } from 'app/services/common/api-endpoint.service';
import { CommonService } from 'app/services/common/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Contact } from '../beneficiaries/contacts.types';

@Injectable({
    providedIn: 'root'
})
export class AccountService
{
    sendWiseMoneyData: any;
    public _selectedAccount: BehaviorSubject<any> = new BehaviorSubject(null);
    public _exchangeAmount: BehaviorSubject<any> = new BehaviorSubject(null);
    public _selectedData: BehaviorSubject<any> = new BehaviorSubject(null);
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);
    private _getBeneficiaries: BehaviorSubject<any> = new BehaviorSubject(null);
    private _getBeneficiariesID: BehaviorSubject<any> = new BehaviorSubject(null);


    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _apiEndpoint: ApiEndpointService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
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
    get selectedAccount$(): Observable<any>
    {
        return this._selectedAccount.asObservable();
    }
    get exchangeAmount$(): Observable<any>
    {
        return this._exchangeAmount.asObservable();
    }
    get selectedData$(): Observable<any>
    {
        return this._selectedData.asObservable();
    }
    get getBeneficiaries$(): Observable<any>
    {
        return this._getBeneficiaries.asObservable();
    }
    get getBeneficiariesID$(): Observable<any>
    {
        return this._getBeneficiariesID.asObservable();
    }
  /**
   * Get Exhange Calculation
   */
   loadOtherAccount(): Observable<any> {
    return this._httpClient.get(`${this._commonService.baseUrl}account/v1/multi-currency-account`);
}
 /**
  * Get Exhange Calculation
  */
  convertBalance(finalObject): Observable<any> {
    return this._httpClient.post(`${this._commonService.baseUrl}account/v1/convert-balance/33064549`,finalObject);
}
 /**
  * Get Exhange Calculation
  */
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getBeneficiaries(data){
    const url = `${this._commonService.baseUrl}account/v1/users/beneficiary/${data.accountType}?benModule=${data.benModule}`;
        return this._httpClient.get(url).subscribe((beneficiaries: any) =>{
            console.log('res',beneficiaries);
            this._getBeneficiaries.next(beneficiaries.data);
            this._router.navigate(['/finance/beneficiaries'], {relativeTo: this._activatedRoute});
        });
}
 /**
  * Get Exhange Calculation
  */
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  sendMoney(){
    // https://staging.scallopx.com/account/v1/send/329316464/
    const data ={
        'sourceAmount': this.sendWiseMoneyData.sourceAmount,
        'sourceCurrency': this.sendWiseMoneyData.sourceCurrency,
        'targetCurrency': this.sendWiseMoneyData.targetCurrency,
        'reference': this.sendWiseMoneyData.reference
    };
    const url = `${this._commonService.baseUrl}account/v1/send/${this.sendWiseMoneyData.benId}/money`;
    console.log(url,'url');
    console.log(data,'data');

    return this._httpClient.post(url,data);
}
/**
 * Get contact by id
 */
 getContactById(id: string): Observable<Contact>
 {
     return this._getBeneficiaries.pipe(
         take(1),
         map((contacts) => {

             // Find the contact
             const contact = contacts.find(item => item.id === id) || null;

             // Update the contact
             this._getBeneficiariesID.next(contact);

             // Return the contact
             return contact;
         }),
         switchMap((contact) => {

             if ( !contact )
             {
                 return throwError('Could not found contact with id of ' + id + '!');
             }

             return of(contact);
         })
     );
 }

}
