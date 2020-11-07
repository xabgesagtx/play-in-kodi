function saveOptions(e) {
    e.preventDefault();
    browser.storage.sync.set({
      host: document.querySelector("#host").value,
      username: document.querySelector("#username").value,
      password: document.querySelector("#password").value
    });
  }
  
  function restoreOptions() {
  
    function setCurrentChoice(result) {
      document.querySelector("#host").value = result.host || "localhost";
      document.querySelector("#username").value = result.username || "";
      document.querySelector("#password").value = result.password || "";
    }
  
    function onError(error) {
      console.log(`Error: ${error}`);
    }
  
    browser.storage.sync.get(["host","username","password"])
        .then(setCurrentChoice, onError);
  }
  
  document.addEventListener("DOMContentLoaded", restoreOptions);
  document.querySelector("form").addEventListener("submit", saveOptions);