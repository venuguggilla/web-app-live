import { Route } from '@angular/router';
import { TransactionComponent } from './crypto.component';
import { TransactionResolver } from './crypto.resolvers';

export const accountRoutes: Route[] = [
    {
        path     : '',
        component: TransactionComponent,
        resolve  : {
            data: TransactionResolver
        }
    }
];
