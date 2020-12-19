export enum SupportedTypes {
    EXCHANGE = "exchange",
    WALLET = "wallet"
}

export interface IPersonalCryptoAccount{
    name: string;
    type: SupportedTypes;
}