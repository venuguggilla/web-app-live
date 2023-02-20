import { Route } from '@angular/router';
import { ContactsComponent } from './contacts.component';
import { CanDeactivateContactsDetails } from './contacts.guards';
import { ContactsTagsResolver, ContactsResolver, ContactsCountriesResolver, ContactsContactResolver } from './contacts.resolvers';
import { ContactsDetailsComponent } from './details/details.component';
import { ContactsListComponent } from './list/list.component';

export const contactsRoutes: Route[] = [
    {
        path     : '',
        component: ContactsComponent,
        resolve  : {
            tags: ContactsTagsResolver
        },
        children : [
            {
                path     : '',
                component: ContactsListComponent,
                resolve  : {
                    contacts : ContactsResolver,
                    countries: ContactsCountriesResolver
                },
                children : [
                    {path: 'details', loadChildren: () => import('app/modules/scallop/apps/contacts/settings/settings.module').then(m => m.SettingsModule)},
                ]
            }
        ]
    }
];
