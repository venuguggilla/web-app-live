/* eslint-disable @typescript-eslint/naming-convention */
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, UntypedFormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Observable, of, Subject, takeUntil } from 'rxjs';
import { MarketService } from '../market/market.service';
import { WalletService } from '../wallet.service';
import { CryptoService } from './crypto.service';
import { QrCodeDialogComponent } from './qr-code-dialog/qr-code-dialog.component';
@Component({
    selector: 'crypto',
    templateUrl: './crypto.component.html',
    encapsulation: ViewEncapsulation.None
})
export class CryptoComponent implements OnInit, OnDestroy {
    appConfig: any;
    data: any;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;

    wallets$: Observable<any[]>;
    networkList$: Observable<any[]>;
    wallet$: Observable<any>;
    symbol$: Observable<any>;
    isChatRefresh = false;
    assets = [];
    onSelectedAsset = '';
    cryptoTypes = ['send', 'receive', 'swap'];
    cryptoType = new FormControl('send');
    sendForm = this._formBuilder.group({
        wallet: [''],
        asset: [''],
        address: [''],
        amount: [''],
        networkType: [''],
    });
    receiveForm = this._formBuilder.group({
        walletId: [''],
        coinSymbol: [''],
        network: [''],
    });

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(private _formBuilder: UntypedFormBuilder,
        private _activatedRoute: ActivatedRoute,
        private _cryptoService: CryptoService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _walletService: WalletService,
        private _matDialog: MatDialog,
        private _router: Router,
        private _marketService: MarketService
    ) {
        this._marketService.getSymbols('EUR');
        this.wallets$ = this._walletService.wallets$;
        this.wallet$ = this._walletService.wallet$;
        this.symbol$ = this._marketService.symbol$;

        this._activatedRoute.params.subscribe((s) => {
            if (this.cryptoTypes.includes(s['type'])) {
                this.cryptoType.setValue(s['type']);
            }

            this.onSelectedAsset = s['asset'];
        });

        setTimeout(() => {
            this.wallet$.subscribe((res) => {
                if (res) {
                    switch (this.cryptoType.value) {
                        case 'send':
                            this.networkList$ = this._cryptoService.networkList$;
                            this.sendForm.patchValue({
                                wallet: res
                            });
                            break;
                        case 'receive':
                            this.assets = res?.asset || [];
                            const assetTemp = this.onSelectedAsset && this.assets.length
                                && this.assets.some(a => a.fireblockAssetId === this.onSelectedAsset) ?
                                this.assets.find(a => a.fireblockAssetId === this.onSelectedAsset) : this.assets[0];

                            this.receiveForm.patchValue({
                                walletId: res.walletId,
                                coinSymbol: assetTemp.fireblockAssetId
                            });
                            break;
                    }
                }
            });
            if (this.assets.length === 0) {
                this._router.navigate(['/crypto/wallet'], { relativeTo: this._activatedRoute });
            }
        }, 2000);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {

                // Set the drawerMode and drawerOpened if 'lg' breakpoint is active
                if (matchingAliases.includes('lg')) {
                    this.drawerMode = 'side';
                    this.drawerOpened = true;
                }
                else {
                    this.drawerMode = 'over';
                    this.drawerOpened = false;
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the data
        this._cryptoService.data$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {

                // Store the data
                this.data = data;
            });

        this.sendForm.get('wallet').valueChanges.subscribe((val) => {
            if (val) {
                this.assets = val?.asset || [];
                const assetTemp = this.onSelectedAsset && this.assets.length
                    && this.assets.some(a => a.fireblockAssetId === this.onSelectedAsset) ? this.assets.find(a => a.fireblockAssetId === this.onSelectedAsset) : this.assets[0];
                this.sendForm.patchValue({
                    asset: assetTemp
                });
            }
        });

        this.sendForm.get('asset').valueChanges.subscribe((val) => {
            if (val) {
                this._cryptoService.getAllNetworkList(val.fireblockAssetId).subscribe();
                this.sendForm.patchValue({
                    networkType: val.fireblockAssetId
                });
            }
        });

        this.receiveForm.get('coinSymbol').valueChanges.subscribe((val) => {
            if (val) {
                this.isChatRefresh = true;
                const assetTemp = this.assets.some(a => a.fireblockAssetId === val) ? this.assets.find(a => a.fireblockAssetId === val) : null;
                this._marketService.getSymbolById(assetTemp.coinFullName || 'Bitcoin').subscribe();
                this.networkList$ = of(assetTemp.network);

                this.receiveForm.patchValue({
                    network: assetTemp.network[0]
                });
                setTimeout(() => {
                    this.isChatRefresh = false;
                }, 1000);
            }
        });
    }


    onSend(): void {
        console.log(this.sendForm.value, 'this.sendForm.value');
    }

    onReceive(): void {
        console.log(this.receiveForm.value, 'this.receiveForm.value');
        this._walletService.getDepositAddress(this.receiveForm.value).subscribe((response: any) => {
            this.receivePopup(response.data.walletAddress);
        });
    }

    receivePopup(qrValue: string): void {
        // Open the dialog
        const dialogRef = this._matDialog.open(QrCodeDialogComponent, {
            data: {
                title: 'Receive',
                qrValue: qrValue,
            },
        });

        dialogRef.afterClosed().subscribe();
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
