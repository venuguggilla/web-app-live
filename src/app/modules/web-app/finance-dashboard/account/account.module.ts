import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from 'app/shared/shared.module';
import { accountRoutes } from './account.routing';
import { AccountComponent } from './account.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ReceiveFiatComponent } from './receive-popup/receive.component';
import { FuseCardModule } from '@fuse/components/card';
import { ExchangeFiatComponent } from './receive-popup copy/exchange.component';

@NgModule({
    declarations: [
        AccountComponent,
        ReceiveFiatComponent,
        ExchangeFiatComponent
    ],
    imports     : [
        RouterModule.forChild(accountRoutes),
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        MatSelectModule,
        MatInputModule,
        MatProgressBarModule,
        MatRadioModule,
        MatSortModule,
        MatTableModule,
        NgApexchartsModule,
        MatButtonToggleModule,
        SharedModule,
        FuseCardModule
    ]
})
export class AccountModule
{
}
