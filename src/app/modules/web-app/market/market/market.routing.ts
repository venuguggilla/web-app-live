import { Route } from '@angular/router';
import { MarketComponent } from './market.component';
import { MarketResolver } from './market.resolvers';

export const cryptoRoutes: Route[] = [
    {
        path     : '',
        component: MarketComponent,
        resolve  : {
            data: MarketResolver
        }
    }
];
