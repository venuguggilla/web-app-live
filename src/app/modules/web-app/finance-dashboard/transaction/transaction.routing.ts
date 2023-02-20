import { Route } from '@angular/router';
import { TransactionComponent } from './transaction.component';
import { TransactionResolver } from './transaction.resolvers';

export const accountRoutes: Route[] = [
    {
        path     : '',
        component: TransactionComponent,
        resolve  : {
            data: TransactionResolver
        }
    }
];
