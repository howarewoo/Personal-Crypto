import { PersonalCryptoHolding } from '../../models/PersonalCryptoHolding'
import { AbstractWallet } from './AbstractWallet'

export class Ethereum extends AbstractWallet {
    constructor(address: string) {
        super()
        this.ADDRESS = address;
    }

    base: string = 'https://api.ethplorer.io';
    APIKEY: string = 'freekey'
    ADDRESS: string;

    async getHoldings(): Promise<PersonalCryptoHolding[]> {
        const url: string = this.base + '/getAddressInfo/' + this.ADDRESS + '?apiKey=' + this.APIKEY;

        const resp = await this.fetchInBackground(url)
        const data = resp.data

        const holdings: PersonalCryptoHolding[] = [];
        const quantity = data.ETH.balance;
        holdings.push({
            ticker: "ETH",
            quantity,
        })

        if(data.tokens){
            for(let token of data.tokens){
                holdings.push({
                    ticker: token.tokenInfo.symbol,
                    quantity: token.balance,
                })
            }
        }

        return holdings
    }
}