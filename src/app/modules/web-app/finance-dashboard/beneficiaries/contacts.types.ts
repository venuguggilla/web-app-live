export interface Contact22
{
    id: string;
    avatar?: string | null;
    background?: string | null;
    name: string;
    emails?: {
        email: string;
        label: string;
    }[];
    phoneNumbers?: {
        country: string;
        phoneNumber: string;
        label: string;
    }[];
    title?: string;
    company?: string;
    birthday?: string | null;
    address?: string | null;
    notes?: string | null;
    tags: string[];
}

export interface Country
{
    id: string;
    iso: string;
    name: string;
    code: string;
    flagImagePos: string;
}

export interface Tag
{
    id?: string;
    title?: string;
}


export interface Contact {
    id: string;
    customerId: string;
    userId: string;
    benId: string;
    name: string;
    birthdate: string;
    emailAddress: any;
    phoneNumber: any;
    redirectedDestination: any;
    defaultReference: string;
    status: string;
    created: string;
    accountId: string;
    externalReference: string;
    approvalRequired: boolean;
    updated: string;
    address: any;
    qualifier: any;
    approvalRequestId: any;
    approvalStatus: string;
    accountType: string;
    country: any;
    profileImage: string;
    hasThumbnail: boolean;
    thumbnailPath: string;
    accessGroups: any[];
    destinationIdentifier: DestinationIdentifier;
    tags: string[];
  }

  export interface DestinationIdentifier {
    type: string;
    accountNumber: any;
    sortCode: any;
    iban: string;
    bic: any;
    currency: string;
    countrySpecificDetails: any;
  }
