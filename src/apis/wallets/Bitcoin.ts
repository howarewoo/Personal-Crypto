import { PersonalCryptoHolding } from '../../models/PersonalCryptoHolding'
import { AbstractWallet } from './AbstractWallet'

export class Bitcoin extends AbstractWallet {
    constructor(address: string) {
        super()
        this.ADDRESS = address;
    }

    base: string = 'https://chain.api.btc.com/v3';
    ADDRESS: string;

    async getHoldings(): Promise<PersonalCryptoHolding[]> {
        const url: string = this.base + '/address/' + this.ADDRESS;

        const data = (await this.fetchInBackground(url)).data

        const holdings: PersonalCryptoHolding[] = [];
        const quantity = data.balance / 100000000; // satoshis
        holdings.push({
            ticker: "BTC",
            quantity,
        })

        return holdings
    }
}