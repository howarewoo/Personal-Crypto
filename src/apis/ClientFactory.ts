import { SupportedExchanges } from "../models/SupportedExchanges";
import { SupportedWallets } from "../models/SupportedWallets";
import { PersonalCryptoAccount } from "../models/PersonalCryptoAccount";
import { AbstractClient } from "./AbstractClient"
import { AbstractExchange } from "./exchanges/AbstractExchange";
import { AbstractWallet } from "./wallets/AbstractWallet";

import { BinanceUS } from "./exchanges/BinanceUS";
import { Coinbase } from "./exchanges/Coinbase";
import { CoinbasePro } from "./exchanges/CoinbasePro";



export class ClientFactory {

    static getClient(account: PersonalCryptoAccount): AbstractExchange | AbstractWallet | undefined {
        if (account.exchange) {
            return this.getExchangeClient(account)
        }
        else if (account.wallet) {
            return this.getWalletClient(account)
        }
    }

    static getExchangeClient(account: PersonalCryptoAccount): AbstractExchange | undefined {
        switch (account.exchange) {
            case (SupportedExchanges.BINANCE_US): {
                return new BinanceUS(account.options.key, account.options.secret);
            }
            case (SupportedExchanges.COINBASE): {
                return new Coinbase(account.options.key, account.options.secret);
            }
            case (SupportedExchanges.COINBASE_PRO): {
                return new CoinbasePro(account.options.key, account.options.secret, account.options.passphrase);
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

