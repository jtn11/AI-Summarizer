document.addEventListener("DOMContentLoaded", () => {
    // Fetch the key correctly to avoid [object Object] bug
    chrome.storage.sync.get(['groqApiKey'], (result) => {
        if (result.groqApiKey) {
            document.getElementById('api-key').value = result.groqApiKey;
        }
    });

    document.getElementById("save-button").addEventListener("click", () => {
        const apikey = document.getElementById("api-key").value.trim();
        if (!apikey) return;

        chrome.storage.sync.set({ groqApiKey: apikey }, () => {
            const msg = document.getElementById("success-message");
            msg.style.display = 'block';
            setTimeout(() => {
                msg.style.display = 'none';
                window.close();
            }, 1000);
        });
    });
});