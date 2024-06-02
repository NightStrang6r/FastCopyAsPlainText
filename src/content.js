console.log('CopyAsPlainText loaded');

document.addEventListener('copy', async (e) => await copyByEvent(e));
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => onMessage(request, sender, sendResponse));

async function onMessage(request, sender, sendResponse) {
    if (request.message === "copyText") {
        copyByEvent();
    }
}

async function copyByEvent(e) {
    if (e) {
        e.preventDefault();
    }
    
    try {
        const plaintText = window.getSelection()?.toString()?.trim();
        if (plaintText) {
            await navigator.clipboard.writeText(plaintText);
            showCopiedNotification();
            console.log('Text copied');
        }
    } catch (err) {
        console.log(err.name, err.message);
    }
}

function showCopiedNotification() {
    const message = 'Copied';

    const style = {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: 'green',
        color: 'white',
        padding: '10px 15px',
        borderRadius: '10px',
        opacity: '1',
        transition: 'opacity 0.5s ease',
        zIndex: '1000'
    };

    showNotification(message, style);
}

function showFailedToCopyNotification() {
    const message = 'Failed to copy';

    const style = {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: 'red',
        color: 'white',
        padding: '10px 15px',
        borderRadius: '10px',
        opacity: '1',
        transition: 'opacity 0.5s ease',
        zIndex: '1000'
    };

    showNotification(message, style);
}

function showNotification(message, style) {
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