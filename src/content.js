console.log('[CopyAsPlainText] Loaded.');

document.addEventListener('copy', async (e) => await onCopyEvent(e));
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => await onMessage(request, sender, sendResponse));

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

async function onMessage(request, sender, sendResponse) {
    const settings = await getSettings();

    if (request.message === "copy" && request.type === "contextMenu") {
        await copy(settings);
    }

    if (request.message === "clearCopiedText" && settings['alt-c']) {
        await clearCopiedText();
    }

    sendResponse({message: "OK."});
    return true;
}

async function onCopyEvent(e)  {
    const settings = await getSettings();

    if (settings['ctrl-c']) {
        if (e) {
            e.preventDefault();
        }

        await copy(settings);
    }
}

async function copyWithClearence() {
    await sleep(15);
    await clearCopiedText();
}

async function copy(settings) {
    try {
        console.log(settings);
        const plaintText = window.getSelection()?.toString()?.trim();

        if (plaintText === null || plaintText === undefined) return;

        await navigator.clipboard.writeText(plaintText);

        if (settings['show-notification']) {
            showNotification('Copied', 'green');
        }
        
        console.log('[CopyAsPlainText] Text copied as plain text');
    } catch (err) {
        console.log(err.name, err.message);
    }
}

async function clearCopiedText() {
    try {
        const text = await navigator.clipboard.readText();
        const plaintText = text?.toString()?.trim();
        await navigator.clipboard.writeText(plaintText);

        console.log(`[CopyAsPlainText] Text cleared`);
        showNotification('Text cleared', 'coral');
    } catch (err) {
        console.log(err.name, err.message);

        if (err.name === 'NotAllowedError') {
            console.log('[CopyAsPlainText] Permission denied.');
            showNotification('Permission denied', 'coral');
        }
    }
}

function showNotification(message, color) {
    const style = {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: color,
        color: 'white',
        padding: '10px 15px',
        borderRadius: '10px',
        opacity: '1',
        transition: 'opacity 0.5s ease',
        zIndex: '9999999999'
    };

    const notification = document.createElement('div');
    notification.classList.add('copied-notification');
    notification.innerText = message;

    Object.assign(notification.style, style);

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
    }, 500);

    setTimeout(() => {
        notification.remove();
    }, 1000);
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}