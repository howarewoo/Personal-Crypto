import { AbstractClient } from "../AbstractClient";

export class Nomics extends AbstractClient {
    constructor() {
        super()
    }

    base: string = 'https://api.nomics.com/v1'
    private APIKEY: string = '6d6c504fe048ff021bf5f5e23fc6655e'
    private cache: Map<string, any> = new Map<string, any>()

    async getPrice(ticker: string) {
        const cacheValue = this.cache.get(ticker)
        if (cacheValue) return cacheValue;

        const url = this.base + '/currencies/ticker';
        const query = '?ids=' + ticker + '&key=' + this.APIKEY

        const data = (await this.fetchWithBackgroundProxy(url + query)).data;
        if (data.length > 0) {
            this.cache.set(ticker, data[0])
        }
        return this.cache.get(ticker)
    }

}