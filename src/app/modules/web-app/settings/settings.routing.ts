import { Route } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { SettingsResolver } from './settings.resolvers';

export const settingsRoutes: Route[] = [
    {
        path     : '',
        component: SettingsComponent,
        resolve  : {
            accounts: SettingsResolver
        },
    }
];
