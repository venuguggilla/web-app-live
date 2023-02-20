/* eslint-disable max-len */
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { catchError, Observable, throwError } from 'rxjs';
import { EncryptDecryptService } from './encrypt-decrypt.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    /**
     * Constructor
     */
    constructor(private _authService: AuthService,
        private _encryptDecryptService: EncryptDecryptService) {
    }

    /**
     * Intercept
     *
     * @param req
     * @param next
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Clone the request object
        let newReq = req.clone();

        // Request
        //
        // If the access token didn't expire, add the Authorization header.
        // We won't add the Authorization header if the access token expired.
        // This will force the server to return a "401 Unauthorized" response
        // for the protected API routes which our response interceptor will
        // catch and delete the access token from the local storage while logging
        // the user out from the app.
        if (this._authService.accessToken && !AuthUtils.isTokenExpired(this._authService.accessToken)) {
            newReq = req.clone({
                headers: req.headers.set('Authorization', 'Bearer ' + this._authService.accessToken)
            });
        }

        const dummyData  = {
            'amountRespectToOne': 'this.sellFromData.amountRespectToOne',
            'amountToCreditOrDebit': 'this.sellForm.getvalue',
            'coinImage': 'this.sellFromData.coinImage',
            'exchangeFee': 'this.sellFromData.exchangeFee',
            'fromAddress': 'this.sellFromData.toAddress',
            'fromWalletId': 'his.sellFromData.toWalletId',
            'oacurrentPrice': 'this.sellFromData.oacurrentPrice',
            'quantity': 'his.sellForm.getvalue',
            'side': 'sell',
            'subType': 'MARKET_SELL',
            'symbol': 'this.sellFromData.selectedAssetsSymbol+',
            'toAccountId': 'account.ledgerId',
            'toAccountName': 'account.accountName',
            'toBic': 'account.bic',
            'toIban': 'account.iban',
            'type': 'BEST_RATE'
        };
        const data = {
            cd : 200,
            message : 'Success',
            ekey : 'Gw3JkC7YVBBVZQpfQ8Tz7+ImYocZfLb7dX0RoQucKOCRpS9IOuDj8tJWM4DNUVgkbhaWxXLzO5fTw468Z5hL7gg2bNw5wrS94koOmlMVYC15T+eETzSyDZb2rxqCLCYyTbl7AMcunWO4uJF6o2kvnuDrgCweIvJwvJldemg4W2rf0IfWEvg6Ektud3gvHrNIG7fzR0lr7TWnn5t1AFrVBeHzCSB9aUCABRyjcqp88EURNX+TxDq7mnprYFyd8qJ3JLwoAod/KUOPrTwbGHu9mu1cmzaIo5RivTg/q5pek1yb6V9svGXnzb19RuzbnidXsYPAaSI9aov4kwm4jv3weA==',
            edta : 'pwh1hFKoC5W+JM0sUfkmfR1vnK+7H05Vh7/t/P94IAhXvOXj7zKoWp07KpNO4mLSpmSzSwPG2tq2eX47krf6EeEOTy5Kq3nYU4eQBm+X24mHHQz8ykM3W6wXsRPXQEYxCRUZP35zGkq14XRzvPuoMJbzn15rSJeql+G2NStaXYGuA11j7FnSIuD7q4wm4ykcagGlGfRtxf/UqLI7Zp1HuB08v9aiCXbSb+xowFqTnvfRCDqUzPSCC/ZK4gQR+sSxJYhTsSC6EE4jHTPEI4VnYtpWHcNfTlcKm9AZzFKUBVQ0yjWVnKXzFNP0Kcc+V8OeTmc1iqQoCIqlWLmIQaFOhLoe+cntDePKTHff+go/BrTiV2xiUt27r+977QqLCBRo17MoqLRkK3yDmg0R890i/g==',
            sign : 'KquJUbrF/N5tPu1LBLNgFA6tsKRCYdgmN/P3EvMv7WlQ5RDF0WuWn/EZ4C6QlGs04P02AJyXaif5AI4EwNHCIDgtGFYJET4G8ZhKUgEtAaKAMFpDSzDJwGXgiaBiH3+MYHtKteh5CsyJtfJq8pk6Nsm34Hmw57cDq5RrDnkxYSj8KhdVbNzl5RT3QnzkS7c8Td+M2fl+dwNzws5ncw03WuTbBICnwPDIe1+W2M7ROh41CDX1HbdeJKzLRY4zqRdHyy+N9sES90b9y8442OVP9+zC4gvPtzy66BAlTpss3EwXD6i6htEvwYqG9xFeKUrOs+uuBlMadMpsjb3/qSG2nA=='
        };

        const signVerify = this._encryptDecryptService.signVerify(data.sign);


        const rsadecrypt = this._encryptDecryptService.rsaDecryptWithPrivateKey(data.ekey);
        // console.log('rsa decryptedDataB--<<--<', rsadecrypt);

        const decrypKey ={
            decrypKey : rsadecrypt,
            encryptdata: data.edta
        };
        const decryptedData = this._encryptDecryptService.decryptUsingAES256(decrypKey);
        console.log('decryptedDataB--<<--<', decryptedData);

        //  const encryptedData = this._encryptDecryptService.aesEncrypt(dummyData);
        // console.log('encryptedData-->>-->', encryptedData);

        // const encryptedRsaData = 'Gw3JkC7YVBBVZQpfQ8Tz7+ImYocZfLb7dX0RoQucKOCRpS9IOuDj8tJWM4DNUVgkbhaWxXLzO5fTw468Z5hL7gg2bNw5wrS94koOmlMVYC15T+eETzSyDZb2rxqCLCYyTbl7AMcunWO4uJF6o2kvnuDrgCweIvJwvJldemg4W2rf0IfWEvg6Ektud3gvHrNIG7fzR0lr7TWnn5t1AFrVBeHzCSB9aUCABRyjcqp88EURNX+TxDq7mnprYFyd8qJ3JLwoAod/KUOPrTwbGHu9mu1cmzaIo5RivTg/q5pek1yb6V9svGXnzb19RuzbnidXsYPAaSI9aov4kwm4jv3weA==';
        // console.log('encryptedRsaData-->>-->', encryptedRsaData);

        // const rsaEncrypted = this._encryptDecryptService.rsaEncryptWithPublicKey(dummyData);
        // console.log('rsa encryptedData--<<--<', rsaEncrypted);


        // Response
        return next.handle(newReq).pipe(
            catchError((error) => {

                // Catch "401 Unauthorized" responses
                if (error instanceof HttpErrorResponse && error.status === 401) {
                    console.log('interceptor', error.error.message);
                    // Sign out
                    this._authService.signOut();

                    // Reload the app
                    if (error.error.message === 'Unauthorized') {
                        location.reload();
                    }
                }
                return throwError(() => error);
            })
        );
    }
}

