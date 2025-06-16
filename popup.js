document.getElementById("summarize").addEventListener("click", () => {
    const resultDiv = document.getElementById("result");
    const summaryType = document.getElementById("summary-type").value;

    resultDiv.textContent = "Extracting Text...";

    // Get user's API key
    chrome.storage.sync.get(['geminiApiKey'], ({ geminiApiKey }) => {
        if (!geminiApiKey) {
            resultDiv.textContent = "No API key set. Click the gear icon to add one";
            return;
        }

        // Get content from active tab
        chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
            chrome.tabs.sendMessage(
                tab.id,
                { type: "GET_ARTICLE_TEXT" },
                async (response) => {
                    if (chrome.runtime.lastError) {
                        resultDiv.textContent = "Error: " + chrome.runtime.lastError.message;
                        return;
                    }
                    
                    if (!response || !response.text) {
                        resultDiv.textContent = "Couldn't extract text from this page";
                        return;
                    }

                    // Send text to Gemini
                    try {
                        const summary = await getGeminiSummary(response.text, summaryType, geminiApiKey);
                        resultDiv.textContent = summary;
                    } catch (error) {
                        resultDiv.textContent = "Gemini Error: " + error.message;
                    }
                }
            );
        });
    });
});

async function getGeminiSummary(rawText, type, apikey) {
    const max = 20000;
    const text = rawText.length > max ? rawText.slice(0, max) + "..." : rawText;

    const promptMap = {
        brief: `Summarize this in 5-6 sentences:\n\n${text}`,
        detailed: `Give a detailed summary:\n\n${text}`,
        bullets: `Summarize in 6-7 bullet points (start each line with "-"):\n\n${text}`,
    };

    const prompt = promptMap[type] || promptMap.brief;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apikey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.2 }
        })
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error?.message || "Request Failed");
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "No Summary";
}

document.getElementById("copy-btn").addEventListener("click", () => {
    const txt = document.getElementById("result").innerText;
    if (!txt || txt === "Extracting Text..." || txt.includes("Error")) return;

    navigator.clipboard.writeText(txt).then(() => {
        const btn = document.getElementById("copy-btn");
        const oldText = btn.textContent;
        btn.textContent = "Copied!";
        setTimeout(() => (btn.textContent = oldText), 2000);
    });
});