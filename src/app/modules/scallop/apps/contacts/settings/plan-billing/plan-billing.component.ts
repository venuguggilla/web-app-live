/* eslint-disable */
import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatDrawer } from '@angular/material/sidenav';
import { CommonService } from 'app/services/common/common.service';
import { InventoryService } from '../../../ecommerce/inventory/inventory.service';
import { SettingsComponent } from '../settings.component';
import { PeriodicElement } from './plan-billing.types';
import { WalletTransationComponent } from './transaction/transaction.component';
// const ELEMENT_DATA: PeriodicElement[] = [
//     {amountt: 1, type: 'Hydrogen', fromWallet: 1.0079, toWallet: 'H', transactionId: 'H', ordertype: 'H', status: 'H'}
//   ];
@Component({
    selector       : 'wallet',
    templateUrl    : './plan-billing.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsPlanBillingComponent implements OnInit
{
    @ViewChild('drawer') drawer: MatDrawer;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = false;
    userData: any;
    walletData = {};
    selectedWallet: any;
    selectedWalletAsset;


    @ViewChild(MatPaginator) paginator: MatPaginator;
    private transactionData: PeriodicElement[] = [];
  

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
    ngOnInit(): void
    {
        this.userData = this._commonService.selectedUserDetails;
        this._inventoryService.getWallets(this.userData.userId).subscribe((wallet) => {
           this.walletData = wallet.data;
        //    console.log(wallet);
        });
    }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    // checkTransaction2(data: { userId: any }){
    //     this._inventoryService.getWalletsTrasaction(data.userId).subscribe((transaction) => {
    //         this.transactionData = transaction.data.data;
    //         console.log(this.transactionData)
    //         this.dataSource.data = this.transactionData;
    //      });
    // }
    checkTransaction(data: { userId: any }): void
    {
        // Open the dialog
        // const dialogRef = this._matDialog.open(WalletTransationComponent);
        this._inventoryService.getWalletsTrasaction(data.userId);

        // dialogRef.afterClosed().subscribe((result) => {
        //     console.log('Compose dialog was closed!');
        // });
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    openSub(userData: any)
    {
        this.selectedWallet = userData;
        this.selectedWalletAsset = userData.asset;
        this._settingsComponent.drawerOpened = false;
        this.drawerOpened = true;
    }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    closeSub()
    {
        this.drawerOpened = false;
        this._settingsComponent.drawerOpened = true;
    }
}
