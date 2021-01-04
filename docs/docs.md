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

## Adding an Exchange

In order to add an exchange to the extension, a new class must be created which inherits from the AbstractExchange class. This ensures that the output of the client will be usuable by Personal Crypto.

After properly implmeneting the Exchange's API client, the exchange information must be added to the supported exchanges enum and info array found in ```./models/SupportedExchanges.ts```