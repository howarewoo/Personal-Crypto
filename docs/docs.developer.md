# Developer Documentation

## Content Script

The content script is the main entrypoint of the extension and should not be modified carelessly.

Business logic should be encapsulated within the PersonalCrypto class and utilize the extensions custom API clients.

## Background Script

The background script is used to offload fetching to the background page of the extension.

## Popup

The popup for this extension was bootstrapped with Create React App. It uses MaterialUI as a ui framework. The design architecture is MVVM implemented with MobX.

## API Clients

In order to easily add and modify exchange functionality, each exchange and wallet API should be encapsulated within an API client that inherits from AbstractClient at its base.

## Adding an Exchange or Wallet Account Type

In order to add an exchange or wallet type to the extension, follow these steps:

### Add the Account Type to the List of Supported Account Types
1. In ```src/models/SupportedExchanges.ts```, add the new exchange to the ```SupportedExchanges``` enum. (If creating a wallet type, do the same for ```src/models/SupportedWallets.ts```)
2. Add the required info for the new account type to ```Supported{Type}Info```. Use existing accounts as an example.
3. Set the "secure" flag for any options that should not be publicly visible. (This only hides the value in the UI and is not actually secure. However, this flag could be used for security features in the future.)

### Create the API Client Class
1. Create a new typescript file in the ```src/apis/exchanges``` or ```src/apis/wallets``` directories with the name of the exchange or blockchain you will be querying.
2. In this typescript file, create a class of the same name that inherits from ```AbstractExchange``` or ```AbstractWallet``` respectively.
3. Create a constructor that accepts the required inputs and saves them as object properties.
4. Create a definition of ```getHoldings``` which returns an array of holdings of ```PersonalCryptoHolding``` type. 

When making API requests, first attempt to use ```this.fetchInBackground``` method instead of fetching directly. Should the response be blocked by CORS, use ```this.fetchWithBackgroundProxy```. This will make the same call, but through the Personal Crypto proxy server cloned from Cors-Anywhere. Only call fetch directly if necessary.

### Add the API Client Class to the Client Factory
1. In ```src/apis/ClientFactory.ts```, import the new API Client 
2. Add a case for the new account type that returns an instance of the new API Client with the account options as parameters.