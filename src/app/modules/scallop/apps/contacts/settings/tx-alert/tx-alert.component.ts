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
    selector       : 'tx-alert',
    templateUrl    : './tx-alert.component.html',
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
export class TxAlertComponent
{

    @ViewChild('drawer') drawer: MatDrawer;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = false;
    userData: any;
    txAlert: any;
    selectedWallet: any;
    selectedTxAlert;
    selectedTab: any;
    txAlertDetailedMenus;


    // eslint-disable-next-line @typescript-eslint/member-ordering
    @ViewChild(MatPaginator) paginator: MatPaginator;
    displayedColumns: string[] = [ 'txTransactionDate', 'txAmount', 'txStatus', 'txScore'];
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

    // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
    ngOnInit(): void
    {
        this.txAlertDetailedMenus = [
            {
            selectedMenu : 'transactionInfo',
            name : 'Transaction Info',
            description : 'TransactionInfo'
            },
            {
            selectedMenu : 'mappedTransactionFields',
            name : 'Mapped Transaction Fields',
            description : 'MappedTransactionFields'
            },
            {
            selectedMenu : 'rulesAppleid',
            name : 'Rules Appleid',
            description : 'RulesAppleid'
            }
        ];
        this.selectedTab = this.txAlertDetailedMenus[0];
        this.userData = this._commonService.selectedUserDetails;
        this._inventoryService.getTxAlert().subscribe((txAlert) =>{
            this.txAlert = txAlert.data.content;
            console.log(this.txAlert);
            this.dataSource.data = this.txAlert;
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
        this.selectedTxAlert = row;
        this._settingsComponent.drawerOpened = false;
        this.drawerOpened = true;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    tabSelected(data: any){
        this.selectedTab = data;
    }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    exportPDF(){
      /* setTimeout( (r) => {
      },3000);
      kendo.drawing
        .drawDOM("#pdfcontent",
          {
            paperSize: "A2",
            margin: { top: "0.8cm", bottom: "1cm" },
            scale: 0.8,
            height: 400,
          })
        .then(function (group) {
          kendo.drawing.pdf.saveAs(group, "Exported.pdf")
        }); */
    }
}

