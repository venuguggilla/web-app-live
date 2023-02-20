import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime, map, merge, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { InventoryService } from 'app/modules/scallop/apps/ecommerce/inventory/inventory.service';
import { Router } from '@angular/router';
import { CommonService } from 'app/services/common/common.service';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { PeriodicElement, fiatTransaction } from '../plan-billing/plan-billing.types';
import { WalletTransationComponent } from '../plan-billing/transaction/transaction.component';
import { SettingsComponent } from '../settings.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector       : 'transaction',
    templateUrl    : './transaction.component.html',
    styles         : [
        /* language=SCSS */
        `
            .inventory-grid {
                grid-template-columns: 48px auto 40px;

                @screen sm {
                    grid-template-columns: 48px auto 112px 72px;
                }

                @screen md {
                    grid-template-columns: 48px 112px auto 112px 72px;
                }

                @screen lg {
                    grid-template-columns: 48px 112px auto 220px 96px 96px 72px;
                }
            }
        `
    ],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations     : fuseAnimations
})
export class InventoryComponent
{

    @ViewChild('drawer') drawer: MatDrawer;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = false;
    userData: any;
    fiatTransation: any;
    selectedWallet: any;
    selectedFiatTx;


    // eslint-disable-next-line @typescript-eslint/member-ordering
    @ViewChild(MatPaginator) paginator: MatPaginator;
    /* displayedColumns: string[] = [ 'type', 'amount', 'fromWallet', 'toWallet', 'transactionId', 'ordertype', 'status']; */
    displayedColumns: string[] = [ 'reference', 'paymentId', 'amount', 'currency', 'txStatus'];
    dataSource = new MatTableDataSource<fiatTransaction>();

    /**
     * Constructor
     */
    constructor(
        private _settingsComponent: SettingsComponent,
        private _commonService: CommonService,
        private _inventoryService: InventoryService,
        private _matDialog: MatDialog,
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    //  getWallets
    // this.userData.userId
    // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
    ngOnInit(): void
    {
        this.userData = this._commonService.selectedUserDetails;
        const userDataTx ={
            accountId : this.userData.account[0].ledgerId,
            accountType : this.userData.account[0].accountType,
            userIdForTxn : this.userData.account[0].userId
        };
        this._inventoryService.fiatTrasnaction(userDataTx).subscribe((res) =>{
            console.log(res.data);
            this.fiatTransation = res.data.data;
            console.log(this.fiatTransation);
            this.dataSource.data = this.fiatTransation;
        });
    }



    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    openSub(userData: any)
    {
        this.selectedWallet = userData;
        this._settingsComponent.drawerOpened = false;
        this.drawerOpened = true;
    }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    closeSub()
    {
        this.drawerOpened = false;
        this._settingsComponent.drawerOpened = true;
    }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    selectionn(row: any){
        this.selectedFiatTx = row;
        this._settingsComponent.drawerOpened = false;
        this.drawerOpened = true;
    }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    fiatDetailTxList(data: any){
        console.log(data);
        this.selectedFiatTx = data;
    }
}

