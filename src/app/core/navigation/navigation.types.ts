import { FuseNavigationItem } from '@fuse/components/navigation';

export interface Navigation {
    data: any;
    compact: FuseNavigationItem[];
    default: FuseNavigationItem[];
    futuristic: FuseNavigationItem[];
    horizontal: FuseNavigationItem[];
}

export const defaulNavData = [
    {
        id: 'finance-dashboard',
        title: 'Your Personalised Dashboard',
        subtitle: '',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'account',
                title: 'Account',
                type: 'basic',
                icon: 'heroicons_outline:cash',
                link: '/finance/account',
            },
            {
                id: 'transaction',
                title: 'Transactions',
                type: 'basic',
                icon: 'heroicons_outline:cash',
                link: '/finance/transaction',
            },
            {
                id: 'beneficiaries',
                title: 'Beneficiaries',
                type: 'basic',
                icon: 'heroicons_outline:cash',
                link: '/finance/beneficiaries',
            },
        ],
    },
    // {
    //     'id': 'crypto-dashboard',
    //     'title': 'Crypto',
    //     'subtitle': 'Unique dashboard designs',
    //     'type': 'group',
    //     'icon': 'heroicons_outline:home',
    //     'children': [
    //         {
    //             'id': 'webapp.crypto',
    //             'title': 'Crypto',
    //             'type': 'basic',
    //             'icon': 'heroicons_outline:cash',
    //             'link': '/crypto/dashboard'
    //         },
    //     ]
    // },
    {
        id: 'crypto-wallet',
        title: 'Crypto Wallet',
        subtitle: '',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'webapp.crypto',
                title: 'Market',
                type: 'basic',
                icon: 'heroicons_outline:cash',
                link: '/crypto/market',
            },
            {
                id: 'webapp.wallet',
                title: 'Wallets',
                type: 'basic',
                icon: 'heroicons_outline:cash',
                link: '/crypto/wallet',
            },
            {
                id: 'webapp.swap',
                title: 'Swap',
                type: 'basic',
                icon: 'heroicons_outline:cash',
                link: '/crypto/swap',
            },
        ],
    },
    {
        id: 'setting-dashboard',
        title: 'Customise',
        subtitle: '',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'webapp.setting',
                title: 'Settings',
                type: 'basic',
                icon: 'heroicons_outline:cash',
                link: '/settings/settings',
            },
        ],
    },
];
