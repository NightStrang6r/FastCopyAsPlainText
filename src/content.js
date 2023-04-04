console.log('CopyAsPlainText loaded');

document.addEventListener('copy', async (e) => await copy(e));

async function copy(e) {
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