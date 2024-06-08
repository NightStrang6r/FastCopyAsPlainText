const checkboxes = document.getElementsByClassName("custom-checkbox");
const logoButton = document.getElementById("logo-button");
const githubButton = document.getElementById("github-button");

logoButton.addEventListener("click", () => {});
githubButton.addEventListener("click", () => openNewTab("https://github.com/NightStrang6r/CopyAsPlainText"));

main();

async function main() {
    await restoreSettings();
    for(let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].addEventListener("input", saveSettings);
    }
}

function openNewTab(url) {
    chrome.tabs.create({url: url});
}

async function saveSettings() {
    let settings = {};

    for(let i = 0; i < checkboxes.length; i++) {
        console.log(settings);
        settings[`${checkboxes[i].name}`] = checkboxes[i].checked;
    }

    await chrome.storage.local.set({settings: settings});

    if (settings['context-menu']) {
        await removeContextMenuButton();
        await createContextMenuButton();
    } else {
        await removeContextMenuButton();
    }

    console.log('Settings saved');
}

async function restoreSettings() {
    try {
        const result = await chrome.storage.local.get(['settings']);

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
            
        for(let i = 0; i < checkboxes.length; i++) {
            if(settings[`${checkboxes[i].name}`] == "true" || settings[`${checkboxes[i].name}`] == true){
                checkboxes[i].checked = true;
            } else {
                checkboxes[i].checked = false;
            }
        }
    } catch (err) {
        console.log(`Error while restoring settings: ${err}`);
    }
}

async function createContextMenuButton() {
    try {
        const contextMenu = {
            "id": "copyAsPlainText",
            "title": "Copy as Plain Text",
            "contexts": ["selection"]
        };

        await chrome.contextMenus.create(contextMenu);
    } catch (err) { 
        console.log(err);
    }
}

async function removeContextMenuButton() {
    try {
        await chrome.contextMenus.removeAll();
    } catch (err) {
        console.log(err);
    }
}