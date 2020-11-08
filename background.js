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

function viewUrl(url) {
    const matchingConverter = converters.find(converter => converter.matches(url));
    if (matchingConverter) {
        return matchingConverter.pluginUrl(url)
            .then(pluginUrl => viewInKodi(pluginUrl))
    } else {
        showMessage("Failed to play video", `Could not find converter for url: ${url}`);
    }
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
function playCurrentUrl() {
    browser.tabs.query({currentWindow: true, active: true})
        .then((tabs) => viewUrl(tabs[0].url))
        .catch(e => showMessage("Failed to play video", e.message))
}
  
browser.browserAction.onClicked.addListener(playCurrentUrl);

browser.commands.onCommand.addListener(function(command) {
    if (command == "play") {
      playCurrentUrl();
    }
  });