console.log(`CopyAsPlainText service started.`);

const contextMenu = {
    "id": "copyAsPlainText",
    "title": "Copy as Plain Text",
    "contexts": ["selection"]
};

chrome.contextMenus.removeAll(function() {
    try {
        chrome.contextMenus.create(contextMenu);
    } catch (err) {
        console.log(err);
    }
});

chrome.contextMenus.onClicked.addListener(async (itemData) => await sendCopyReq(itemData.selectionText));
chrome.commands.onCommand.addListener((command) => onCommand(command));

function onCommand(command) {
    switch (command) {
        case 'copy':
            console.log('copy command executed');
            sendCopyReq();
            break;
        default:
            console.log(`Command ${command} not found`);
    }
}

async function sendCopyReq() {
    try {
        const query = { active: true, currentWindow: true };
        chrome.tabs.query(query, (tabs) => copyCallback(tabs));
    } catch (err) {
        console.log(err.name, err.message);
    }
}

function copyCallback(tabs) {
    try {
        const tab = tabs[0].id;
        const data = {
            message: "copyText"
        };
    
        chrome.tabs.sendMessage(tab, data, (response) => {return 1;});
    } catch (err) {
        console.log(err.name, err.message);
    }
}