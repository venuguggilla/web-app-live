/* eslint-disable quotes */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { CommonService } from 'app/services/common/common.service';
import * as CryptoJS from 'crypto-js';
import Base64 from 'crypto-js/enc-base64';
import { pki, cipher, util } from 'node-forge';
import { JSEncrypt } from 'jsencrypt';
import NodeRSA from 'node-rsa';
@Injectable({
    providedIn: 'root',
})
export class EncryptDecryptService {
    $encrypt: any;
    private _aeskey: string = CryptoJS.enc.Utf8.parse('916126e16081447785302b8a8c25e676');
    private defaultCipherOption: CryptoJS.CipherOption;
    readonly publicKey: string = `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAlw6phf6gzAtczbDLNdlH3NjSd5rOJ/dooEwyQshPAPeDZ+QCviNuWoLBmDk2+SbEB3hjT4hGNw1rbjIdem2VI7oYGsuny91+iFBzVeTWg1NVcdwF/zgk830QhcHn1sJxSzNZPR6bweEoCBGgbHIMlIBs0QiFj0EhCgHK9WXbuG2BdTcxwqESFLeymQ3BnC3aWOzEhVI11EwxsJI+L83XuATsAZSvG+hnJwP8XeOV8PmggWcHgbidFZkKzuuA+bd6108irGEwm1cFHxbMdsAm8d5+xjGqxpy7bbvuTkSBN5LL3iTnBPdim/NHaLaUxhycSYvjgqbnZ1w9+kbB+b0wywIDAQAB`;
    readonly privateKey: string = `MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCXDqmF/qDMC1zNsMs12Ufc2NJ3ms4n92igTDJCyE8A94Nn5AK+I25agsGYOTb5JsQHeGNPiEY3DWtuMh16bZUjuhgay6fL3X6IUHNV5NaDU1Vx3AX/OCTzfRCFwefWwnFLM1k9HpvB4SgIEaBscgyUgGzRCIWPQSEKAcr1Zdu4bYF1NzHCoRIUt7KZDcGcLdpY7MSFUjXUTDGwkj4vzde4BOwBlK8b6GcnA/xd45Xw+aCBZweBuJ0VmQrO64D5t3rXTyKsYTCbVwUfFsx2wCbx3n7GMarGnLttu+5ORIE3ksveJOcE92Kb80dotpTGHJxJi+OCpudnXD36RsH5vTDLAgMBAAECggEALMCTSLdfPBRBsk6mZZWxzKQP9o9OdFjADn2EhnSBs2+g5q6OgXZNw1LpuAd7WeU6PlxUT8O3yaeYJFWEljjQ7ny7l3SuiZ9dVVVAVjots0qFDe55eFtR1zE+K+J+pQmGNxlHXuwqiQ4DpiBSvs4rG/PQST2VFBPfje9qCbnblo+imoxryqP5Hv/SP4ceDeGKjEdJfYCbn/i8vlMHkWL/EEjVzjHKRNn8vgYvqJE7mK7EuXquctaf1+2w/OlwrCplXCxQtsmAmYqXOkpexhcvS9LIqCxRpff8rM9cfy0HGAZMink5BrpxhyNjrmdK9U75ZXlWGwMPW38PMPrJF4YhAQKBgQD8Tub00eygor9fzHKu2cN2lbtR20SnCwpqzhwSazdR2vmwVVwkVNPGSCw2wrMl+HRPJwiw1m29+qW99INVhmOMX2FjY4wORmfZ02ahAlfL129nNeyoxu/VD8/v6q9M8Z9P0Q6TTCTgDrca0JhbGRRW7HTWrOMvYNM/vF5Usk1A8QKBgQCZRH5azbBHost6XOJo3uaItY/hxu1EGUI9++Kh2OlsnEfNxn2gGj+JqitytyExgFkM5Kkf9SrFLSAd/FbnIYpWzpx2kV+jMC9ldM3mrPjK31Z0xNam1XY58wRypbLd7InWwPXLBT/jrY12TRUi1ODWqAzgeeBFz0jTapr6K37NewKBgQD3RcjZ5Sb4Y6gVFkTLEkabYLF9ztxgrdReynL+pi9IPMh6xZ2RScVnTXJvlK+IphAvRr0gunZBO3XWTd2tIxFLEGtcwcIQd3XuKF4rrCUpdJEM4O94lceU03Nh2WpGiYMt8WBMgdKd+C4BzK+UkGa7re/wOO5Kj6VZkJ4OedR2sQKBgFL+/TFsyvWv2WIUpGJHuizzrMuFbnx+9RkdqnccQCMZaeSrhOHK9Pc2WDrRoj7tEsvhkxgEKjoGGqtCN0kIJ6KkVaP7Sv/SmwfkvY8ZwcwSLv4ijV5gn5n32EPBKN/2NBo/+ZoL6LIBDGawjS6EepCjBf4U4XbMLdKWmv+3x/27AoGAQe49bRN/zZI4wO6p4HIOSFzvkhWIlbxytH60TdX21gsxDmEn6eI1f9VwbCHQhLFJYupRgGjgKn5FjwpvbDrEpw0agv/PZrU0R5HQSTDAsMVNvc6mmmJpB+Tg0qHWudJVnS6itrb/OUPfYujsxko3MSANkvkrLVwJ8hRBeqM0WIk=`;

    /**
     * Constructor
     */
    constructor(private _commonService: CommonService) {
        const _key = '916126e16081447785302b8a8c25e676';
        this.defaultCipherOption = {
            keySize: 256,
            iv: CryptoJS.enc.Utf8.parse(_key.substring(0, 16)),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
            base: Base64,
        };
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Encrypt password
     *
     * @param data
     *
     * @param cipherOption
     */
    encryptUsingAES256(
        data: any,
        cipherOption?: CryptoJS.CipherOption
    ): string {
        return CryptoJS.AES.encrypt(
            JSON.stringify(data),
            this._aeskey,
            cipherOption || this.defaultCipherOption
        ).toString();
    }

    /**
     * Decrypt password
     *
     * @param encryptedData
     *
     * @param cipherOption
     */
    decryptUsingAES256(
        encryptedData,
        cipherOption?: CryptoJS.CipherOption
    ): string {
        const _key = encryptedData.decrypKey;
        const defaultCipherOption = {
            keySize: 256,
            iv: CryptoJS.enc.Utf8.parse(_key.substring(0, 16)),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
            base: Base64,
        };
        return CryptoJS.AES.decrypt(
            encryptedData.encryptdata,
            CryptoJS.enc.Utf8.parse(encryptedData.decrypKey),
            cipherOption || defaultCipherOption
        ).toString(CryptoJS.enc.Utf8);
    }

    /**
     * AES Encrypt
     *
     * @param data     *
     */
    aesEncrypt(data: any): string {
        const _key = this._commonService.cryptoAesKey;
        const c = cipher.createCipher('AES-CBC', _key);

        c.start({ iv: _key.substring(0, 16), tagLength: 256 });
        c.update(util.createBuffer(JSON.stringify(data), 'utf8'));
        c.finish();

        return util.encode64(c.output.getBytes());
    }

    /**
     * AES Decrypt
     *
     * @param encryptedData     *
     */
    aesDecrypt(encryptedKey: string, encryptedData: string): string {
        const _key = encryptedKey;
        console.log(_key);
        const d = cipher.createDecipher('AES-CBC', _key);
        d.start({ iv: _key.substring(0, 16), tagLength: 256 });
        d.update(new util.ByteStringBuffer(util.decode64(encryptedData)));
        d.finish();
        console.log(d.output.toString());
        // return d.output.toString();
        return;
    }

    /**
     * RSA Encrypt With PublicKey
     *
     * @param valueToEncrypt     *
     */
    rsaEncryptWithPublicKey(valueToEncrypt: any): string {
        this.$encrypt = new JSEncrypt();
        this.$encrypt.setPublicKey(this.publicKey);
		return this.$encrypt.encrypt('this is venu');

    }

    /**
     * RSA Encrypt With PrivateKey
     *
     * @param valueToDecrypt     *
     */
    rsaDecryptWithPrivateKey(valueToEncrypt: any): string {
        this.$encrypt = new JSEncrypt();
        this.$encrypt.setPrivateKey(this.privateKey);
        return this.$encrypt.decrypt(valueToEncrypt);
    }

    /**
     * SHA512 sign , verify
     *
     * @param valueSignVerify     *
     */
     signVerify(valueSignVerify: any): string {
        // const decryptionKey = new NodeRSA(this.publicKey);
        // console.log('decryptionKey',decryptionKey);
        // const verify = createVerify('SHA256');
        // verify.write('some data to sign');
        // verify.end();
        // console.log(verify.verify(this.publicKey, valueSignVerify, 'hex'));
        return;
    }
}
