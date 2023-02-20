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
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from 'app/shared/shared.module';
import { CryptoComponent } from './crypto.component';
import { cryptoRoutes } from './crypto.routing';
import { QrCodeDialogComponent } from './qr-code-dialog/qr-code-dialog.component';
import { QrCodeModule } from 'ng-qrcode';

@NgModule({
    declarations: [
        CryptoComponent,
        QrCodeDialogComponent
    ],
    imports     : [
        RouterModule.forChild(cryptoRoutes),
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
        NgApexchartsModule,
        QrCodeModule,
        SharedModule
    ],
    entryComponents : [QrCodeDialogComponent]
})
export class CryptoModule
{
}
