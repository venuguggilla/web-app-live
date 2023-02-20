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
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { SettingsComponent } from './settings.component';
import { SettingsAccountComponent } from './account/account.component';
import { SettingsSecurityComponent } from './security/security.component';
import { ApiComponent } from './api/api.component';
import { SettingsPlanBillingComponent } from './plan-billing/plan-billing.component';
import { SettingsNotificationsComponent } from './notifications/notifications.component';
import { settingsRoutes } from './settings.routing';
import { FuseCardModule } from '../../../../@fuse/components/card/card.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

import {ClipboardModule} from '@angular/cdk/clipboard';

@NgModule({
    declarations: [
        SettingsComponent,
        ApiComponent,
        SettingsAccountComponent,
        SettingsSecurityComponent,
        SettingsPlanBillingComponent,
        SettingsNotificationsComponent,
    ],
    imports: [
        RouterModule.forChild(settingsRoutes),
        MatButtonModule,
        MatFormFieldModule,
        MatMenuModule,
        MatCheckboxModule,
        MatIconModule,
        MatProgressBarModule,
        MatTableModule,
        MatSortModule,
        MatInputModule,
        MatRadioModule,
        MatSelectModule,
        MatSidenavModule,
        MatSlideToggleModule,
        FuseAlertModule,
        SharedModule,
        ClipboardModule,
        FuseCardModule
    ]
})
export class SettingsModule
{
}
