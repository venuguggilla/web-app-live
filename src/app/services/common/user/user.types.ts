export interface UserTotalDetails
{
    id: string;
    name: string;
    username: string;
    firstName: string;
    email: string;
    avatar?: string;
    status?: string;
}
export interface User
{
    id: string;
    name: string;
    username: string;
    firstName: string;
    email: string;
    avatar?: string;
    status?: string;
}
export interface PrimeryCurrency
{
    symbol: string;
}

export interface AccountDetails
{
    symbolo: string;
    id: string;
    userId: string;
    ledgerId: string;
    accountType: string;
    bankModule: string;
    lock: false;
    modulrCustomerId: string;
    primary: false;
    accountName: string;
    balance: string;
    availableBalance: string;
    iban: string;
    bic: string;
    imageUrl: string;

}
