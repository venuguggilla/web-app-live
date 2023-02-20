import { Route } from '@angular/router';
import { WalletComponent } from './wallet.component';
import { WalletResolver } from './wallet.resolvers';

export const accountRoutes: Route[] = [
    {
        path     : '',
        component: WalletComponent,
        resolve  : {
            data: WalletResolver
        }
    }
];
