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

    nomics: Nomics = new Nomics()
    personalCapital: PersonalCapital;
    accounts: PersonalCryptoAccount[];
    capitalHoldings: Map<string, PersonalCapitalHolding[]> = new Map<string, PersonalCapitalHolding[]>()
    cryptoHoldings: Map<string, PersonalCryptoHolding[]> = new Map<string, PersonalCryptoHolding[]>();

    async run(): Promise<void> {
        await this.getPersonalCapitalData();
        await this.getExchangeData();
        await this.getPriceData();
        await this.getAccountIds();
        await this.setPersonalCapitalData();
    }

    async getAccountIds(): Promise<boolean> {
        console.log('fetching Account IDs')
        if (!this.cryptoHoldings.keys()) return false;
        const pcAccounts = await this.personalCapital.getAccounts()
        this.cryptoHoldings.forEach((accountHoldings, accountName) => {
            const selectedAccount = pcAccounts.find(account => account.name === accountName);
            for (let holding of accountHoldings) {
                holding.userAccountId = selectedAccount.userAccountId
            }
        })
        return true;
    }

    async getPersonalCapitalData(): Promise<boolean> {
        console.log('fetching Personal Capital account data')
        const holdings = await this.personalCapital.getHoldings()
        for (let holding of holdings) {
            let temp = this.capitalHoldings.get(holding.accountName) || []
            temp.push(holding)
            this.capitalHoldings.set(holding.accountName, temp)
        }
        return true;
    }

    async getExchangeData(): Promise<boolean> {
        console.log('fetching Exchange data')
        if (!this.accounts) return false;
        for (let account of this.accounts) {
            let client: AbstractExchange = ClientFactory.getClient(account);
            this.cryptoHoldings.set(account.name, await client.getHoldings())
        }
        return true;
    }

    async getWalletData(): Promise<void> {

    }

    async getPriceData(): Promise<boolean> {
        console.log('fetching Price data')
        for (let [accountName, accountHoldings] of Array.from(this.cryptoHoldings.entries())) {
            for (let holding of accountHoldings) {
                const priceData = await this.nomics.getPrice(holding.ticker)
                holding.description = priceData.name
                holding.price = parseFloat(priceData.price)
            }
            this.cryptoHoldings.set(accountName, accountHoldings);
        }
        return true;
    }

    async setPersonalCapitalData(): Promise<boolean> {
        console.log('setting Personal Capital data')
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
        return true;
    }
}

