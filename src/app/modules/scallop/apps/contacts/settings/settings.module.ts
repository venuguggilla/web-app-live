import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatTableModule} from '@angular/material/table';
import { FuseAlertModule } from '@fuse/components/alert';
import { FuseCardModule } from '@fuse/components/card';
import { SharedModule } from 'app/shared/shared.module';
import { SettingsAccountComponent } from './account/account.component';
import { SettingsNotificationsComponent } from './notifications/notifications.component';
import { SettingsPlanBillingComponent } from './plan-billing/plan-billing.component';
import { SettingsSecurityComponent } from './security/security.component';
import { SettingsComponent } from './settings.component';
import { settingsRoutes } from './settings.routing';
import { SettingsTeamComponent } from './team/team.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { WalletTransationComponent } from './plan-billing/transaction/transaction.component';
import { InventoryComponent } from './transaction/transaction.component';
import { TxAlertComponent } from './tx-alert/tx-alert.component';



@NgModule({
    declarations: [
        SettingsComponent,
        SettingsAccountComponent,
        SettingsSecurityComponent,
        SettingsPlanBillingComponent,
        SettingsNotificationsComponent,
        SettingsTeamComponent,
        WalletTransationComponent,
        InventoryComponent,
        TxAlertComponent
    ],
    imports     : [
        RouterModule.forChild(settingsRoutes),
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatRadioModule,
        MatSelectModule,
        MatSidenavModule,
        MatSlideToggleModule,
        FuseAlertModule,
        SharedModule,
        FuseCardModule,
        MatTableModule,
        MatPaginatorModule
    ]
})
export class SettingsModule
{
}
