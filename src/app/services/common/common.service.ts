/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { FuseNavigationItem } from '@fuse/components/navigation';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  jwtHelper = new JwtHelperService();


  devapi = 'https://devapi.scallopx.com/';
  staging='https://staging.scallopx.com/';
  prodApi = 'https://api.scallopx.com/';
  menus = [];
  baseUrl = this.staging;
  cryptoAesKey = '18be463906624114aaeca439f3377e87';

  constructor() { }
  location = '49.206.44.136';
  individual = 'INDIVIDUAL';
  selectedUserDetails;
  newAccount: boolean = false;

  hardcodedName = {
    name:'XYZ Ltd',
    fullName:'XYZ Ltd',
    emailId:'demoscallop@scallopx.com'
  };

  walletDesign = {
    background: [
      {img: '',
      value: '0',
        id: '0',},
      {
        img: './assets/wallet_background/walletCardBg1.png',
        value: '1',
        id: '1'
      },
      {
        img: './assets/wallet_background/walletCardBg2.png',
        value: '2',
        id: '2'
      },
      {
        img: './assets/wallet_background/walletCardBg3.png',
        value: '3',
        id: '3'
      },
      {
        img: './assets/wallet_background/walletCardBg4.png',
        value: '4',
        id: '4'
      },
      {
        img: './assets/wallet_background/walletCardBg5.png',
        value: '5',
        id: '5'
      },
      {
        img: './assets/wallet_background/walletCardBg6.png',
        value: '6',
        id: '6'
      },
      {
        img: './assets/wallet_background/walletCardBg7.png',
        value: '7',
        id: '7'
      },
      {
        img: './assets/wallet_background/walletCardBg8.png',
        value: '8',
        id: '8'
      }
    ],
    texture: [
      {img: '',
      value: '0',
        id: '0',},
      {img: './assets/wallet_pattern/walletPatternBg1.png',
      value: '1',
        id: '1'
      },
      {img: './assets/wallet_pattern/walletPatternBg2.png',
      value: '2',
        id: '2'
      },
      {img: './assets/wallet_pattern/walletPatternBg3.png',
      value: '3',
        id: '3'
      },
      {img: './assets/wallet_pattern/walletPatternBg4.png',
      value: '4',
        id: '4'
      },
      {img: './assets/wallet_pattern/walletPatternBg5.png',
      value: '5',
        id: '5'
      },
      {img: './assets/wallet_pattern/walletPatternBg6.png',
      value: '6',
        id: '6'
      },
      {img: './assets/wallet_pattern/walletPatternBg7.png',
      value: '7',
        id: '7'
      },
    ],
    icon: [
      {img: '',
      value: '0',
        id: '0',},
      {img: './assets/wallet_icons/cardIconVector1.png',
      value: '1',
        id: '1',},
      {img: './assets/wallet_icons/cardIconVector2.png',
      value: '2',
        id: '2',},
      {img: './assets/wallet_icons/cardIconVector3.png',
      value: '3',
        id: '3',},
      {img: './assets/wallet_icons/cardIconVector4.png',
      value: '4',
        id: '4',},
      {img: './assets/wallet_icons/cardIconVector5.png',
      value: '5',
        id: '5',},
      ]
 };

 // eslint-disable-next-line @typescript-eslint/member-ordering
  get accessToken(): string
    {
        return localStorage.getItem('accessToken') ?? '';
    }
  get locationData(): string
    {
        return localStorage.getItem('locationData') ?? '';
    }
    get ipAddress(): string
    {
        return localStorage.getItem('ip') ?? '';
    }

  getToken(): string {
    return  this.accessToken;
  }
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getLocation(): any  {
    return  this.locationData;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getIpAddress(): any  {
    return  this.ipAddress;
  }

  getRoleId(): string {
    return  btoa(this.jwtHelper.decodeToken(this.accessToken).roleId);
  }
  getUserRole(): string {
    return  btoa(this.jwtHelper.decodeToken(this.accessToken));
  }

 // eslint-disable-next-line @typescript-eslint/member-ordering
  getUserId(): string {
    return  this.jwtHelper.decodeToken(this.accessToken).userId;
  }
  // eslint-disable-next-line @typescript-eslint/member-ordering
  getUserName(): string {
    return  this.jwtHelper.decodeToken(this.accessToken).username;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  userData(data){
    console.log('user data', data);
    this.selectedUserDetails = data;
  }

  private readonly _horizontalNavigation: FuseNavigationItem[] = this.menus;
}
