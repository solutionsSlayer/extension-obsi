# Text Capture for Obsidian - Browser Extension

A browser extension that allows you to capture text from web pages and send it to the Text Capture Server, which processes it and creates structured notes in Obsidian.

## Features

- Capture selected text from any web page
- Choose different note styles for formatting the captured content
- Right-click context menu integration
- Simple popup interface for settings
- Real-time notifications of capture status

## Prerequisites

- The Text Capture Server must be running on your local machine (see the server README.md)
- Chrome, Edge, or any Chromium-based browser

## Installation

### Load as an Unpacked Extension

1. Clone or download this repository
2. Open your browser's extension page:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
   - Brave: `brave://extensions/`
3. Enable "Developer mode" (toggle in the top-right corner)
4. Click "Load unpacked" and select the `text-capture-extension` folder
5. The extension icon should appear in your browser toolbar

## Usage

### Capturing Text

1. Select text on any web page
2. Right-click and choose "Capture for Obsidian" from the context menu
3. The text will be sent to the server, processed, and saved as a note in your Obsidian vault
4. You'll receive a notification indicating success or failure

### Changing Note Style

1. Click the extension icon in your browser toolbar
2. Select your preferred note style from the dropdown menu
3. The style will be applied to all future text captures

## Available Note Styles

- Concise: A compact version of the text
- Detailed: A detailed version with more context
- Bullet Points: Text formatted as bullet points
- Q&A: Text formatted as questions and answers
- Summary: A summarized version of the text

## Troubleshooting

- If you receive a connection error, make sure the Text Capture Server is running on your local machine
- Check the server is running on port 3000 (default)
- Verify that Ollama is installed and the required model is available

## Development

The extension consists of:

- `manifest.json`: Extension configuration
- `content.js`: Content script that tracks hovered elements
- `background.js`: Background script that handles context menu actions and server communication
- `popup.html/js`: The popup UI for settings

To modify the extension:

1. Make your changes to the code
2. Go to the extensions page and click the refresh icon on the extension
3. Test your changes
