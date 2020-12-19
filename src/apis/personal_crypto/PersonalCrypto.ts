import { PersonalCapitalAPI } from '../personal_capital/PersonalCapitalAPI'
import { IPersonalCryptoAccount } from "./index"

export class PersonalCrypto {
    constructor() {
        this.formData = new FormData();
        this.formData.append('apiClient', 'WEB')

        chrome.storage.sync.get('personal_crypto_accounts', function (result) {
            console.log('Value currently is ' + result.personal_crypto_accounts);
            this.accounts = result.personal_crypto_accounts;
        });
    }

    pc: PersonalCapitalAPI;
    formData: FormData;
    accounts: IPersonalCryptoAccount[];
    pcData: any[];

    setCSRF(csrf: string) {
        this.formData.append('csrf', csrf);
    }

    getPersonalCapitalData(csrf: string) {
        const pc = new PersonalCapitalAPI(csrf)
        this.accounts.map(account => {
            this.pcData[account.name] = pc.getHoldings([account.name])
        })
    }
}


