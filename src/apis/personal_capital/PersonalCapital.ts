import { PersonalCryptoHolding } from "../../models/PersonalCryptoHolding";
import { PersonalCapitalHolding } from "../../models/PersonalCapitalHolding";
import { AbstractClient } from "../AbstractClient";
import { SupportedExchanges } from "../../models/SupportedExchanges";

export class PersonalCapital extends AbstractClient {
    constructor(csrf: string) {
        super()
        this.csrf = csrf;
    }

    csrf: string;
    base: string = "https://home.personalcapital.com";

    getCredentialFormData() {
        const formdata = new FormData();
        formdata.append('csrf', this.csrf);
        formdata.append('apiClient', 'WEB');
        return formdata;
    }

    async getHoldings(): Promise<PersonalCapitalHolding[]> {
        const url = this.base + '/api/invest/getHoldings';
        const formdata = this.getCredentialFormData();
        console.log("Fetching holdings from Personal Capital: " + url)
        const resp = await fetch(url, {
            method: 'POST',
            body: formdata,
        });
        const data = (await resp.json()).spData;
        return data.holdings;
    }

    async getAccounts() {
        const url = this.base + '/api/newaccount/getAccounts2';
        const formdata = this.getCredentialFormData();
        const resp = await fetch(url, {
            method: 'POST',
            body: formdata,
        });
        const data = await resp.json();
        const accounts = data.spData.accounts
        return accounts;
    }

    async updateHolding(holding: PersonalCapitalHolding) {
        const url = this.base + '/api/account/updateHolding';
        const formdata = this.getCredentialFormData();
        for (let key in holding) {
            formdata.append(key, holding[key]);
        }
        const resp = await fetch(url, {
            method: 'POST',
            body: formdata,
        });
        if (!resp.ok) {
            const data = await resp.json()
            console.log(data.spHeader.errors)
        }
        else {
            console.log(holding.accountName, holding.ticker, 'updated', holding)
        }
    }

    async addManualHolding(holding: PersonalCryptoHolding) {
        console.log('adding holding:', holding.ticker)
        const url = this.base + '/api/account/addHolding';
        const formdata = this.getCredentialFormData();
        for (let key in holding) {
            let value: string | Blob = holding[key]
            if (key == "ticker") {
                value = "CRYPTO " + holding.ticker
            }
            formdata.append(key, value);
        }
        const resp = await fetch(url, {
            method: 'POST',
            body: formdata,
        });
        if (!resp.ok) {
            const data = await resp.json()
            console.log(data.spHeader.errors)
        }
    }

    async addCryptoHolding(holding: PersonalCryptoHolding, exchange?: SupportedExchanges) {
        console.log('adding holding:', holding.ticker)
        const url = this.base + '/api/account/addHolding';
        const formdata = this.getCredentialFormData();

        holding.description = [
            holding.ticker,
            exchange ? exchangeSource.get(exchange) : "coinbase",
        ].join('.')

        holding.ticker = [
            holding.ticker,
            exchange ? exchangeSource.get(exchange) : "coinbase",
            "COIN"
        ].join('.')

        for (let key in holding) {
            let value: string | Blob = holding[key]
            formdata.append(key, value);
        }
        const resp = await fetch(url, {
            method: 'POST',
            body: formdata,
        });
        if (!resp.ok) {
            const data = await resp.json()
            console.log(data.spHeader.errors)
        }
    }
}

const exchangeSource = new Map([
    [SupportedExchanges.BINANCE_US, "binanceusa"],
    [SupportedExchanges.COINBASE, "coinbase"],
    [SupportedExchanges.COINBASE_PRO, "coinbase"],
    [SupportedExchanges.KUCOIN, "Kucoin"],
])