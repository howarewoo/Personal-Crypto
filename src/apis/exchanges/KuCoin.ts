import { AbstractExchange } from './AbstractExchange';

import { enc, HmacSHA256 } from 'crypto-js';
import { PersonalCryptoHolding } from '../../models/PersonalCryptoHolding';

export class KuCoin extends AbstractExchange {
    constructor(version: string, key: string, secret: string, passphrase: string) {
        super();
        this._APIVERSION = version;
        this._APIKEY = key;
        this._APISECRET = secret;
        this._PASSPHRASE = passphrase;
    }

    private _APIVERSION: string;
    private _APIKEY: string;
    private _APISECRET: string;
    private _PASSPHRASE: string;
    private base: string = "https://api.kucoin.com";

    private _getSignature(prehash: string): string {
        const secret = enc.Utf8.parse(this._APISECRET)
        const hash = HmacSHA256(enc.Utf8.parse(prehash), secret)
        return enc.Base64.stringify(hash)
    }

    private async _getHeaders(path: string, body: string = "") {
        const headers = new Headers();
        const timestamp = Date.now().toString();
        const prehash = timestamp + "GET" + path + body

        headers.append('KC-API-TIMESTAMP', timestamp);
        headers.append('KC-API-KEY-VERSION', this._APIVERSION);
        headers.append('KC-API-KEY', this._APIKEY);
        headers.append('KC-API-SIGN', this._getSignature(prehash));
        headers.append('KC-API-PASSPHRASE', this._getSignature(this._PASSPHRASE));
        return headers
    }

    async getAccounts(): Promise<IKuCoinAccount[]> {
        const path = '/api/v1/accounts'
        const url = this.base + path;
        const headers = await this._getHeaders(path);

        const resp = await this.fetchWithProxy(url, { headers })
        const data = (await resp.json()).data
        return data
    }

    async getSubAccounts(): Promise<IKuCoinAccount[]> {
        const path = '/api/v1/sub-accounts'
        const url = this.base + path;
        const headers = await this._getHeaders(path);

        const resp = await this.fetchWithProxy(url, { headers })
        const data: IKuCoinSubAccount[] = (await resp.json()).data

        const accounts: IKuCoinAccount[] = []
        data.map((sub) => {
            sub.mainAccounts.map((a) => {
                accounts.push(a)
            })

            sub.tradeAccounts.map((a) => {
                accounts.push(a)
            })

            sub.marginAccounts.map((a) => {
                accounts.push(a)
            })
        })

        return accounts
    }

    private async getActiveLendOrders(): Promise<IKuCoinLendOrders[]> {
        const path = '/api/v1/margin/lend/trade/unsettled'
        const url = this.base + path;
        const headers = await this._getHeaders(path);

        const resp = await this.fetchWithProxy(url, { headers })
        const data = (await resp.json()).data
        return data.items
    }

    private mergeBalances(accounts: IKuCoinAccount[], lendOrders: IKuCoinLendOrders[]): Map<string, number> {
        let balances = new Map<string, number>()

        for (let account of accounts) {
            let ticker = account.currency
            let quantity = parseFloat(account.balance)

            if (quantity > 0) {
                if (balances.has(ticker)) {
                    quantity += balances.get(ticker)
                }

                balances.set(ticker, quantity)
            }
        }

        for (let order of lendOrders) {
            let ticker = order.currency
            let quantity = parseFloat(order.size) + parseFloat(order.accruedInterest)
            if (balances.has(ticker)) {
                quantity += balances.get(ticker)
            }

            balances.set(ticker, quantity)
        }

        return balances
    }

    async getHoldings(): Promise<PersonalCryptoHolding[]> {
        const accounts = await this.getAccounts()
        const lendOrders = await this.getActiveLendOrders()

        const holdings: PersonalCryptoHolding[] = [];
        const balances = this.mergeBalances(accounts, lendOrders)
        balances.forEach((quantity, ticker) => {
            holdings.push({
                ticker,
                quantity,
            })
        })

        return holdings
    }
}

interface IKuCoinAccount {
    currency: string
    balance: string
    available: string
    holds: string
}

interface IKuCoinLendOrders {
    tradeId: string
    currency: string
    size: string
    accruedInterest: string
    repaid: string
    dailyIntRate: string
    term: number,
    maturityTime: number
}

interface IKuCoinSubAccount{
    subUserId: string
    subName: string
    mainAccounts: IKuCoinAccount[]
    tradeAccounts: IKuCoinAccount[]
    marginAccounts: IKuCoinAccount[]
}