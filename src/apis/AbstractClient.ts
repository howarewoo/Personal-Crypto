export abstract class AbstractClient {
    constructor() { }

    _proxy = "https://cors-anywhere.herokuapp.com/"

    async fetchInBackground(url: string, request?: RequestInit): Promise<any> {
        return await new Promise<any>((resolve, reject) => {
            // cancel if no response after timeout
            const timeout = setTimeout(() => {
                reject();
            }, 20000);
            chrome.runtime.sendMessage(
                {
                    action: 'api_client_request',
                    url,
                    request,
                },
                (resp) => {
                    clearTimeout(timeout);
                    resolve(resp);
                }
            );
        });
    }

    async fetchWithProxy(url: string, request?: RequestInit): Promise<Response> {
        return await fetch(this._proxy + url, request)
    }

    async fetchWithBackgroundProxy(url: string, request?: RequestInit): Promise<Response> {
        return await this.fetchInBackground(this._proxy + url, request)
    }
}