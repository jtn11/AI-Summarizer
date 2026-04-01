document.getElementById("summarize").addEventListener("click", () => {
    const resultDiv = document.getElementById("result");
    const summaryType = document.getElementById("summary-type").value;
    const btn = document.getElementById("summarize");

    resultDiv.textContent = "Extracting Text...";
    btn.disabled = true;

    // Check for API key first
    chrome.storage.sync.get(['groqApiKey'], ({ groqApiKey }) => {
        if (!groqApiKey) {
            resultDiv.innerHTML = 'No API key set. <a href="#" id="open-options">Click here to add one</a>';
            document.getElementById("open-options").addEventListener("click", () => {
                chrome.runtime.openOptionsPage();
            });
            btn.disabled = false;
            return;
        }

        // Get content from active tab
        chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
            if (!tab) {
                resultDiv.textContent = "Error: Could not find active tab.";
                btn.disabled = false;
                return;
            }

            chrome.tabs.sendMessage(
                tab.id,
                { type: "GET_ARTICLE_TEXT" },
                (response) => {
                    if (chrome.runtime.lastError) {
                        resultDiv.textContent = "Error: Please reload the page to allow script execution.";
                        btn.disabled = false;
                        return;
                    }
                    
                    if (!response || !response.text || response.text.trim() === "") {
                        resultDiv.textContent = "Couldn't extract readable text from this page.";
                        btn.disabled = false;
                        return;
                    }

                    resultDiv.textContent = "Generating Summary with Groq...";

                    // Send text to background service worker
                    chrome.runtime.sendMessage(
                        { 
                            type: "SUMMARIZE_ARTICLE", 
                            text: response.text, 
                            summaryType: summaryType 
                        },
                        (bgResponse) => {
                            btn.disabled = false;
                            
                            if (chrome.runtime.lastError) {
                                resultDiv.textContent = "Background script error: " + chrome.runtime.lastError.message;
                                return;
                            }

                            if (bgResponse.error) {
                                resultDiv.textContent = "Groq Error: " + bgResponse.error;
                            } else {
                                resultDiv.textContent = bgResponse.summary;
                            }
                        }
                    );
                }
            );
        });
    });
});

document.getElementById("copy-btn").addEventListener("click", () => {
    const txt = document.getElementById("result").innerText;
    if (!txt || txt.includes("Extracting") || txt.includes("Generating") || txt.includes("Error") || txt.includes("No API key")) return;

    navigator.clipboard.writeText(txt).then(() => {
        const btn = document.getElementById("copy-btn");
        const oldText = btn.textContent;
        btn.textContent = "Copied!";
        setTimeout(() => (btn.textContent = oldText), 2000);
    });
});

const settingsBtn = document.getElementById("settings-btn");
if (settingsBtn) {
    settingsBtn.addEventListener("click", () => {
        chrome.runtime.openOptionsPage();
    });
}