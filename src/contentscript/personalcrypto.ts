import { ClientFactory } from '../apis/ClientFactory'
import { AbstractExchange } from '../apis/exchanges/AbstractExchange'
import { PersonalCapital } from '../apis/personal_capital/PersonalCapital'
import { CoinGecko } from '../apis/pricing/CoinGecko'

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
            for (let holding of accountHoldings) {
                const priceData = await this.coingecko.getPrice(holding.ticker)
                holding.description = priceData.name
                holding.price = priceData.price
            }
            this.cryptoHoldings.set(accountName, accountHoldings);
        }
    }

    private async setPersonalCapitalData(): Promise<void> {
        console.log('setting Personal Capital data')
        for (let [capitalAccountName, capitalAccountHoldings] of Array.from(this.capitalHoldings.entries())) {
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
                            selectedCapitalHolding.quantity = cryptoHolding.quantity
                            selectedCapitalHolding.price = cryptoHolding.price
                            this.personalCapital.updateHolding(selectedCapitalHolding)
                        }
                        else {
                            this.personalCapital.addHolding(cryptoHolding)
                        }
                    }
                }
            }
            else {
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
    }
}

