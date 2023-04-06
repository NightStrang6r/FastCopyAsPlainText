const contextMenu = {
    "id": "copyAsPlainText",
    "title": "Copy as Plain Text",
    "contexts": ["selection"]
};

chrome.contextMenus.create(contextMenu);
chrome.contextMenus.onClicked.addListener(async (itemData) => await sendCopyReq(itemData.selectionText));

async function sendCopyReq(text) {
    try {
        if (!text) return;

        const query = { active: true, currentWindow: true };
        chrome.tabs.query(query, (tabs) => copyCallback(tabs));
    } catch (err) {
        console.error(err.name, err.message);
    }
}

function copyCallback(tabs) {
    try {
        const tab = tabs[0].id;
        const data = {
            message: "copyText",
            textToCopy: "some text" 
        };
    
        chrome.tabs.sendMessage(tab, data, (response) => {return 1;});
    } catch (err) {
        console.error(err.name, err.message);
    }
}