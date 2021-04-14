
import { AbstractClient } from "../AbstractClient";
import { overrideTickers } from "./OverrideTickers"

export class Alternative extends AbstractClient {
    constructor() {
        super()
    }

    private base: string = 'https://api.alternative.me'
    private coinList: ICoinInfo[] = [];

    private async _getCoinList(): Promise<ICoinInfo[]> {
        const url = this.base + '/v1/ticker/?limit=1000';
        const resp = await this.fetchWithBackgroundProxy(url)
        const data = resp.data
        return data
    }

    async getCoinInfo(ticker: string): Promise<ICoinInfo> {
        if (this.coinList.length == 0) {
            this.coinList = await this._getCoinList()
        }

        if (overrideTickers.has(ticker)) {
            ticker = overrideTickers.get(ticker)
        }

        const CoinInfo = this.coinList.find((coin) => (
            coin.symbol.toUpperCase() == ticker
        ))

        if (!CoinInfo) {
            console.log("No Alternative.me info for", ticker)
            return
        }
        return CoinInfo
    }
}

export interface ICoinInfo {
    id: string;
    symbol: string;
    name: string;
    price_usd: string;
}