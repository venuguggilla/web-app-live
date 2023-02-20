import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { SecurityService } from './security.service';
import { SecurityQuestion } from './security.types';

@Component({
    selector       : 'security',
    templateUrl    : './security.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SecurityComponent implements OnInit
{
    members: any[];
    roles: any[];
    data$: Observable<SecurityQuestion[]>;
    /**
     * Constructor
     */
    constructor(public _securityService: SecurityService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.data$ = this._securityService.data$;
        // Setup the team members
        this.members = [
            {
                avatar: 'assets/images/avatars/male-01.jpg',
                name  : 'Dejesus Michael',
                email : 'dejesusmichael@mail.org',
                role  : 'admin'
            },
            {
                avatar: 'assets/images/avatars/male-03.jpg',
                name  : 'Mclaughlin Steele',
                email : 'mclaughlinsteele@mail.me',
                role  : 'admin'
            },
            {
                avatar: 'assets/images/avatars/female-02.jpg',
                name  : 'Laverne Dodson',
                email : 'lavernedodson@mail.ca',
                role  : 'write'
            },
            {
                avatar: 'assets/images/avatars/female-03.jpg',
                name  : 'Trudy Berg',
                email : 'trudyberg@mail.us',
                role  : 'read'
            },
            {
                avatar: 'assets/images/avatars/male-07.jpg',
                name  : 'Lamb Underwood',
                email : 'lambunderwood@mail.me',
                role  : 'read'
            },
            {
                avatar: 'assets/images/avatars/male-08.jpg',
                name  : 'Mcleod Wagner',
                email : 'mcleodwagner@mail.biz',
                role  : 'read'
            },
            {
                avatar: 'assets/images/avatars/female-07.jpg',
                name  : 'Shannon Kennedy',
                email : 'shannonkennedy@mail.ca',
                role  : 'read'
            }
        ];

        // Setup the roles
        this.roles = [
            {
                label      : 'Disable',
                value      : false,
                description: 'Can read and clone this repository. Can also open and comment on issues and pull requests.'
            },
            {
                label      : 'Enable',
                value      : true,
                description: 'Can read, clone, and push to this repository. Can also manage issues and pull requests.'
            },
        ];
        console.log(this.members, this.roles);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
