import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { CommonService } from 'app/services/common/common.service';
import { Observable, of, switchMap, throwError } from 'rxjs';
import { ApiService } from '../../services/common/auth/api.service';

@Injectable()
export class AuthService {

    private _authenticated: boolean = false;
    private refreshTokenTimeout;

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _apiService: ApiService,
        private _commonService: CommonService
    ) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    // eslint-disable-next-line @typescript-eslint/member-ordering
    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post('api/auth/forgot-password', email);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any> {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { user: string; password: string }): Observable<any> {
        // Throw error, if the user is already logged in
        if (this._authenticated) {
            return throwError(() => 'User is already logged in.');
        }
        // userIAmRole = { FINANCE_ADMIN,USER}
        const userData = {
            username: credentials.user,
            password: credentials.password,
            userAgent: 'Mozilla Firefox',
            location: this._apiService.location.city,
            isSentOtp: false,
            ipAddress: this._apiService.location.ip,
            userIAmRole: 'USER',
            accessPlatform: 'WEB'
        };
        //   const user = {
        //     id    : 'cfaad35d-07a3-4447-a6c3-d8c3d54fd5df',
        //     name  : 'venu 22 Brian Hughes',
        //     email : 'hughes.brian@company.com',
        //     avatar: 'assets/images/avatars/brian-hughes.jpg',
        //     status: 'online'
        //   };

        return this._apiService.login(userData).pipe(
            switchMap((response: any) => {

                // Store the access token in the local storage
                this.accessToken = response.data.BearerToken;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                // this._userService.user = user;

                // Start refresh token timer
                this.startRefreshTokenTimer();

                // Return a new observable with the response
                return of(response);
            })
        );
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any> {
        // Sign in using the token
        this.accessToken = this._commonService.getToken();
        // Set the authenticated flag to true
        this._authenticated = true;
        // Return true
        return of(true);
    }

    /**
     * Sign out
     */
    signOut(): Observable<any> {
        this.stopRefreshTokenTimer();
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');

        // Set the authenticated flag to false
        this._authenticated = false;
        this.stopRefreshTokenTimer();

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: { name: string; email: string; password: string; company: string }): Observable<any> {
        return this._httpClient.post('api/auth/sign-up', user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any> {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        // Check if the user is logged in
        if (this._authenticated) {
            return of(true);
        }

        // Check the access token availability
        if (!this.accessToken) {
            return of(false);
        }

        // Check the access token expire date
        if (AuthUtils.isTokenExpired(this.accessToken)) {
            return of(false);
        }

        // If the access token exists and it didn't expire, sign in using it
        return this.signInUsingToken();
    }

    /**
     * Set refresh token
     */
    refreshToken(): Observable<any> {
        if (!this.accessToken) { return of(); }

        // Set jwtToken
        const tokenInfo = { jwtToken: this.accessToken };

        return this._apiService.refreshToken(tokenInfo).pipe(
            switchMap((response: any) => {
                if (!!response?.data?.BearerToken) {
                    // Store the access token in the local storage
                    this.accessToken = response.data.BearerToken;

                    // Set the authenticated flag to true
                    this._authenticated = true;

                    // Start the refresh token timer
                    this.startRefreshTokenTimer();
                } else {
                    // Sign out
                    this.signOut();
                }

                // Return the observable
                return of(response);
            }));
    }

    // helper methods
    private startRefreshTokenTimer(): void {
        // parse json object from base64 encoded jwt token
        const jwtToken = JSON.parse(atob(this.accessToken.split('.')[1]));

        // set a timeout to refresh the token a minute before it expires
        // const expires = new Date(jwtToken.exp * 1000);
        // const timeout = expires.getTime() - Date.now() - (5 * 60 * 1000);

        // set a timeout to refresh the token every 5 minutes
        const timeout = (5 * 60 * 1000);
        this.refreshTokenTimeout = setTimeout(() => {
            this.refreshToken().subscribe();
        }, timeout);
    }

    private stopRefreshTokenTimer(): void {
        clearTimeout(this.refreshTokenTimeout);
    }
}
