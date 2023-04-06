//console.log('CopyAsPlainText loaded');

document.addEventListener('copy', async (e) => await copyByEvent(e));
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => onMessage(request, sender, sendResponse));

async function onMessage(request, sender, sendResponse) {
    if (request.message === "copyText")
        copyByText(request.textToCopy);
}

async function copyByEvent(e) {
    console.log('Copy event');
    e.preventDefault();
    try {
        const plaintText = window.getSelection()?.toString()?.trim();
        if (plaintText) {
            await navigator.clipboard.writeText(plaintText);
        }
    } catch (err) {
        console.error(err.name, err.message);
    }
}

async function copyByText(text) {
    console.log('Copy text');
    try {
        if (text) {
            await navigator.clipboard.writeText(text);
        }
    } catch (err) {
        console.error(err.name, err.message);
    }
}