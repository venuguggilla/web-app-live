import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Subject, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { CommonService } from 'app/services/common/common.service';
import { Router } from '@angular/router';

@Component({
    selector       : 'settings',
    templateUrl    : './settings.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnInit, OnDestroy
{
    @ViewChild('drawer') drawer: MatDrawer;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    panels: any[] = [];
    selectedPanel: string = 'info';
    userData: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _commonService: CommonService,
        private _router: Router,
    )
    {
        if(!this._commonService.selectedUserDetails){
            this._router.navigate(['/apps/CUSTOMER_MANAGEMENT']);
            }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.userData = this._commonService.selectedUserDetails;
        // Setup available panels
        this.panels = [
            {
                id         : 'info',
                icon       : 'heroicons_outline:user-circle',
                title      : 'User Info',
                description: 'Manage your public profile and private information'
            },
            {
                id         : 'bankAccount',
                icon       : 'heroicons_outline:lock-closed',
                title      : 'Bank Account',
                description: 'Manage your password and 2-step verification preferences'
            },
            {
                id         : 'wallet',
                icon       : 'heroicons_outline:credit-card',
                title      : 'Wallet',
                description: 'Manage your subscription plan, payment method and billing information'
            },
            {
                id         : 'transaction',
                icon       : 'heroicons_outline:bell',
                title      : 'Transaction',
                description: 'Manage when you\'ll be notified on which channels'
            },
            {
                id         : 'txAlert',
                icon       : 'heroicons_outline:user-group',
                title      : 'Tx Alert',
                description: 'Manage your existing team and change roles/permissions'
            }
        ];

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {

                // Set the drawerMode and drawerOpened
                if ( matchingAliases.includes('lg') )
                {
                    this.drawerMode = 'side';
                    this.drawerOpened = true;
                }
                else
                {
                    this.drawerMode = 'over';
                    this.drawerOpened = false;
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Navigate to the panel
     *
     * @param panel
     */
    goToPanel(panel: string): void
    {
        this.selectedPanel = panel;

        // Close the drawer on 'over' mode
        if ( this.drawerMode === 'over' )
        {
            this.drawer.close();
        }
    }

    /**
     * Get the details of the panel
     *
     * @param id
     */
    getPanelInfo(id: string): any
    {
        return this.panels.find(panel => panel.id === id);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
