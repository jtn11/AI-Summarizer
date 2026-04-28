# AI Summary for Articles

A lightweight, powerful Chrome Extension that instantly summarizes web articles and blog posts using Groq's ultra-fast AI inference API. 

## Features

- **Three Summary Modes**: Choose between *Brief*, *Detailed*, or *Bullet Points* depending on how much time you have.
- **Smart Text Extraction**: Automatically strips away noisy elements like ads, navigation bars, sidebars, and comments to only summarize the main article content.
- **Lightning Fast**: Powered by Groq's `llama-3.1-8b-instant` model for extremely fast and high-quality responses.
- **One-Click Copy**: Easily copy the generated summary to your clipboard.
- **Secure Storage**: Your API key is stored securely using Chrome's sync storage.

## Installation

1. Clone or download this repository to your local machine.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** using the toggle switch in the top right corner.
4. Click the **Load unpacked** button in the top left.
5. Select the folder containing this extension's files (where `manifest.json` is located).

## Configuration

Before using the extension, you'll need to set up your free Groq API key:

1. Create an account and generate a free API key from the [Groq Console](https://console.groq.com/keys).
2. Click the **AI Summary** extension icon in your Chrome toolbar.
3. Click the Settings icon (⚙️) to open the Options page.
4. Paste your Groq API key and click **Save Settings**.

## Usage

1. Navigate to any article, blog post, or text-heavy web page.
2. Click the **AI Summary** extension icon in your browser toolbar.
3. Select your desired summary format from the dropdown menu (Brief, Detailed, or Bullet Points).
4. Click **Summarize** and wait a moment for the AI to process the text.
5. Read your summary or use the **Copy** button to copy it to your clipboard!

## Technologies Used

- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Chrome APIs**: Manifest V3, `chrome.runtime`, `chrome.scripting`, `chrome.storage`
- **AI / LLM**: Groq API (Model: `llama-3.1-8b-instant`)

## License

MIT License
