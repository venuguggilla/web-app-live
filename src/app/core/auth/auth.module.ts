/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AuthInterceptor } from 'app/core/auth/auth.interceptor';
import { AuthService } from 'app/core/auth/auth.service';
import { appInitializer } from './app.initializer';

@NgModule({
    imports: [
        HttpClientModule
    ],
    providers: [
        AuthService,
        {
            provide: APP_INITIALIZER,
            useFactory: appInitializer, deps: [AuthService], multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        }
    ]
})
export class AuthModule {
}
