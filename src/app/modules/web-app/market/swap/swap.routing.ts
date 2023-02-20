import { Route } from '@angular/router';
import { SwapComponent } from './swap.component';
import { SwapResolver } from './swap.resolvers';

export const swapRoutes: Route[] = [
    {
        path     : '',
        component: SwapComponent,
        resolve  : {
            data: SwapResolver
        }
    }
];
