import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { UserService } from 'app/services/common/user/user.service';
import { ContactsService } from '../contacts.service';
import {
    MatSnackBar,
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
  } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AccountService } from '../../account/account.service';

@Component({
    selector     : 'wallet-transaction',
    templateUrl  : './transaction.component.html',
    encapsulation: ViewEncapsulation.None
})
export class WalletTransationComponent implements OnInit
{
    composeForm: UntypedFormGroup;
    copyFields: { cc: boolean; bcc: boolean } = {
        cc : false,
        bcc: false
    };

    newAccountDetails: any;
    displayedColumns: string[] = [ 'reference', 'paymentId', 'amount', 'currency', 'status'];
    oparationStatus = 'sendMoneyData';
    walletName = '';
    walletID = '';

    /**
     * Constructor
     */
    constructor(
        public matDialogRef: MatDialogRef<WalletTransationComponent>,
        private _userService: UserService,
        private _accountService: AccountService,
        private _contactsService: ContactsService,
        private _snackBar: MatSnackBar,
        private _router: Router
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        console.log(this._accountService.sendWiseMoneyData.benModule);
        if(this._contactsService?.newAccountDetails?.accountType === 'EUR_ACCOUNT'){
            this.newAccountDetails = this._contactsService.newAccountDetails;
        };
        if(this._accountService?.sendWiseMoneyData?.benModule === 'WISE'){
            console.log(this._accountService?.sendWiseMoneyData);
            this.newAccountDetails = this._accountService?.sendWiseMoneyData;
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Save and close
     */
     close(): void
    {
        // Close the dialog
        this.matDialogRef.close();
    }
    /**
     * Save and close
     */
     sendMoney(): void
    {
        console.log(this.newAccountDetails);
        if(this.newAccountDetails?.accountType === 'EUR_ACCOUNT'){
            console.log(this.newAccountDetails);
            this._contactsService.sendMoney().subscribe((sendRes) =>{
                if(sendRes.status === 201){
                    this.oparationStatus = 'success';
                    this._snackBar.open('successfully sent', 'Close', {
                        horizontalPosition: 'end',
                        verticalPosition: 'top',
                        duration: 2000
                      });
                }else{
                    this.oparationStatus = 'failed';
                    this._snackBar.open('Unable to sent', 'Close', {
                        horizontalPosition: 'end',
                        verticalPosition: 'top',
                        duration: 2000
                      });
                }
                this._router.navigate(['']);
            });
        }else if(this.newAccountDetails?.benModule === 'WISE'){
            this.oparationStatus = 'processing';
            // this._accountService.sendMoney();
            this._accountService.sendMoney().subscribe((sendRes: any) =>{
                if(sendRes.status === 200){
                    this.oparationStatus = 'success';
                    this._snackBar.open('successfully sent', 'Close', {
                        horizontalPosition: 'end',
                        verticalPosition: 'top',
                        duration: 2000
                      });
                }else{
                    this.oparationStatus = 'failed';
                    this._snackBar.open('Unable to sent', 'Close', {
                        horizontalPosition: 'end',
                        verticalPosition: 'top',
                        duration: 2000
                      });
                }
                this._router.navigate(['']);
            });
        }
        // Close the dialog
    }


}
