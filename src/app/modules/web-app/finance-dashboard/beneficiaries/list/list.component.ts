import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormControl } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { filter, fromEvent, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { ContactsService } from '../contacts.service';
import { Contact, Country } from '../contacts.types';
import { CommonService } from 'app/services/common/common.service';
import { UserService } from 'app/services/common/user/user.service';
import { AccountService } from '../../account/account.service';

@Component({
    selector: 'contacts-list',
    templateUrl: './list.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactsListComponent implements OnInit, OnDestroy {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;

    contacts$: Observable<Contact[]>;

    contactsCount: number = 0;
    contactsTableColumns: string[] = ['name', 'email', 'phoneNumber', 'job'];
    countries: Country[];
    drawerMode: 'side' | 'over';
    openSlider: boolean = false;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedContact: Contact;
    selectedAccountType: 'EUR_ACCOUNT';
    selectedCurrency = 'EUR';
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _contactsService: ContactsService,
        private _accountService: AccountService,
        @Inject(DOCUMENT) private _document: any,
        private _router: Router,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _commonService: CommonService,
        private _userService: UserService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // this.selectedCury();
        this._accountService.selectedData$.subscribe((res) =>{
            if(res !== null){
                this.selectedAccountType = res.accountType;
                this.selectedCurrency = res.accountType.substring(0, 3);
                this.selectedCury();
            }else{
                const data = {
                    accountType :'EUR',
                    benModule :'MODULR',
                    // accountType :'SGD',
                    // benModule :'WISE',
                };
                this._accountService.getBeneficiaries(data);
                this.selectedCury();
                }
        });
        if(this.selectedAccountType === 'EUR_ACCOUNT'){
            this.contacts$ = this._contactsService.contacts$;
            this._contactsService.contacts$
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((contacts: Contact[]) => {
                    // Update the counts
                    this.contactsCount = contacts.length;
                    // Mark for check
                    this._changeDetectorRef.markForCheck();
                });
        }
        if (this._commonService.newAccount) {
            this.openSlider = true;
            // this._router.navigate(['/new'], {relativeTo: this._activatedRoute});
            // Create the contact
            this._contactsService.createContact().subscribe((newContact) => {

                // Go to the new contact
                this._router.navigate(['./', newContact.id], { relativeTo: this._activatedRoute });

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
        }
        // Get the contacts

        // Get the contact
        this._contactsService.contact$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((contact: Contact) => {
                // Update the selected contact
                this.selectedContact = contact;
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the countries
        this._contactsService.countries$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((countries: Country[]) => {

                // Update the countries
                this.countries = countries;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                switchMap(query =>

                    // Search
                    this._contactsService.searchContacts(query)
                )
            )
            .subscribe();

        // Subscribe to MatDrawer opened change
        this.matDrawer.openedChange.subscribe((opened) => {
            this.openSlider = opened;
            if (!opened) {
                // Remove the selected contact when drawer closed
                this.selectedContact = null;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            }
        });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {

                // Set the drawerMode if the given breakpoint is active
                if (matchingAliases.includes('lg')) {
                    this.drawerMode = 'side';
                }
                else {
                    this.drawerMode = 'over';
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Listen for shortcuts
        fromEvent(this._document, 'keydown')
            .pipe(
                takeUntil(this._unsubscribeAll),
                filter<KeyboardEvent>(event =>
                    (event.ctrlKey === true || event.metaKey) // Ctrl or Cmd
                    && (event.key === '/') // '/'
                )
            )
            .subscribe(() => {
                this.createContact();
            });
    }
    selectedCury(): void {
        this.contacts$ = this._accountService.getBeneficiaries$;
            this._accountService.getBeneficiaries$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((contacts: Contact[]) => {
                this.contactsCount = contacts?.length ?? 0;
                this._changeDetectorRef.markForCheck();
        });
    }
    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * On backdrop clicked
     */
    onBackdropClicked(): void {
        // Go back to the list
        this._router.navigate(['./'], { relativeTo: this._activatedRoute });

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Create contact
     */
    createContact(): void {
        this._commonService.newAccount = true;
        // Create the contact
        this._contactsService.createContact().subscribe((newContact) => {

            // Go to the new contact
            this._router.navigate(['./', newContact.id], { relativeTo: this._activatedRoute });

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
    editModeNew(): void {
        this._commonService.newAccount = false;
    }
}
