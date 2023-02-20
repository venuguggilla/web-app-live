import { Route } from '@angular/router';
import { CanDeactivateContactsDetails } from 'app/modules/admin/apps/contacts/contacts.guards';
import { ContactsComponent } from './contacts.component';
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
                    {
                        path         : ':id',
                        component    : ContactsDetailsComponent,
                        resolve      : {
                            contact  : ContactsContactResolver,
                            countries: ContactsCountriesResolver
                        },
                        canDeactivate: [CanDeactivateContactsDetails]
                    }
                ]
            }
        ]
    }
];
