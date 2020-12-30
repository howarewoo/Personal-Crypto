import { makeAutoObservable } from "mobx";
import { PersonalCryptoAccount } from "../../../../models/PersonalCryptoAccount";

export class WalletListViewModel {
    constructor() {
        chrome.storage.sync.get(
            'personal_crypto_accounts',
            (result) => {
                console.log("Personal Crypto Accounts from Chrome Storage:", result.personal_crypto_accounts);
                this.accounts = result.personal_crypto_accounts || [];
                this.accounts = this.accounts.filter((a) => !!a.wallet)
            }
        );
        makeAutoObservable(this)
    }

    accounts: PersonalCryptoAccount[] = [];
}