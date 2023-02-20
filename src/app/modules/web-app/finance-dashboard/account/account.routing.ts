import { Route } from '@angular/router';
import { AccountComponent } from './account.component';
import { AccountResolver } from './account.resolvers';

export const accountRoutes: Route[] = [
    {
        path     : '',
        component: AccountComponent,
        resolve  : {
            data: AccountResolver
        }
    }
];
