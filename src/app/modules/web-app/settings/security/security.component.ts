/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'app/services/common/common.service';
import { SettingService } from '../setting.service';

@Component({
    selector       : 'webapp-settings-security',
    templateUrl    : './security.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsSecurityComponent implements OnInit
{
    form: FormGroup;
    passwordChanged: string = '';
    constructor(
        private fb: FormBuilder,
        private _settingService: SettingService,) {}
    /**
     * Constructor
     */


    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.form = this.fb.group(
            {
                currentPassword: ['', [Validators.required,],],
                newPassword: ['',[Validators.required,Validators.minLength(8),Validators.maxLength(100),]],
                confirmPassword: ['',[Validators.required,Validators.minLength(8),Validators.maxLength(100),]],
            },
            { validator: CustomValidators.MatchingPasswords }
          );
    }
    password(formGroup: FormGroup) {
        this.passwordChanged = '';
        const { value: password } = formGroup.get('newPassword');
        const { value: confirmPassword } = formGroup.get('confirmpassword');
        return password === confirmPassword ? null : { passwordNotMatch: true };
      };
      changePassword(): void{
        this.passwordChanged = '';
        const finalObject = {
            newPassword: this.form.get('confirmPassword').value,
            oldPassword: this.form.get('currentPassword').value
        };
        this._settingService.changePassowrd(finalObject).subscribe((changed: any) =>{
            if(changed.status === 200){
                this.passwordChanged = 'changed';
            }else{
                this.passwordChanged = 'unable to change';
            }
        });
        // console.log(finalObject);
      }
}
export class CustomValidators {

    static MatchingPasswords(control: AbstractControl) {
        const password = control.get('newPassword').value;
        const confirmPassword = control.get('confirmPassword').value;
        const currentErrors = control.get('confirmPassword').errors;
        const confirmControl = control.get('confirmPassword');

        if (compare(password, confirmPassword)) {
            confirmControl.setErrors({...currentErrors, not_matching: true});
        } else {
            confirmControl.setErrors(currentErrors);
        }
    }
}

function compare(password: string,confirmPassword: string) {
    return password !== confirmPassword && confirmPassword !== '';
}
