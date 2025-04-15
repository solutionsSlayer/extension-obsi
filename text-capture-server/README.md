# Text Capture Server

A server that captures text from web pages, processes it using Ollama LLM, and creates structured notes in Obsidian.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [Ollama](https://ollama.ai/) installed locally
- An [Obsidian](https://obsidian.md/) vault (optional, can be configured to use another directory)

## Setup

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Make sure Ollama is installed and running on your system
4. Pull the Llama 3.1 model in Ollama:
   ```
   ollama pull llama3.1:latest
   ```

## Configuration

You can configure the server by editing `server.js`:

- `PORT`: Server port (default: 3000)
- `OBSIDIAN_VAULT_PATH`: Path to your Obsidian vault (default: 'E:/obsidian')
- `NOTES_FOLDER`: Folder where captured notes will be stored (default: 'Notes Capturées')
- LLM model: Change the model in `processWithOllama()` function (default: "llama3.1:latest")

## Usage

1. Start the server:
   ```
   npm start
   ```
   or
   ```
   node server.js
   ```

2. Use the browser extension to capture text from web pages. The extension sends requests to this server.

3. The server processes the captured text using Ollama LLM and creates a structured note in your Obsidian vault.

## Testing

- Test Ollama connection:
  ```
  node test-ollama.js
  ```

- Test server connection:
  ```
  node test-connection.js
  ```

## API Endpoints

- `GET /health`: Health check endpoint
- `POST /capture`: Endpoint to capture text
  - Request body:
    ```json
    {
      "text": "Text to capture",
      "style": "Style for formatting",
      "source": "URL source",
      "title": "Page title"
    }
    ```

## Extension Integration

This server is designed to work with a browser extension that captures text from web pages. The extension should send POST requests to the `/capture` endpoint with the required data.

For the extension setup and usage, please refer to the extension's README.
