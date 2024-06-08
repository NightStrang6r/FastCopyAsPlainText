console.log(`CopyAsPlainText service started.`);

async function main() {
    const settings = await getSettings();

    if (settings && settings['context-menu']) {
        await removeContextMenuButton();
        await createContextMenuButton();
    }
}

main();
chrome.runtime.onInstalled.addListener(async () => await injectScript());
chrome.contextMenus.onClicked.addListener(async (itemData) => await onContextMenuItemClicked(itemData));
chrome.commands.onCommand.addListener(async (command) => await onCommand(command));

async function getSettings() {
    const defaultSettings = {
        'ctrl-c': true,
        'alt-c': true,
        'show-notification': true,
        'context-menu': true
    };
    let settings = {};
    try {
        settings = await new Promise((resolve) => {
            chrome.storage.local.get(['settings'], function(result) {
                let settings = {};
                if(!result.settings) {
                    settings = defaultSettings;
                } else {
                    settings = result.settings;
                }
        
                resolve(settings);
            });
        });
    } catch (err) {
        settings = defaultSettings;
    }
    
    return settings;
}

async function onContextMenuItemClicked(itemData) {
    await sendCopyReq("contextMenu");
}

async function onCommand(command) {
    console.log(`Command ${command} received.`);
    switch (command) {
        case 'copy':
            await sendCopyReq("command");
            break;
        case 'clearText':
            await sendClearenceReq();
            break;
        default:
            console.log(`Command ${command} not found.`);
    }
}

async function injectScript() {
    try {
        const tabs = await chrome.tabs.query({});

        for (let tab of tabs) {
            try {
                if (!/^https?/.test(tab.url)) continue;

                await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ['src/content.js']
                });
                console.log(`Script injected to tab ${tab.id}.`);
            } catch (err) {
                console.log(err);
            }
        }
    } catch (err) {
        console.log(err);
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

async function getActiveTab() {
    try {
        const query = { active: true, currentWindow: true };
        const tabs = await chrome.tabs.query(query);
        return tabs[0].id;
    } catch (err) {
        console.log(err.name, err.message);
    }
}

async function sendCopyReq(type) {
    try {
        const tab = await getActiveTab();
        const data = {
            message: "copy",
            type: type
        };
    
        await chrome.tabs.sendMessage(tab, data);
    } catch (err) {
        console.log(err.name, err.message);
    }
}

async function sendClearenceReq() {
    try {
        const tab = await getActiveTab();
        const data = {
            message: "clearCopiedText"
        };
    
        await chrome.tabs.sendMessage(tab, data);
    } catch (err) {
        console.log(err.name, err.message);
    }
}