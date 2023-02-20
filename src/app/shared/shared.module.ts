import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MiniTradeViewComponent } from './components/trade-view/mini-trade-view/mini-trade-view.component';
import { RealTimeTradeViewComponent } from './components/trade-view/real-time-trade-view/real-time-trade-view.component';

@NgModule({
    declarations: [
        MiniTradeViewComponent,
        RealTimeTradeViewComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MiniTradeViewComponent,
        RealTimeTradeViewComponent
    ]
})
export class SharedModule
{
}
