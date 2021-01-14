import { ClientFactory } from '../apis/ClientFactory'
import { AbstractExchange } from '../apis/exchanges/AbstractExchange'
import { PersonalCapital } from '../apis/personal_capital/PersonalCapital'
import { CoinGecko, ICoinInfo } from '../apis/pricing/CoinGecko'

import { PersonalCapitalHolding } from "../models/PersonalCapitalHolding";
import { PersonalCryptoHolding } from '../models/PersonalCryptoHolding'
import { PersonalCryptoAccount } from '../models/PersonalCryptoAccount'
import { AbstractWallet } from '../apis/wallets/AbstractWallet';


export class PersonalCrypto {
    constructor(csrf: string) {
        this.personalCapital = new PersonalCapital(csrf)
        chrome.storage.sync.get(
            'personal_crypto_accounts',
            (result) => {
                this.accounts = result.personal_crypto_accounts || [];
            }
        );
    }

    coingecko: CoinGecko = new CoinGecko();
    personalCapital: PersonalCapital;
    accounts: PersonalCryptoAccount[];
    capitalHoldings: Map<string, PersonalCapitalHolding[]> = new Map<string, PersonalCapitalHolding[]>()
    cryptoHoldings: Map<string, PersonalCryptoHolding[]> = new Map<string, PersonalCryptoHolding[]>();

    async run(): Promise<void> {
        await this.getPersonalCapitalData();
        await this.getCryptoData();
        await this.getPriceData();
        await this.getAccountIds();
        await this.setPersonalCapitalData();
    }

    private async getAccountIds(): Promise<void> {
        console.log('fetching Account IDs')
        if (!this.cryptoHoldings.keys()) return;
        const pcAccounts = await this.personalCapital.getAccounts()
        this.cryptoHoldings.forEach((accountHoldings, accountName) => {
            const selectedAccount = pcAccounts.find(account => account.name === accountName);
            if (selectedAccount) {
                for (let holding of accountHoldings) {
                    holding.userAccountId = selectedAccount.userAccountId
                }
            }
        })
    }

    private async getPersonalCapitalData(): Promise<void> {
        console.log('fetching Personal Capital account data')
        const holdings = await this.personalCapital.getHoldings()
        for (let holding of holdings) {
            let temp = this.capitalHoldings.get(holding.accountName) || []
            temp.push(holding)
            this.capitalHoldings.set(holding.accountName, temp)
        }
    }

    private async getCryptoData(): Promise<void> {
        console.log('fetching Crypto data')
        if (!this.accounts) return;
        for (let account of this.accounts) {
            let client: AbstractExchange | AbstractWallet = ClientFactory.getClient(account);
            this.cryptoHoldings.set(account.name, await client.getHoldings())
        }
    }

    private async getPriceData(): Promise<void> {
        console.log('fetching Price data')
        for (let [accountName, accountHoldings] of Array.from(this.cryptoHoldings.entries())) {
            let infoMap = new Map<string, ICoinInfo>();
            let coinIds = []
            for (let holding of accountHoldings) {
                let info = await this.coingecko.getCoinInfo(holding.ticker)
                if (info) {
                    infoMap.set(holding.ticker, info)
                    coinIds.push(info.id)
                }
            }

            const prices = await this.coingecko.getPrices(coinIds)

            for (let i = 0; i < accountHoldings.length; i++) {
                let holding = accountHoldings[i]
                if (infoMap.has(holding.ticker)) {
                    let info = infoMap.get(holding.ticker)
                    holding.description = info.name
                    holding.price = prices[info.id].usd
                }
                else {
                    accountHoldings.splice(i--, 1)
                }
            }
            this.cryptoHoldings.set(accountName, accountHoldings);
        }
    }

    private async setPersonalCapitalData(): Promise<void> {
        console.log('setting Personal Capital data')
        for (let [capitalAccountName, capitalAccountHoldings] of Array.from(this.capitalHoldings.entries())) {
            // if the current capital account matches a crypto account
            let cryptoAccount = this.accounts.find((account) => account.name == capitalAccountName)
            if (cryptoAccount) {
                this.updateAccount(cryptoAccount, capitalAccountHoldings)
            }
            else {
                this.updateManualAccountHoldings(capitalAccountHoldings)
            }
        }
    }

    private _getTickerFromCapitalHolding(holding: PersonalCapitalHolding): string {
        if (!holding.ticker.startsWith("CRYPTO")) return "";

        let tickerArray = holding.ticker.split(' ');
        if (tickerArray.length > 1) {
            return tickerArray[tickerArray.length - 1]
        }
        return ""
    }

    private async updateAccount(cryptoAccount: PersonalCryptoAccount, capitalAccountHoldings: PersonalCapitalHolding[]) {
        let cryptoAccountHoldings = this.cryptoHoldings.get(cryptoAccount.name) || []

        // loop through and update exsiting holdings on Personal Capital
        for (let capitalHolding of capitalAccountHoldings) {
            if (capitalHolding.ticker.startsWith("CRYPTO")) {
                let ticker = this._getTickerFromCapitalHolding(capitalHolding)
                let cryptoHolding = cryptoAccountHoldings.find((ca) => ca.ticker == ticker)
                if (cryptoHolding) {
                    capitalHolding.quantity = cryptoHolding.quantity
                    capitalHolding.price = cryptoHolding.price
                    this.personalCapital.updateHolding(capitalHolding)
                }
                else {
                    const priceData = await this.coingecko.getPrice(ticker)
                    if (priceData) {
                        capitalHolding.quantity = 0;
                        capitalHolding.description = priceData.name
                        capitalHolding.price = priceData.price
                        this.personalCapital.updateHolding(capitalHolding)
                    }
                }
            }
        }

        // loop through all crypto holdings and add any missing holdings to Personal Capital
        for (let cryptoHolding of cryptoAccountHoldings) {
            if (!capitalAccountHoldings.find((h) => cryptoHolding.ticker == this._getTickerFromCapitalHolding(h))) {
                this.personalCapital.addHolding(cryptoHolding)
            }
        }

    }

    private async updateManualAccountHoldings(capitalAccountHoldings: PersonalCapitalHolding[]){
        for (let capitalHolding of capitalAccountHoldings) {
            if (capitalHolding.ticker?.startsWith("CRYPTO")) {
                let temp = capitalHolding.ticker.split(' ')
                let ticker = temp[temp.length - 1]
                const priceData = await this.coingecko.getPrice(ticker)
                if (priceData) {
                    capitalHolding.description = priceData.name
                    capitalHolding.price = priceData.price
                    this.personalCapital.updateHolding(capitalHolding)
                }
            }
        }
    }
}

