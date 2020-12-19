
export class ExchangesModel {
    constructor() {
    }

    exchanges: exchange[] = [];

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

interface exchange{
    name: string;
    apikey: string;
}