import { PersonalCryptoAccount } from '../../../models/PersonalCryptoAccount'

export class ExchangesModel {
    constructor() {
    }

    exchanges: PersonalCryptoAccount[] = [];

    save(exchanges: any[]) {
        chrome.storage.local.set({ exchanges: exchanges }, function () {
            console.log('Value is set to ' + exchanges);
        });
    }

    load() {
        chrome.storage.sync.get(['exchanges'], function (result) {
            console.log('Value currently is ' + result.exchanges);
        });
    }
}
