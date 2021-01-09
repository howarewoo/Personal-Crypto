import { AbstractClient } from "../AbstractClient";

export class CoinGecko extends AbstractClient {
    constructor() {
        super()
    }

    private base: string = 'https://api.coingecko.com/api/v3'
    private coinList: ICoinData[] = [];
    private cache: Map<string, any> = new Map<string, any>()

    async getCoinList(): Promise<ICoinData[]> {
        const url = this.base + '/coins/list';
        const data = await this.fetchInBackground(url)
        return data
    }

    async getPrice(ticker: string): Promise<IPriceData> {
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
        }

        const url = this.base + '/simple/price';
        const query = '?ids=' + coinData.id + '&vs_currencies=usd'

        const data = await this.fetchInBackground(url + query);

        if (data[coinData.id]?.usd) {
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

}

interface IPriceData {
    name: string;
    price: number;
}

interface ICoinData {
    id: string;
    symbol: string;
    name: string;
}