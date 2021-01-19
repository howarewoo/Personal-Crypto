import { ClientFactory } from '../apis/ClientFactory'
import { AbstractExchange } from '../apis/exchanges/AbstractExchange'
import { PersonalCapital } from '../apis/personal_capital/PersonalCapital'
import { Alternative } from '../apis/pricing/Alternative'

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

    alternative: Alternative = new Alternative();
    personalCapital: PersonalCapital;
    accounts: PersonalCryptoAccount[];
    capitalHoldings: Map<string, PersonalCapitalHolding[]> = new Map<string, PersonalCapitalHolding[]>()
    cryptoHoldings: Map<string, PersonalCryptoHolding[]> = new Map<string, PersonalCryptoHolding[]>();

    async run(): Promise<void> {
        await this.getPersonalCapitalData();
        await this.getAccountData();
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

    private async getAccountData(): Promise<void> {
        console.log('fetching Crypto data')
        if (!this.accounts) return;
        for (let account of this.accounts) {
            let client: AbstractExchange | AbstractWallet = ClientFactory.getClient(account);
            this.cryptoHoldings.set(account.name, await client.getHoldings())
        }
    }

    private async setPersonalCapitalData(): Promise<void> {
        console.log('setting Personal Capital data')
        for (let [capitalAccountName, capitalAccountHoldings] of Array.from(this.capitalHoldings.entries())) {
            // if the current capital account matches a crypto account
            let cryptoAccount = this.accounts.find((account) => account.name == capitalAccountName)
            if (cryptoAccount) {
                await this.updateAccount(cryptoAccount, capitalAccountHoldings)
            }
            else {
                await this.updateManualAccountHoldings(capitalAccountHoldings)
            }
        }
    }

    private _getTickerFromCapitalHolding(holding: PersonalCapitalHolding): string {
        if (!holding.ticker || !holding.ticker.startsWith("CRYPTO")) return "";

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
                if (ticker) {
                    let cryptoHolding = cryptoAccountHoldings.find((ca) => ca.ticker == ticker)
                    let coinInfo = await this.alternative.getCoinInfo(ticker)
                    if (coinInfo) {
                        capitalHolding.quantity = cryptoHolding ? cryptoHolding.quantity : 0
                        capitalHolding.description = coinInfo.name
                        capitalHolding.price = parseFloat(coinInfo.price_usd)
                        this.personalCapital.updateHolding(capitalHolding)
                    }
                }
            }
        }

        // loop through all crypto holdings and add any missing holdings to Personal Capital
        for (let cryptoHolding of cryptoAccountHoldings) {
            if (!capitalAccountHoldings.find((h) => cryptoHolding.ticker == this._getTickerFromCapitalHolding(h))) {
                let coinInfo = await this.alternative.getCoinInfo(cryptoHolding.ticker)
                if (coinInfo) {
                    cryptoHolding.quantity = cryptoHolding ? cryptoHolding.quantity : 0
                    cryptoHolding.description = coinInfo.name
                    cryptoHolding.price = parseFloat(coinInfo.price_usd)
                    this.personalCapital.addHolding(cryptoHolding)
                }
            }
        }
    }

    private async updateManualAccountHoldings(capitalAccountHoldings: PersonalCapitalHolding[]) {
        for (let capitalHolding of capitalAccountHoldings) {
            let ticker = this._getTickerFromCapitalHolding(capitalHolding);
            if (ticker) {
                let coinInfo = await this.alternative.getCoinInfo(ticker)
                if (coinInfo) {
                    capitalHolding.description = coinInfo.name
                    capitalHolding.price = parseFloat(coinInfo.price_usd)
                    this.personalCapital.updateHolding(capitalHolding)
                }
            }
        }
    }
}

