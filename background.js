function playPluginUrl(pluginUrl, settings) {
    const body = {
        "id": 1,
        "jsonrpc": "2.0",
        "method": "Player.Open",
        "params": {
            "item": {
                "file": pluginUrl
            }
        }
    };
    const headers = new Headers();
    if (settings.username && settings.password) {
        headers.append("Authorization", "Basic " + btoa(`${settings.username}:${settings.password}`));
    }
    headers.append("Content-Type", "application/json");
    const apiUrl = `http://${settings.host}:8080/jsonrpc`
    return fetch(apiUrl, {
            method: "POST",
            headers,
            body: JSON.stringify(body)
        }).then(response => response.json())
        .then(json => console.log(json))
}

function viewInKodi(pluginUrl) {
    return loadSettings()
        .then(settings => playPluginUrl(pluginUrl, settings))
        .catch(e => showMessage("Failed to view in kodi", `Failed to start video: ${e.message}`));
}

function viewArdByUrl(url) {
    return fetch(url)
        .then(response => response.text())
        .then(text => text.match("contentId\":(\\d+)"))
        .then(match => {
            if (match) {
                const contentId = match[1];
                const pluginUrl = `plugin://plugin.video.ardmediathek_de/?mode=libArdPlay&documentId=${contentId}`
                viewInKodi(pluginUrl)
            } else {
                showMessage("Failed to play ARD video", "Could not find contentId");
            }
        })
}

function loadSettings() {
    return browser.storage.sync.get(["host","username","password"])
        .then(result => {
            return {
                host: result.host ? result.host : "localhost",
                username: result.username,
                password: result.password
            }
        }, e => {
            showMessage("Failed to load settings", `An error occured ${e.message}`);
        });
}

function showMessage(title, message) {
    browser.notifications.create({
        "type": "basic",
        "iconUrl": browser.extension.getURL("icons/icon-128.png"),
        "title": title,
        "message": message
      });
}
function onClick() {
    browser.tabs.query({currentWindow: true, active: true})
        .then((tabs) => viewArdByUrl(tabs[0].url));
}
  
browser.browserAction.onClicked.addListener(onClick);