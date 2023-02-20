/* eslint-disable */
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Observable } from 'rxjs';
import { WalletService } from './wallet.service';

@Component({
    selector: 'wallet',
    templateUrl: './wallet.component.html',
})
export class WalletComponent implements OnInit {
    @ViewChild('drawer') drawer: MatDrawer;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = false;
    drawerType = '';
    wallets$: Observable<any[]>;
    walletTotalBalance$: Observable<any[]>;
    assets$: Observable<any[]>;
    onSelectedWallet: any = <any>{};
    walletDesign: any ;

    constructor(private _walletService: WalletService) { }

    ngOnInit() {
        // Get the wallets
        this.wallets$ = this._walletService.wallets$;
        this.walletTotalBalance$ = this._walletService.walletTotalBalance$;
        this.walletDesign = this._walletService.walletDesign$;        
        this.assets$ = this._walletService.assets$;
    }
    /**
        * Track by function for ngFor loops
        *
        * @param index
        * @param item
        */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    openDrawer(dType: string, wallet: any = null) {
        if (wallet) {
            this._walletService.getWalletById(wallet.walletId).subscribe();
            this.onSelectedWallet = wallet;
        }

        this.drawerType = dType;
        this.drawerOpened = true;
    }

    closeSub() {
        this.drawerOpened = false;
    }
}