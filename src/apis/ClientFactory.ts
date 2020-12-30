import { BinanceUS } from "./exchanges/BinanceUS";
import { SupportedExchanges } from "../models/SupportedExchanges";
import { SupportedWallets } from "../models/SupportedWallets";
import { PersonalCryptoAccount } from "../models/PersonalCryptoAccount";
import { AbstractClient } from "./AbstractClient"
import { AbstractExchange } from "./exchanges/AbstractExchange";
import { AbstractWallet } from "./wallets/AbstractWallet";


export class ClientFactory {
    constructor() {

    }

    static getClient(account: PersonalCryptoAccount): AbstractExchange | AbstractWallet | undefined {
        if (account.exchange) {
            return this.getExchangeClient(account)
        }
        else if (account.wallet) {
            return this.getWalletClient(account)
        }
        return
    }

    static getExchangeClient(account: PersonalCryptoAccount): AbstractExchange | undefined {
        switch (account.exchange) {
            case (SupportedExchanges.BINANCE_US): {
                return new BinanceUS(account.options.key, account.options.secret);
            }
            default:
                break;
        }
    }

    static getWalletClient(account: PersonalCryptoAccount): AbstractWallet | undefined {
        switch (account.wallet) {
            default:
                break;
        }
        return;
    }
}

