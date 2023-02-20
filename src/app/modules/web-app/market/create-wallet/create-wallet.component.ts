import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Observable } from 'rxjs';
import { WalletService } from '../wallet.service';

@Component({
  selector: 'create-wallet',
  templateUrl: './create-wallet.component.html'
})
export class CreateWalletComponent implements OnInit, OnChanges {
  @Input() onSelectedWallet;
  @Output() cancel = new EventEmitter();
  @ViewChild('horizontalStepper', { static: true }) stepper: MatStepper;
  createWalletForm: UntypedFormGroup;
  assets$: Observable<any[]>;
  walletDesign: any;

  constructor(private _formBuilder: UntypedFormBuilder,
    private _walletService: WalletService
  ) {
    // Horizontal stepper form
    // Setup the plans
    this.createWalletForm = this._formBuilder.group({
      step1: this._formBuilder.group({
        walletName: ['', Validators.required]
      }),
      step2: this._formBuilder.group({
        color: ['1', Validators.required],
        texture: ['1', Validators.required],
        icons: ['1', Validators.required]
      }),
      step3: this._formBuilder.group({
        assets: this._formBuilder.array([]),
      })
    });

    // this._walletService.getAssets().subscribe();
    this.assets$ = this._walletService.assets$;
    this.assets$.subscribe((res) => {
      if (res) {
        res.forEach(a => this.assets.push(this._formBuilder.control(a)));
      }
    });
    this.walletDesign = this._walletService.walletDesign$;
  }

  public get assets(): any {
    return this.createWalletForm.get('step3').get('assets') as FormArray;
  }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.

    if ('onSelectedWallet' in changes) {
      this.createWalletForm.get('step1').patchValue({
        walletName: this.onSelectedWallet.walletName
      });

      this.createWalletForm.get('step2').patchValue({
        color: this.onSelectedWallet.color,
        texture: this.onSelectedWallet.texture,
        icons: this.onSelectedWallet.icons
      });

      this.createWalletForm.get('step2').markAsPristine();

      if (!!this.onSelectedWallet.asset.length && this.assets$) {
        this.assets$.subscribe((res) => {
          if (res) {
            res.forEach((a) => {
              const assetTemp = this.onSelectedWallet.asset.some(sa => a.fireblockAssetId === sa.fireblockAssetId) ? a : false;
              this.assets.push(this._formBuilder.control(assetTemp));
            });
          }
        });
      }
    }
  }

  create(): void {
    const wallet = {
      walletType: 'SOFTWARE_WALLET',
      ip: '127.0.0.1',
      ...this.createWalletForm.get('step1').value,
      ...this.createWalletForm.get('step2').value,
      coins: this.createWalletForm.get('step3').value.assets.filter((a: any) => !!a).map((c: any) => c.coinName)
    };

    this._walletService.createWallet(wallet).subscribe(() => {
      this.reset();
    });

  }

  update(): void {
    const wallet = {
      oldWalletName: this.onSelectedWallet.walletName,
      ...this.createWalletForm.get('step1').value,
      ...this.createWalletForm.get('step2').value
    };

    this._walletService.updateWallet(this.onSelectedWallet.walletId, wallet).subscribe(() => {
      this.cancel.emit();
    });
  }

  onSubmit(): void {
    if (!!this.onSelectedWallet?.walletId) {
      this.update();
    } else {
      this.create();
    }
  }

  reset(): void {
    this.stepper.reset();
    this.stepper.selectedIndex = 0;
    this.createWalletForm.reset();
    this.createWalletForm.markAsUntouched();
  }
  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
