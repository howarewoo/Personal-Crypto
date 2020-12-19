export class PersonalCapitalAPI {
    constructor(csrf: string) {
        this.csrf = csrf;
    }

    csrf: string;

    getCredentialFormData() {
        const formdata = new FormData();
        formdata.append('csrf', this.csrf);
        formdata.append('apiClient', 'WEB');
        return formdata;
    }

    //Retrieve all securities from personal capital that were added manually
    async getHoldings(accountNames: string[]) {
        const url = 'https://home.personalcapital.com/api/invest/getHoldings';
        const formdata = this.getCredentialFormData();
        const resp = await fetch(url, {
            method: 'POST',
            body: formdata,
        });
        let holdings = [];
        const data = await resp.json();
        holdings = data.spData.holdings
        return holdings;
    }

    async test(accountNames: string[]) {
        const url = 'https://home.personalcapital.com/api/invest/getHoldings';
        const formdata = this.getCredentialFormData();
        const resp = await fetch(url, {
            method: 'POST',
            body: formdata,
        });
        if (resp.ok) {
            const data = await resp.json();
            console.log(data.spData.holdings)
            return data
        }
        return
    }

    async getAccount(accountName) {
        const url = 'https://home.personalcapital.com/api/newaccount/getAccounts2';
        const formdata = this.getCredentialFormData();
        const resp = await fetch(url, {
            method: 'POST',
            body: formdata,
        });
        if (resp.ok) {
            const data = await resp.json();
            const accounts = data.spData.accounts
            const selectedAccount = accounts.find(account => account.name === accountName);
            console.log(selectedAccount)
            return selectedAccount
        }
        return
    }

    async getAccounts() {
        const url = 'https://home.personalcapital.com/api/newaccount/getAccounts2';
        const formdata = this.getCredentialFormData();
        const resp = await fetch(url, {
            method: 'POST',
            body: formdata,
        });
        const data = await resp.json();
        console.log(data)
        return data;
    }

    // update a single security in personal capital
    async updateHolding(holding) {
        const url = 'https://home.personalcapital.com/api/account/updateHolding';
        const formdata = this.getCredentialFormData();
        for (const key in holding.data) {
            formdata.append(key, holding.data[key]);
        }
        return await fetch(url, {
            method: 'POST',
            body: formdata,
        });
    }
}