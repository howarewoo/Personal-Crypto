import { SupportedExchanges } from './SupportedExchanges'
import { SupportedWallets } from './SupportedWallets'

export interface PersonalCryptoAccount {
    name: string;
    exchange?: SupportedExchanges;
    wallet?: SupportedWallets;
    options?: any;
}