const checkboxes = document.getElementsByClassName("custom-checkbox");

restoreSettings();
for(let i = 0; i < checkboxes.length; i++) {
    checkboxes[i].addEventListener("input", saveSettings);
}

function saveSettings() {
    let settings = {};

    for(let i = 0; i < checkboxes.length; i++) {
        console.log(settings);
        settings[`${checkboxes[i].name}`] = checkboxes[i].checked;
    }

    chrome.storage.local.set({settings: settings}, function() {
        console.log('Settings saved');
    });
}

function restoreSettings() {
    try {
        chrome.storage.local.get(['settings'], function(result) {
            console.log(result.settings);
            let settings = {};
            if(!result.settings) {
                settings['ctrl-c'] = true;
                settings['alt-c'] = true;
                settings['show-notification'] = true;
                settings['context-menu'] = true;
            } else {
                settings = result.settings;
            }

            console.log(settings);
             
            for(let i = 0; i < checkboxes.length; i++){
                if(settings[`${checkboxes[i].name}`] == "true" || settings[`${checkboxes[i].name}`] == true){
                    checkboxes[i].checked = true;
                } else {
                    checkboxes[i].checked = false;
                }
            }
        });
    } catch (err) {
        console.log(`Error while restoring settings: ${err}`);
    }
}