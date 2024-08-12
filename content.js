chrome.storage.sync.get("blockedWordsMap", function (data) {
    const blockedWordsMap = data.blockedWordsMap || {};

    // Create and insert overlay to hide replacement
    const overlay = document.createElement('div');
    overlay.id = 'overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'white';
    overlay.style.zIndex = '9999';
    document.body.appendChild(overlay);

    function replaceText(node) {
        if (node.nodeType === 3) { 
            let text = node.nodeValue;
            for (const [word, replacement] of Object.entries(blockedWordsMap)) {
                const regex = new RegExp(`\\b${word}\\b`, 'gi');
                text = text.replace(regex, replacement);
            }
            node.nodeValue = text;
        } else if (node.nodeType === 1 && node.nodeName !== "SCRIPT" && node.nodeName !== "STYLE") {
            node.childNodes.forEach(replaceText);
        }
    }

    function observeMutations() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            replaceText(node);
                        }
                    });
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function init() {
        replaceText(document.body);
        observeMutations();

        // Once replacements are complete remove the overlay 
        if (overlay) {
            overlay.parentNode.removeChild(overlay);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
});
