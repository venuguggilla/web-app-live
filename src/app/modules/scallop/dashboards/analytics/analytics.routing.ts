import { Route } from '@angular/router';
import { ProjectComponent } from 'app/modules/scallop/dashboards/analytics/analytics.component';
import { ProjectResolver } from 'app/modules/scallop/dashboards/analytics/analytics.resolvers';

export const projectRoutes: Route[] = [
    {
        path     : '',
        component: ProjectComponent,
        resolve  : {
            data: ProjectResolver
        }
    }
];
