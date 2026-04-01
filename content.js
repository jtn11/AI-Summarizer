function getArticleText() {
    // Clone the body so we don't modify the actual page
    const clone = document.body.cloneNode(true);

    // Remove noisy elements
    const noisySelectors = [
        'nav', 'header', 'footer', 'script', 'style', 'noscript', 
        'aside', '.sidebar', '.ad', '#comments'
    ];
    
    noisySelectors.forEach(selector => {
        const elements = clone.querySelectorAll(selector);
        elements.forEach(el => el.remove());
    });

    // Try to find the main article container first
    let mainContent = clone.querySelector('article') || clone.querySelector('main') || clone;

    // Get the inner text and clean up excessive whitespace
    let text = mainContent.innerText || "";
    return text.replace(/\n\s*\n/g, '\n\n').trim();
}

chrome.runtime.onMessage.addListener((req, _sender, sendResponse) => {
    if (req.type === 'GET_ARTICLE_TEXT') {
        const text = getArticleText();
        sendResponse({ text });
    }
});