import { PersonalCrypto } from "./personalcrypto";

window.addEventListener(
    'message',
    async (event) => {
        if (event.source === window && event.data.type && event.data.type == 'GET_CSRF_TOKEN') {
            const csrf = event.data.text;
            const personal_crypto = new PersonalCrypto(csrf);
            await personal_crypto.run()
        }
    },
    false
);

var actualCode = 'window.postMessage({ "type": "GET_CSRF_TOKEN", text: window["csrf"] }, "*")';
document.documentElement.setAttribute('onreset', actualCode);
document.documentElement.dispatchEvent(new CustomEvent('reset'));
document.documentElement.removeAttribute('onreset');