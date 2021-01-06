import { AbstractExchange } from './AbstractExchange';

import { enc, HmacSHA256 } from 'crypto-js';
import { PersonalCryptoHolding } from '../../models/PersonalCryptoHolding';

export class CoinbasePro extends AbstractExchange {
    constructor(key: string, secret: string, passphrase: string) {
        super();
        this._APIKEY = key;
        this._APISECRET = secret;
        this._PASSPHRASE = passphrase;
    }

    private _APIKEY: string;
    private _APISECRET: string;
    private _PASSPHRASE: string;
    private base: string = "https://api.pro.coinbase.com";

    private _getSignature(prehash: string): string {
        const secret = enc.Base64.parse(this._APISECRET)
        const hash = HmacSHA256(prehash, secret)
        return enc.Base64.stringify(hash)
    }

    private async _getHeaders(path: string, body: string = "") {
        const headers = new Headers();
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const prehash = timestamp + "GET" + path + body

        headers.append('CB-ACCESS-TIMESTAMP', timestamp);
        headers.append('CB-ACCESS-KEY', this._APIKEY);
        headers.append('CB-ACCESS-SIGN', this._getSignature(prehash));
        headers.append('CB-ACCESS-PASSPHRASE', this._PASSPHRASE);
        return headers
    }

    async getAccounts(): Promise<ICoinbaseProAccount[]> {
        const path = '/accounts?limit=100'
        const url = this.base + path;
        const headers = await this._getHeaders(path);

        const resp = await this.fetchWithProxy(url, { headers })
        const data = await resp.json()
        return data
    }

    async getHoldings(): Promise<PersonalCryptoHolding[]> {
        let accounts: ICoinbaseProAccount[] = await this.getAccounts()
        accounts = accounts.filter((a) => (parseFloat(a.balance) > 0))

        const holdings: PersonalCryptoHolding[] = [];
        for (let account of accounts) {
            const quantity = parseFloat(account.balance)
            if (quantity > 0) {
                holdings.push({
                    ticker: account.currency,
                    quantity,
                })
            }
        }

        return holdings
    }
}

interface ICoinbaseProAccount {
    balance: string;
    currency: string
}