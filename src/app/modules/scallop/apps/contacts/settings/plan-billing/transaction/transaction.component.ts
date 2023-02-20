import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { InventoryService } from 'app/modules/scallop/apps/ecommerce/inventory/inventory.service';
import { PeriodicElement } from '../plan-billing.types';

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


    displayedColumns: string[] = [ 'reference', 'paymentId', 'amount', 'currency', 'status'];
    dataSource = new MatTableDataSource<PeriodicElement>();
    walletName = '';
    walletID = '';

    /**
     * Constructor
     */
    constructor(
        public matDialogRef: MatDialogRef<WalletTransationComponent>,
        private _inventoryService: InventoryService
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
        this._inventoryService.wallest.subscribe((transaction)=>{
            this.dataSource.data = transaction;
            this.walletName = transaction[0].walletName;
            this.walletID = transaction[0].walletId;
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
