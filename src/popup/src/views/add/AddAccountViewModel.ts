import { makeAutoObservable } from "mobx";

import { PersonalCryptoAccount } from "../../../../models/PersonalCryptoAccount";
import { SupportedAccountTypes } from "../../../../models/SupportedAccountTypes";
import { IExchangeInfo, SupportedExchanges } from "../../../../models/SupportedExchanges";
import { IWalletInfo, SupportedWallets } from "../../../../models/SupportedWallets";

import { History } from 'history'

interface FormInput {
    value: string;
    error: boolean;
    message: string;
}

export class AddAccountViewModel {
    constructor(accounts: PersonalCryptoAccount[], addAccount: (account: PersonalCryptoAccount) => void, history: History<unknown>) {
        this.accounts = accounts;
        this.addAccount = addAccount;
        this.history = history;
        makeAutoObservable(this)
    }

    history: History<unknown>;
    accounts: PersonalCryptoAccount[];
    selected: IExchangeInfo | IWalletInfo | null = null;
    loading: boolean = false;
    name: FormInput = { value: "", error: false, message: "" };
    options: { [key: string]: FormInput } = {}

    addAccount: (account: PersonalCryptoAccount) => void;

    setSelected(value: IExchangeInfo | IWalletInfo | null) {
        this.selected = value;
        if (!this.selected) return
        this.options = {}
        for (let option of this.selected.options) {
            this.options = { ...this.options, [option.id]: { value: "", error: false, message: "" } }
        }
    }

    setName(text: string) {
        this.name.value = text;
        this.name.error = false;
        this.name.message = "";
    }

    setOption(id: string, text: string) {
        this.options[id].value = text;
        this.options[id].error = false;
        this.options[id].message = "";
    }

    validateForm(): boolean {
        let isValid = true;

        isValid = this.validateName()

        for (let key of Object.keys(this.options)) {
            if (this.options[key].value === "") {
                this.options[key].error = true;
                this.options[key].message = "Please enter a value";
                isValid = false;
            }
        }

        return isValid
    }

    validateName() {
        let isValid = true;
        const existing = this.accounts.find((a) => a.name === this.name.value)
        if (existing) {
            this.name.error = true;
            this.name.message = "Account name already used.";
            isValid = false;
        }
        else if (this.name.value === "") {
            this.name.error = true;
            this.name.message = "Please enter a unique name.";
            isValid = false;
        }
        return isValid
    }

    onFormSubmit() {
        console.log('Create Pressed')
        if (this.validateForm() && this.selected) {
            let options = {}
            for (let key of Object.keys(this.options)) {
                options = { ...options, [key]: this.options[key].value }
            }

            let account: PersonalCryptoAccount = {
                name: this.name.value,
                options
            }

            if (this.selected?.type === SupportedAccountTypes.EXCHANGE) {
                account = { ...account, exchange: this.selected?.name as SupportedExchanges }
            }
            else if (this.selected?.type === SupportedAccountTypes.WALLET) {
                account = { ...account, wallet: this.selected?.name as SupportedWallets }
            }
            this.addAccount(account)
            this.history.goBack()
        }
    }
}