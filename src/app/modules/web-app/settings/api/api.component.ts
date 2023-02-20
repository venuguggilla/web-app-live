import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation,ChangeDetectorRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup ,Validators} from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDrawer } from '@angular/material/sidenav';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'app/services/common/common.service';
import { SettingService } from '../setting.service';
import { SettingsComponent } from '../settings.component';

@Component({
    selector       : 'webapp-api-setting',
    templateUrl    : './api.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApiComponent implements OnInit
{
    @ViewChild('drawer') drawer: MatDrawer;
    dataSource: MatTableDataSource<any> = new MatTableDataSource();
    assetesTableColumns: string[] = ['tokenName','expiryOn','fullAccess','action'];
    accesss: any = [
        {label: 'Full access', value: 'fullAccess', checked: false},
        {label: 'Read only', value: 'readOnly', checked: true},
        ];
    getKeysForm: UntypedFormGroup;
    genarateApiForm: UntypedFormGroup;
    updateApiForm: UntypedFormGroup;
    newKeys: UntypedFormGroup;
    clientSecretAvalabale: boolean = false ;
    getUserName: any;
    getLocation: any;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = false;
    shoePublicKeyinput: boolean = false;
    updateApiFormCheckbox: boolean = false;
    showPublicKey: boolean = false;
    newFrom: boolean = true;
    createError: string = '';
    updateError: string = '';
    currentName: string = '';
    favoriteSeason: string;
    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _commonService: CommonService,
        private _settingService: SettingService,
        private changeDetectorRef: ChangeDetectorRef,
        private _settingsComponent: SettingsComponent,
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
        this.getUserName = this._commonService.getUserName();
        this.getLocation = JSON.parse(this._commonService.getLocation());
        // Create the form
        this.genarateApiForm = this._formBuilder.group({
            tokenName  : ['', Validators.required],
            expiryInDays  : ['365', Validators.required],
            readScope  : [false, Validators.required],
            writeScope  : [false, Validators.required],
            publicKey  : [null],
            userName  : [this.getUserName, Validators.required],
            ipAddress      : [this.getLocation.ip, Validators.required],
            // shoePublicKeyinput      : [false],
        });
        this.updateApiForm = this._formBuilder.group({
            tokenName  : ['', Validators.required],
            expiryInDays  : ['365', Validators.required],
            readScope  : [false, Validators.required],
            writeScope  : [false, Validators.required],
            publicKey  : [null],
            userName  : [this.getUserName, Validators.required],
            ipAddress      : [this.getLocation.ip, Validators.required],
            // shoePublicKeyinput      : [false],
        });
        this.newKeys = this._formBuilder.group({
            tokenName  : [''],
            publicKey  : [''],
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        const getUserId = this._commonService.getUserId();
        this.getAllUserAPIKey();
    }
    getAllUserAPIKey(): void{
        this._settingService.getAllUserAPIKey().subscribe((userAPIKey: any) =>{
            console.log(userAPIKey);
            if(userAPIKey.status === 200 && userAPIKey.message === 'No data found'){
                this.clientSecretAvalabale = false;
                this.changeDetectorRef.detectChanges();
            }else{
                this.dataSource.data = userAPIKey.data;
                this.changeDetectorRef.detectChanges();
            }
        });
    }
    openForm(): void{
        this.showPublicKey = false;
        this._settingsComponent.drawerOpened = false;
        this.drawerOpened = true;
    }
    generateClientSecret(): void{
        // console.log(this.genarateApiForm.value);
        const finalObject = this.genarateApiForm.value;
        this._settingService.generateUserAPIKey(finalObject).subscribe((aipKey: any) =>{
            console.log(aipKey);
            if(aipKey.status === 200 && aipKey.message === 'OK'){
                this.newKeys.get('tokenName').setValue(this.genarateApiForm.get('tokenName').value);
                this.newKeys.get('publicKey').setValue(aipKey.data);
                this.showPublicKey = true;
                this.getAllUserAPIKey();
            }else{
                this.createError = 'unable to generate user API Key';
            }
        });
    }
    deleteUserAPIKey(tokenName): void{
        this._settingService.deleteUserAPIKey(tokenName).subscribe((deleteKey: any) =>{
            if(deleteKey.status === 200 && deleteKey.message === 'OK'){
                this.getAllUserAPIKey();
            }
        });
    }
    edit(tokenName): void{
        // console.log(tokenName);
        this.drawerOpened = true;
        this.updateError = '';
        this.newFrom = false;
        this.currentName = tokenName.tokenName;
        this._settingsComponent.drawerOpened = false;
        this.updateApiForm.get('tokenName').setValue(tokenName.tokenName);
        this.updateApiForm.get('publicKey').setValue(tokenName.publicKey);
        this.updateApiForm.get('writeScope').setValue(tokenName.writeScope);
        this.updateApiForm.get('readScope').setValue(tokenName.readScope);
        // if(tokenName.publicKey){
        //     this.updateApiFormCheckbox = true;
        //     this.shoePublicKeyinput = true;
        // }else{
        //     this.updateApiFormCheckbox = false;
        //     this.shoePublicKeyinput = false;
        // }
        if(tokenName.writeScope === true){
            this.accesss.forEach((element) => {
                if(element.value === 'fullAccess'){
                    element.checked = true;
                }else{
                    element.checked = false;
                }
            });
        }else{
            this.accesss.forEach((element) => {
                if(element.value === 'readOnly'){
                    element.checked = true;
                }else{
                    element.checked = false;
                }
            });
        }
        // accesss: any = [
        //     {label: 'Full access', element: 'fullAccess', checked: false},
        //     {label: 'Read only', value: 'readOnly', checked: true},
        //     ];
        // this._settingService.deleteUserAPIKey(tokenName).subscribe((deleteKey: any) =>{
        //     if(deleteKey.status === 200 && deleteKey.message === 'OK'){
        //         this.getAllUserAPIKey();
        //     }
        // });
    }
    update(): void{
        // const finalObject = this.updateApiForm.value;
        const finalObject = {
            tokenName:this.updateApiForm.get('tokenName').value,
            readScope:this.updateApiForm.get('readScope').value,
            writeScope:this.updateApiForm.get('writeScope').value
        };
        // this.updateApiForm.get('tokenName').setValue(tokenName.tokenName);
        // this.updateApiForm.get('publicKey').setValue(tokenName.publicKey);
        // this.updateApiForm.get('writeScope').setValue(tokenName.writeScope);
        // this.updateApiForm.get('readScope').setValue(tokenName.readScope);
        this.updateError = '';
        this._settingService.updateUserAPIKey(finalObject,this.currentName ).subscribe((update: any) =>{
            if(update.status === 200 && update.message === 'OK'){
                this.getAllUserAPIKey();
                this.closeSub();
            }else{
               this.updateError = update.message;
               this.changeDetectorRef.detectChanges();
            }
        });
    }

    closeSub(): void{
        this.drawerOpened = false;
        this.newFrom = true;
        this.showPublicKey = false;
        this._settingsComponent.drawerOpened = true;
    }

    publicKey(event: MatCheckboxChange): void {
        this.shoePublicKeyinput = event.checked;
        if(!event.checked){
            console.log(event.checked);
            this.genarateApiForm.get('publicKey').setValue(null);
        }
    }
    radioChange(event): void{
        console.log(event);
        if(event.value === 'fullAccess'){
            this.genarateApiForm.get('writeScope').setValue(true);
            this.genarateApiForm.get('readScope').setValue(true);
        }else{
            this.genarateApiForm.get('writeScope').setValue(false);
            this.genarateApiForm.get('readScope').setValue(true);
        }
    }
    radioUpdate(event): void{
        console.log(event);
        if(event.value === 'fullAccess'){
            this.updateApiForm.get('writeScope').setValue(true);
            this.updateApiForm.get('readScope').setValue(true);
        }else{
            this.updateApiForm.get('writeScope').setValue(false);
            this.updateApiForm.get('readScope').setValue(true);
        }
    }
}
