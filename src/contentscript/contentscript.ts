import { PersonalCapitalAPI } from "../apis/personal_capital/PersonalCapitalAPI";
import { PersonalCrypto } from "../apis/personal_crypto/PersonalCrypto";


window.addEventListener(
    'message',
    (event) => {
        if (event.source === window && event.data.type && event.data.type == 'PERSONAL_CRYPTO') {
            const csrf = event.data.text;
            // const personal_crypto = new PersonalCrypto();
            // personal_crypto.setCSRF(csrf);
            const test = new PersonalCapitalAPI(csrf)
            console.log(test.test(["Cryptocurrency"]))
        }
    },
    false
);

var script = document.createElement('script');
script.innerHTML = `window.postMessage({ "type": "PERSONAL_CRYPTO", text: window.csrf }, "*");`;
document.body.appendChild(script);

