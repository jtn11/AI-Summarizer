// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "SUMMARIZE_ARTICLE") {
        // Handle the API call asynchronously
        handleSummarize(request.text, request.summaryType)
            .then(summary => sendResponse({ summary, error: null }))
            .catch(error => sendResponse({ summary: null, error: error.message }));
        
        // Return true to indicate we will send a response asynchronously
        return true; 
    }
});

// Run when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get(["groqApiKey"], (result) => {
        if (!result.groqApiKey) {
            chrome.runtime.openOptionsPage();
        }
    });
});

async function handleSummarize(rawText, type) {
    const data = await chrome.storage.sync.get(['groqApiKey']);
    const apikey = data.groqApiKey;

    if (!apikey) {
        throw new Error("No API key set. Please open options to add one.");
    }

    // Limit text to roughly avoid token limits
    const max = 20000; 
    const text = rawText.length > max ? rawText.slice(0, max) + "..." : rawText;

    const promptMap = {
        brief: `Summarize the following text in 5-6 sentences:\n\n${text}`,
        detailed: `Provide a detailed summary of the following text:\n\n${text}`,
        bullets: `Summarize the following text in 6-7 bullet points (start each line with "-"):\n\n${text}`,
    };

    const prompt = promptMap[type] || promptMap.brief;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apikey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "llama-3.1-8b-instant", // Default Groq model chosen
            messages: [{ role: "user", content: prompt }],
            temperature: 0.2
        })
    });

    if (!res.ok) {
        let errorMsg = `Request Failed (${res.status})`;
        try {
            const errorData = await res.json();
            if (errorData.error && errorData.error.message) {
                errorMsg = errorData.error.message;
            }
        } catch (e) {
            // Ignore JSON parse error if raw text
        }
        throw new Error(errorMsg);
    }

    const responseData = await res.json();
    return responseData.choices?.[0]?.message?.content ?? "No summary generated.";
}
