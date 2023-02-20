export interface InventoryProduct
{
    id: string;
    category?: string;
    username: string;
    description?: string;
    tags?: string[];
    userId?: string | null;
    dateOfOnboarding?: string | null;
    brand?: string | null;
    vendor: string | null;
    sumsubQuestionaireRiskScore: number;
    reserved: number;
    cost: number;
    basePrice: number;
    taxPercent: number;
    price: number;
    weight: number;
    userStatus: string;
    images: string[];
    active: boolean;
}

export interface InventoryPagination
{
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}

export interface InventoryCategory
{
    id: string;
    parentId: string;
    name: string;
    slug: string;
}

export interface InventoryBrand
{
    id: string;
    name: string;
    slug: string;
}

export interface InventoryTag
{
    id?: string;
    title?: string;
}

export interface InventoryVendor
{
    id: string;
    name: string;
    slug: string;
}
