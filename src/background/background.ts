chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  (async () => {
    switch (message.action) {
      case 'api_client_request':
        try {
          console.log(`fetching data at ${message.url}`);
          const resp = await fetch(message.url, message.request);
          if (resp.ok) {
            const data = await resp.json();
            console.log(data)
            sendResponse(data);
          } else {
            throw new Error('unsuccessful request');
          }
        } catch (ex) {
          sendResponse({
            ok: false,
          });
        }
      default:
        break;
    }
  })();
  return true;
})