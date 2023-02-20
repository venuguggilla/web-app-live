import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { UserService } from 'app/services/common/user/user.service';
import { AccountService } from '../account.service';
import {
    MatSnackBar,
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
  } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
    selector     : 'receive-fiat',
    templateUrl  : './receive.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ReceiveFiatComponent implements OnInit
{

    selectedAccountDetails: any;
    /**
     * Constructor
     */
    constructor(
        public matDialogRef: MatDialogRef<ReceiveFiatComponent>,
        private _accountService: AccountService,
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
        // console.log(this._accountService.)
        this._accountService.selectedAccount$.subscribe((selectedAccount)=>{
            this.selectedAccountDetails = selectedAccount;
            console.log(selectedAccount);
        });
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

}
