import { AbstractExchange } from './AbstractExchange';

import { enc, HmacSHA256 } from 'crypto-js';
import { PersonalCryptoHolding } from '../../models/PersonalCryptoHolding';

export class Coinbase extends AbstractExchange {
    constructor(key: string, secret?: string) {
        super();
        this._APIKEY = key;
        this._APISECRET = secret;
    }

    private _APIKEY: string;
    private _APISECRET: string;
    private base: string = "https://api.coinbase.com";

    private _getSignature(prehash: string): string {
        const hash = HmacSHA256(prehash, this._APISECRET)
        return enc.Hex.stringify(hash).replace(/\+/g, '-').replace(/\//g, '_')
    }

    private async _getHeaders(path: string, body: string = "") {
        const headers = new Headers();
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const prehash = timestamp + "GET" + path + body

        headers.append('CB-ACCESS-TIMESTAMP', timestamp);
        headers.append('CB-ACCESS-KEY', this._APIKEY);
        headers.append('CB-ACCESS-SIGN', this._getSignature(prehash));
        return headers
    }

    async getAccounts(): Promise<ICoinbaseAccount[]> {
        const path = '/v2/accounts?limit=100'
        const url = this.base + path;
        const headers = await this._getHeaders(path);

        const resp = await fetch(url, { headers })
        const data = await resp.json()
        return data.data
    }

    async getHoldings(): Promise<PersonalCryptoHolding[]> {
        let accounts: ICoinbaseAccount[] = await this.getAccounts()
        accounts = accounts.filter((a) => (parseFloat(a.balance.amount) > 0))

        const holdings: PersonalCryptoHolding[] = [];
        for (let account of accounts) {
            const quantity = parseFloat(account.balance.amount)
            if (quantity > 0) {
                holdings.push({
                    ticker: account.balance.currency,
                    quantity,
                })
            }
        }

        return holdings
    }
}

interface ICoinbaseAccount {
    balance: {
        amount: string;
        currency: string;
    }
}