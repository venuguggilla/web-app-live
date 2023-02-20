/* eslint-disable */
import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { CommonService } from 'app/services/common/common.service';
import { InventoryService } from '../../../ecommerce/inventory/inventory.service';
import { SettingsComponent } from '../settings.component';

@Component({
    selector       : 'settings-security',
    templateUrl    : './security.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsSecurityComponent implements OnInit
{
    @ViewChild('drawer') drawer: MatDrawer;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = false;
    userData: any;
    selectedBeneficiaries: any;
    /**
     * Constructor
     */
    constructor(
        private _settingsComponent: SettingsComponent,
        private _commonService: CommonService,
        private _fuseConfirmationService: FuseConfirmationService,
        private _inventoryService: InventoryService,
        )
    {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.userData = this._commonService.selectedUserDetails;
        this.selectedBeneficiaries;
    }
    /**
     * Delete the selected product using the form data
     */

     blockSelectedAccount(): void
    {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title  : 'Block Account',
            message: 'Are you sure you want to Block this Account?',
            actions: {
                confirm: {
                    label: 'Block'
                }
            }
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {

            // If the confirm button pressed...
            if ( result === 'confirmed' )
            {

                // Get the product object
                const account = this.selectedBeneficiaries;
                // block the account on the server
                this._inventoryService.blockUnblockaAccount({userId : account.userId,userStatus:'block'}).subscribe(() => {
                });
            }
        });
    }
    activeSelectedUser(): void
    {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title  : 'Active Account',
            message: 'Are you sure you want to Active this Account?',
            actions: {
                confirm: {
                    label: 'Active'
                }
            }
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {

            // If the confirm button pressed...
            if ( result === 'confirmed' )
            {

                // Get the product object
                const account = this.selectedBeneficiaries;
                // block the account on the server
                this._inventoryService.blockUnblockaAccount    ({userId : account.userId,userStatus:'active'}).subscribe(() => {
                    
                });
            }
        });
    
    }
    openSub(userData)
    {
        console.log(userData)
        this._settingsComponent.drawerOpened = false
        this.drawerOpened = true
        this.selectedBeneficiaries = userData
    }
    closeSub()
    {
        this.drawerOpened = false;
        this._settingsComponent.drawerOpened = true
        this.selectedBeneficiaries = null;
    }
}
