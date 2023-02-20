import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { SwapService } from '../swap.service';

@Component({
    selector: 'confirm-fiat',
    templateUrl: './confirm.component.html',
    encapsulation: ViewEncapsulation.None
})
export class SwapConfirmPopupComponent implements OnInit {
    selectedDetails: any;
    oparationStatus = 'buy';
    /**
     * Constructor
     */
    constructor(
        public matDialogRef: MatDialogRef<SwapConfirmPopupComponent>,
        private _swapService: SwapService,
    ) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // console.log(this._accountService.)
        this._swapService.selectedDetails$.subscribe((selectedDetails) => {
            this.selectedDetails = selectedDetails;
            this.oparationStatus = selectedDetails.oparationType;
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Save and close
     */
    close(): void {
        // Close the dialog
        this.matDialogRef.close();
    }
    /**
     * continue
     */
    continue(form): void {
        // console.log(this.selectedDetails.finalObject);
        // this.oparationStatus = 'processing';
        // this._swapService.swap(form, this.selectedDetails.finalObject).subscribe((response) => {
        //     this.oparationStatus = 'success';
        // }, () => this.oparationStatus = 'failed');
    }

}
