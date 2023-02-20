import { Route } from '@angular/router';
import { SecurityComponent } from './security.component';
import { SecurityResolver } from './security.resolvers';

export const securityRoutes: Route[] = [
    {
        path     : '',
        component: SecurityComponent,
        resolve  : {
            data: SecurityResolver
        }
    }
];
