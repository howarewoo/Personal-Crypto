import { AbstractClient } from "../AbstractClient";

export class CoinGecko extends AbstractClient {
    constructor() {
        super()
    }

    private base: string = 'https://api.coingecko.com/api/v3'
    private rateLimit: number = Math.floor(100 / 60);
    private prevTime: number = Date.now();
    private coinList: ICoinInfo[] = [];
    private cache: Map<string, any> = new Map<string, any>()

    async getCoinList(): Promise<ICoinInfo[]> {
        const url = this.base + '/coins/list';
        const resp = await this.fetchInBackground(url)
        const data = resp.data
        return data
    }

    async getCoinInfo(ticker: string): Promise<ICoinInfo> {
        if (this.coinList.length == 0) {
            this.coinList = await this.getCoinList()
        }

        const CoinInfo = this.coinList.find((coin) => (
            coin.symbol.toUpperCase() == ticker
        ))
        if (!CoinInfo) {
            console.log("No CoinGecko info for", ticker)
            return
        }
        return CoinInfo
    }

    async getPrice(ticker: string): Promise<IPriceData | null> {
        const cacheValue = this.cache.get(ticker)
        if (cacheValue) return cacheValue;

        if (this.coinList.length == 0) {
            this.coinList = await this.getCoinList()
        }

        const coinData = this.coinList.find((coin) => (
            coin.symbol.toUpperCase() == ticker
        ))
        if (!coinData) {
            console.log("No CoinGecko data for", ticker)
            this.cache.set(ticker, null)
            return null
        }

        const url = this.base + '/simple/price';
        const query = '?ids=' + coinData.id + '&vs_currencies=usd'

        // wait for throttle limit/sec
        const interval = 1000 / this.rateLimit
        while ((Date.now() - this.prevTime) <= interval) {
            await new Promise(r => setTimeout(r, interval / 4));
        }

        this.prevTime = Date.now()
        let resp = await this.fetchInBackground(url + query);

        const data = resp.data
        if (resp.ok && data[coinData.id]?.usd) {
            this.cache.set(
                ticker,
                {
                    name: coinData.name,
                    price: data[coinData.id].usd
                }
            )
        }
        return this.cache.get(ticker)
    }

    async getPrices(ids: string[]): Promise<IRawPrices> {
        const url = this.base + '/simple/price';
        const query = '?ids=' + ids.join(',') + '&vs_currencies=usd'
        const resp = await this.fetchInBackground(url + query);
        return resp.data
    }
}

interface IPriceData {
    name: string;
    price: number;
}

interface IRawPrices {
    [key: string]: { usd: number }
}

export interface ICoinInfo {
    id: string;
    symbol: string;
    name: string;
}