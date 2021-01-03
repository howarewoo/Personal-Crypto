import { AbstractExchange } from './AbstractExchange';

import { enc, HmacSHA256 } from 'crypto-js';
import { PersonalCryptoHolding } from '../../models/PersonalCryptoHolding';

export class BinanceUS extends AbstractExchange {
    constructor(key: string, secret?: string) {
        super();
        this._APIKEY = key;
        this._APISECRET = secret;
    }

    private _APIKEY: string;
    private _APISECRET: string;
    private base: string = "https://api.binance.us";

    private _getHeaders() {
        const headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('X-MBX-APIKEY', this._APIKEY);
        return headers
    }

    private _getQuerySignature(query): string {
        const hash = HmacSHA256(query, this._APISECRET)
        return enc.Hex.stringify(hash).replace(/\+/g, '-').replace(/\//g, '_')
    }

    private async _getServerTime(): Promise<any> {
        const url = this.base + '/api/v3/time';
        const headers = this._getHeaders();

        const resp = await this.fetchInBackground(url)
        return resp.data.serverTime
    }

    async getHoldings(): Promise<PersonalCryptoHolding[]> {
        const url = this.base + '/api/v3/account';
        const headers = this._getHeaders();

        const timestamp = await this._getServerTime();
        let query = 'timestamp=' + timestamp;
        query += '&recvWindow=' + "60000";
        query += '&signature=' + this._getQuerySignature(query);

        const resp = await this.fetchWithProxy(url + "?" + query, { headers })
        const data: BinaceUSHolding[] = (await resp.json()).balances

        const holdings: PersonalCryptoHolding[] = [];
        for (let holding of data) {
            const quantity = parseFloat(holding.free) + parseFloat(holding.locked)
            if (quantity > 0) {
                holdings.push({
                    ticker: holding.asset,
                    quantity,
                })
            }
        }

        return holdings
    }

    async getPrice(ticker: string): Promise<number> {
        const url = this.base + '/api/v3/avgPrice';
        const headers = this._getHeaders();

        const resp = await this.fetchInBackground(url + "?symbol=" + ticker + "USD")
        return resp.data.price
    }
}

interface BinaceUSHolding {
    asset: string;
    free: string;
    locked: string
}