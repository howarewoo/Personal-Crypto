import { ClientFactory } from '../apis/ClientFactory'
import { AbstractExchange } from '../apis/exchanges/AbstractExchange'
import { PersonalCapital } from '../apis/personal_capital/PersonalCapital'
import { Nomics } from '../apis/pricing/Nomics'



import { PersonalCapitalHolding } from "../models/PersonalCapitalHolding";
import { PersonalCryptoHolding } from '../models/PersonalCryptoHolding'
import { PersonalCryptoAccount } from '../models/PersonalCryptoAccount'


export class PersonalCrypto {
    constructor(csrf: string) {
        this.personalCapital = new PersonalCapital(csrf)
        chrome.storage.sync.get(
            'personal_crypto_accounts',
            (result) => {
                console.log("Personal Crypto Accounts from Chrome Storage:", result.personal_crypto_accounts);
                this.accounts = result.personal_crypto_accounts || [];
            }
        );
    }

    personalCapital: PersonalCapital;
    accounts: PersonalCryptoAccount[];
    capitalHoldings: Map<string, PersonalCapitalHolding[]> = new Map<string, PersonalCapitalHolding[]>()
    cryptoHoldings: Map<string, PersonalCryptoHolding[]> = new Map<string, PersonalCryptoHolding[]>();

    async getAccountIds(): Promise<void> {
        if (!this.cryptoHoldings.keys()) return
        const pcAccounts = await this.personalCapital.getAccounts()
        this.cryptoHoldings.forEach((accountHoldings, accountName) => {
            const selectedAccount = pcAccounts.find(account => account.name === accountName);
            for (let holding of accountHoldings) {
                holding.userAccountId = selectedAccount.userAccountId
            }
        })
    }

    async getPersonalCapitalData(): Promise<void> {
        const holdings = await this.personalCapital.getHoldings()
        for (let holding of holdings) {
            let temp = this.capitalHoldings.get(holding.accountName) || []
            temp.push(holding)
            this.capitalHoldings.set(holding.accountName, temp)
        }
    }

    async getExchangeData(): Promise<void> {
        if (!this.accounts) return
        for (let account of this.accounts) {
            let client: AbstractExchange = ClientFactory.getClient(account);
            this.cryptoHoldings.set(account.name, await client.getHoldings())
        }
    }

    async getWalletData(): Promise<void> {

    }

    async getPriceData(): Promise<void> {
        const nomics = new Nomics();
        this.cryptoHoldings.forEach(async (accountHoldings, accountName) => {
            for (let holding of accountHoldings) {
                const priceData = await nomics.getPrice(holding.ticker)
                holding.description = priceData.name
                holding.price = parseFloat(priceData.price)
            }
            this.cryptoHoldings.set(accountName, accountHoldings)
        })
    }

    async setPersonalCapitalData(): Promise<void> {
        // for each existing Capital Account
        this.capitalHoldings.forEach((capitalAccountHoldings, capitalAccountName) => {
            if (this.accounts.find((account) => account.name == capitalAccountName)) {
                for (let capitalHolding of capitalAccountHoldings) {
                    capitalHolding.quantity = 0;
                }

                let cryptoAccountHoldings = this.cryptoHoldings.get(capitalAccountName)
                if (cryptoAccountHoldings) {
                    // for each crypto holding in the matching account
                    for (let cryptoHolding of cryptoAccountHoldings) {
                        // find existing crypto holding
                        let selectedCapitalHolding = capitalAccountHoldings.find((h) => h.ticker.endsWith(cryptoHolding.ticker))

                        // if crypto holding already exists, update
                        if (selectedCapitalHolding) {
                            selectedCapitalHolding.quantity = Math.round((cryptoHolding.quantity + Number.EPSILON) * 100) / 100
                            selectedCapitalHolding.price = cryptoHolding.price
                            this.personalCapital.updateHolding(selectedCapitalHolding)
                        }
                        else {
                            this.personalCapital.addHolding(cryptoHolding)
                        }
                    }
                }
            }
        })
    }
}

