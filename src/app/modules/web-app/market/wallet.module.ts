import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from 'app/shared/shared.module';
import { accountRoutes } from './wallet.routing';
import { WalletComponent } from './wallet.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';


import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FuseAlertModule } from '@fuse/components/alert';
import { FuseCardModule } from '@fuse/components/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CreateWalletComponent } from './create-wallet/create-wallet.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MyAssetsComponent } from './my-assets/my-assets.component';
import {MatChipsModule} from '@angular/material/chips';

@NgModule({
    declarations: [
        WalletComponent,
        CreateWalletComponent,
        MyAssetsComponent
    ],
    imports     : [
        RouterModule.forChild(accountRoutes),
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatSelectModule,
        MatSidenavModule,
        MatPaginatorModule,
        MatStepperModule,
        FuseAlertModule,
        FuseCardModule,
        MatSlideToggleModule,
        MatRadioModule,
        MatInputModule,
        MatFormFieldModule,
        MatMenuModule,
        MatProgressBarModule,
        MatSortModule,
        MatTableModule,
        NgApexchartsModule,
        SharedModule,
        MatButtonToggleModule,
        MatChipsModule
    ]
})
export class TransactionModule
{
}
