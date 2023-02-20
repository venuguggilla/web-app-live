import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { compactNavigation, defaultNavigation, futuristicNavigation, horizontalNavigation } from 'app/mock-api/common/navigation/data';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { ApiEndpointService } from 'app/services/common/api-endpoint.service';
import { CommonService } from 'app/services/common/common.service';

@Injectable({
    providedIn: 'root'
})
export class NavigationMockApi
{
    private readonly _compactNavigation: FuseNavigationItem[] = compactNavigation;
    private readonly _defaultNavigation: FuseNavigationItem[] = defaultNavigation;
    private readonly _futuristicNavigation: FuseNavigationItem[] = futuristicNavigation;
    private readonly _horizontalNavigation: FuseNavigationItem[] = horizontalNavigation;

    /**
     * Constructor
     */
    constructor(
        private _fuseMockApiService: FuseMockApiService,
        private _navigationService: NavigationService,
        private _apiEndpoint: ApiEndpointService,
        private _commonService: CommonService)
    {
        // Register Mock API handlers
        this.registerHandlers();
        // this._navigationService.navigation$.subscribe((navigatio) => {
        //     console.log('2',navigatio);
            // const defaultNavigation = [
            //     {
            //         id      : 'dashboards',
            //         title   : 'Dashboards',
            //         subtitle: 'Unique dashboard designs',
            //         type    : 'group',
            //         icon    : 'heroicons_outline:home',
            //         children: [
            //             {
            //                 id   : 'dashboards.project',
            //                 title: 'Project',
            //                 type : 'basic',
            //                 icon : 'heroicons_outline:clipboard-check',
            //                 link : '/dashboards/project'
            //             }
            //         ]
            //     },
            //     {
            //         id      : 'apps',
            //         title   : 'Applications',
            //         subtitle: 'Custom made application designs',
            //         type    : 'group',
            //         icon    : 'heroicons_outline:home',
            //         children: [
            //             {
            //                 id   : 'pages.settings',
            //                 title: 'Settings',
            //                 type : 'basic',
            //                 icon : 'heroicons_outline:cog',
            //                 link : '/pages/settings'
            //             }
            //         ]
            //     }
            // ];
        // });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void
    {
        // -----------------------------------------------------------------------------------------------------
        // @ Navigation - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/common/navigation')
            // .onGet(this._commonService.baseUrl + this._apiEndpoint.rolePermission.getPermission)
            .reply(() => {
                console.log('33');
                // Fill compact navigation children using the default navigation
                this._compactNavigation.forEach((compactNavItem) => {
                    this._defaultNavigation.forEach((defaultNavItem) => {
                        if ( defaultNavItem.id === compactNavItem.id )
                        {
                            compactNavItem.children = cloneDeep(defaultNavItem.children);
                        }
                    });
                });

                // Fill futuristic navigation children using the default navigation
                this._futuristicNavigation.forEach((futuristicNavItem) => {
                    this._defaultNavigation.forEach((defaultNavItem) => {
                        if ( defaultNavItem.id === futuristicNavItem.id )
                        {
                            futuristicNavItem.children = cloneDeep(defaultNavItem.children);
                        }
                    });
                });

                // Fill horizontal navigation children using the default navigation
                this._horizontalNavigation.forEach((horizontalNavItem) => {
                    this._defaultNavigation.forEach((defaultNavItem) => {
                        if ( defaultNavItem.id === horizontalNavItem.id )
                        {
                            horizontalNavItem.children = cloneDeep(defaultNavItem.children);
                        }
                    });
                });
                // Return the response
                return [
                    200,
                    {
                        compact   : cloneDeep(this._compactNavigation),
                        default   : cloneDeep(this._defaultNavigation),
                        futuristic: cloneDeep(this._futuristicNavigation),
                        horizontal: cloneDeep(this._horizontalNavigation)
                    }
                ];
            });
    }
}
