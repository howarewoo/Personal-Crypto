import { PersonalCrypto } from "./personalcrypto";

window.addEventListener(
    'message',
    async (event) => {
        if (event.source === window && event.data.type && event.data.type == 'PERSONAL_CRYPTO') {
            const csrf = event.data.text;
            const personal_crypto = new PersonalCrypto(csrf);
            await personal_crypto.run()
        }
    },
    false
);

var script = document.createElement('script');
script.innerHTML = `window.postMessage({ "type": "PERSONAL_CRYPTO", text: window.csrf }, "*");`;
document.body.appendChild(script);

