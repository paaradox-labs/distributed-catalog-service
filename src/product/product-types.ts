export interface PriceConfiguration {
    [key: string]: {
        priceType: "base" | "additional";
        availableOptions: Record<string, number>;
    };
}
export interface Product {
    name: string;
    description: string;
    priceConfiguration: PriceConfiguration;
    attributes: { name: string; value: unknown }[];
    tenantId: string;
    categoryId: string;
    image: string;
}
