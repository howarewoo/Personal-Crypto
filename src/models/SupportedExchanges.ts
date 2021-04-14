import { IAccountOption, SupportedAccountTypes } from "./SupportedAccountTypes";

export enum SupportedExchanges {
    BINANCE_US = "Binance US",
    COINBASE = "Coinbase",
    COINBASE_PRO = "Coinbase Pro",
    KUCOIN = "KuCoin",
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
    },
    {
        name: SupportedExchanges.COINBASE,
        type: SupportedAccountTypes.EXCHANGE,
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
    },
    {
        name: SupportedExchanges.COINBASE_PRO,
        type: SupportedAccountTypes.EXCHANGE,
        options: [
            {
                id: 'key',
                label: 'API Key'
            },
            {
                id: 'secret',
                label: 'API Secret Key',
                secure: true
            },
            {
                id: 'passphrase',
                label: 'API Passphrase',
                secure: true
            }
        ]
    },
    {
        name: SupportedExchanges.KUCOIN,
        type: SupportedAccountTypes.EXCHANGE,
        options: [
            {
                id: 'version',
                label: 'API Key Version'
            },
            {
                id: 'key',
                label: 'API Key'
            },
            {
                id: 'secret',
                label: 'API Secret Key',
                secure: true
            },
            {
                id: 'passphrase',
                label: 'API Passphrase',
                secure: true
            }
        ]
    }
]