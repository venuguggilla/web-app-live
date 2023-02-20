import { Injectable } from '@angular/core';
import { CommonService } from 'app/services/common/common.service';
@Injectable({
  providedIn: 'root'
})
export class ApiEndpointService {


  location = 'https://ipinfo.io/?token=c3671aac833bab';

  auth = {
    login: 'auth',
    refreshToken: 'account/v1/refreshToken'
  };

  rolePermission = {
    getRoleGroup: 'account/admin/role/groups',
    updateRole: 'account/admin/role',
    getRole: 'account/admin/role/group/',
    getPermission: 'account/admin/permissions'
  };

  getRole = {
    getRolePermission: 'account/admin/role/permissions',
    postRolePermission: 'account/admin/assign/role',
  };

  userData = {
    getAllUser: 'account/admin/users',
    user: 'account/admin/user',
    blockUser: 'account/admin/user-status',
    fiatTransactions: 'account/admin/accounts/transactions',
  };

  connector = {
    getTxTransactions: 'connector/v1/huntli/transactions/get',
  };

  account = {
    getSecurityQuestions: 'account/admin/security-questions',
  };

  webApp = {
    userData: {
      getUser: 'account/v1/users',
      getTxTransactions:'account/v1/accounts/transactions',
      profile: 'account/v1/users/profile/data',
      primaryCurrency: 'account/v1/users/primary/currency/data',
      pin: 'account/v1/users/pin/data',
      ledger: 'account/v1/users/ledger/data',
      beneficiary: 'account/v1/users/beneficiary/data',
      account: 'account/v1/users/account/data',
      wallet: 'account/v1/wallet',
      getAllWallet: 'account/v1/user/wallet',
      walletAssets: 'account/v1/user/wallet/assets?walletName=Wallet 1',
      portfolioBalance: 'account/v1/user/wallet/portfolio/balance?walletName=Wallet 1',
      totalPortfolioBalance: 'account/v1/wallet/total-portfolio/balance',
      totalAccountBalance: 'account/v1/users/total/account/balance/data',
    },
    payment: {
      send: 'account/v1/users/payment',
    },
    wallet: {
      getAll: 'account/v1/wallet',
      create: 'v1/wallet',
      update: 'account/v1/wallet/',
      totalBalance: 'account/v1/wallet/total-portfolio/balance',
      totalBalanceByUser: 'account/v1/wallet/total-portfolio/balance/',
      getDepositAddress: 'account/v1/wallet/get-deposit-address'
    },
    asset: {
      getAll: 'account/v1/get-all-coin-list'
    },
    swap : {
      getAllWallets : 'account/v1/swap/get-all-wallets',
      getPriceRespectToPair : 'account/v1/swap/get-price-respect-to-pair',
      getExhangeCalculation : 'v1/swap/get-exhange-calculation',
      getExchangeFee : 'v1/swap/get-exchange-fee',
      swap : 'v1/swap/'
    },
    beneficiary : {
      get : 'account/v1/users/beneficiary/'
    },
    setting : {
      api : {
        generateUserAPIKey: 'account/user/generateUserAPIKey',
        getAllUserAPIKey: 'account/user/getAllUserAPIKeys',
        updateUserAPIKey: 'account/user/updateUserAPIKey?tokenName=',
        deleteUserAPIKey: 'account/user/deleteUserAPIKey?tokenName=',
      },
      security : {
        changesPassword: 'account/v1/users/password/change',
      }
    },
  };

  constructor(private _commonService: CommonService) { }
}
