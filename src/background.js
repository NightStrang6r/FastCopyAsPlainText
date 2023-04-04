/*const contextMenu = {
    "id": "copyAsPlainText",
    "title": "Copy as Plain Text",
    "contexts": ["selection"]
};

chrome.contextMenus.create(contextMenu);
chrome.contextMenus.onClicked.addListener(async (itemData) => await copy(itemData.selectionText));

async function copy(text) {
    try {
        if (text) {
            await navigator.clipboard.writeText(text);
        }
    } catch (err) {
        console.error(err.name, err.message);
    }
}*/