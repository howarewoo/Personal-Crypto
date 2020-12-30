import { IAccountOption, SupportedAccountTypes } from "./SupportedAccountTypes";

export enum SupportedExchanges {
    BINANCE_US = "Binance US",
}

export interface IExchangeInfo {
    name: SupportedExchanges;
    type: SupportedAccountTypes;
    options: IAccountOption[];
}

export const SupportedExchangeInfo: IExchangeInfo[] = [
    {
        name: SupportedExchanges.BINANCE_US,
        type: SupportedAccountTypes.EXCHANGE,
        // image: binancePNG,
        options: [
            {
                id: 'key',
                label: 'API Key'
            },
            {
                id: 'secret',
                label: 'API Secret Key',
                secure: true
            }
        ]
    }
]