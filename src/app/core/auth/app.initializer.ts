/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { AuthService } from 'app/core/auth/auth.service';

export function appInitializer(authService: AuthService): any {
    return () => new Promise<void>((resolve) => {
        // attempt to refresh token on app start up to auto authenticate
        authService.refreshToken()
            .subscribe()
            .add(() => resolve());
    });
}
