import React, { createContext, useContext, useEffect, useState } from "react"
import { PersonalCryptoAccount } from "../../../models/PersonalCryptoAccount";

interface IAccountActions {
    addAccount: (account: PersonalCryptoAccount) => void,
    deleteAccount: (account: PersonalCryptoAccount) => void
}

const AccountsContext = createContext<PersonalCryptoAccount[]>([])
const AccountActionsContext = createContext<IAccountActions | undefined>(undefined)

export const useAccounts = () => {
    const context = useContext(AccountsContext)
    if (context === undefined) {
        throw new Error('useAccounts must be used within RootContextProvider')
    }
    return context
}

export const useAccountActions = () => {
    const context = useContext(AccountActionsContext)
    if (context === undefined) {
        throw new Error('useAccountActions must be used within RootContextProvider')
    }
    return context
}

export const RootNavigatorProvider = ({ children }: any) => {
    const [accounts, setAccounts] = useState<PersonalCryptoAccount[]>([])

    useEffect(() => {
        chrome.storage.sync.get(
            'personal_crypto_accounts',
            (result) => {
                if (!result.personal_crypto_accounts) {
                    chrome.storage.sync.set({ personal_crypto_accounts: [] })
                }
                else {
                    setAccounts(result.personal_crypto_accounts)
                }
            }
        );
    }, []);

    function addAccount(account: PersonalCryptoAccount) {
        accounts.push(account)
        chrome.storage.sync.set({ 'personal_crypto_accounts': accounts });
        setAccounts(accounts);
    }

    function deleteAccount(account: PersonalCryptoAccount) {
        let index = accounts.findIndex((a) => account?.name === a.name)
        if (index >= 0) {
            accounts.splice(index, 1)
            chrome.storage.sync.set({ 'personal_crypto_accounts': accounts });
            setAccounts(accounts);
        }
    }

    return (
        <AccountActionsContext.Provider value={{ addAccount, deleteAccount }}>
            <AccountsContext.Provider value={accounts}>
                {children}
            </AccountsContext.Provider>
        </AccountActionsContext.Provider>
    )
}