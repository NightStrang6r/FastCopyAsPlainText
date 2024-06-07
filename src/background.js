console.log(`CopyAsPlainText service started.`);

const contextMenu = {
    "id": "copyAsPlainText",
    "title": "Copy as Plain Text",
    "contexts": ["selection"]
};

async function main() {
    const settings = await getSettings();

    if (settings['context-menu']) {
        try {
            await chrome.contextMenus.removeAll();
            await chrome.contextMenus.create(contextMenu);
        } catch (err) {
            console.log(err);
        }
    }
}

main();
chrome.contextMenus.onClicked.addListener(async (itemData) => await onContextMenuItemClicked(itemData));
chrome.commands.onCommand.addListener(async (command) => await onCommand(command));

async function getSettings() {
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