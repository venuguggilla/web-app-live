import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from 'app/shared/shared.module';
import { SwapComponent } from './swap.component';
import { swapRoutes } from './swap.routing';
import { FuseCardModule } from '../../../../../@fuse/components/card/card.module';
import { SwapConfirmPopupComponent } from './confirm-popup/confirm.component';
import { BuyComponent } from './buy/buy.component';
import { SellComponent } from './sell/sell.component';
import { ExchangeComponent } from './exchange/exchange.component';

@NgModule({
    declarations: [
        SwapComponent,
        SwapConfirmPopupComponent,
        BuyComponent,
        SellComponent,
        ExchangeComponent
    ],
    imports: [
        RouterModule.forChild(swapRoutes),
        MatButtonModule,
        MatButtonToggleModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatSelectModule,
        MatSidenavModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        MatDividerModule,
        NgApexchartsModule,
        SharedModule,
        FuseCardModule
    ]
})
export class SwapModule
{
}
