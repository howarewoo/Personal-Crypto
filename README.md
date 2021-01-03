# Personal Crypto

Personal Crypto is a free chrome extension for connecting your cryptocurrency exchanges and wallets to your [Personal Capital](https://pcap.rocks/adamwoo) dashboard.

This code is still in development, so all feedback is welcome.

## Supported Accounts

| Account Types      | Date Added |
| ----------- | ----------- |
| Binance US      |  *Coming Soon*      |
| Coinbase Pro   |  *Coming Soon*       |
| Bitcoin Wallets     |   *Coming Soon*     |


## Installation

This extension is not available on the Chrome Web Store yet.

You can load this extension by:

1. cloning this repository
2. installing the dependencies with ```npm install && cd src/popup && npm install```
3. building the extension with npm scripts
4. loading the unpacked extension onto your browser in developer mode. 

## Usage

1. Create a manual investment holding account in Personal Capital. Make sure to give it a unique name.
2. Create an API key with your exchange. (Be sure to set permissions to READ ONLY. See disclaimer below.)
2. Open the extension popup.
3. Click the "Add Account" menu option.
4. Search for a supported account type.
5. Select your crypto account type and fill in the information. (Make sure that this Account Name matches the Personal Captial account name.)
6. Click Create. (Correct any validation issues and try again.)
7. Refresh your Personal Capital browser tab

Your account holdings will be automattically added to your Personal Capital manual account. It make take a bit to display on the site. You can check the browser console to see what has been updated by pressing ```F12```.

## Disclaimer

Use this extension at your own risk. I am not responsible for any funds lost from improperly secured API keys. API keys added to this extension are NOT secure by default and could potentially be accessed by the browser. "Read only" security should be set on the exchange when creating the API key.

If you are uncomfortable with the browser storing your API keys, do not use this extension.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Donations

If you find this extension useful and would like to support my work, you can support this project using the links below. 

Thank you!

## License
[GNU AGPLv3](https://choosealicense.com/licenses/agpl-3.0/)