# Headless Agents MCP Server

A Model Context Protocol (MCP) server for integrating Headless Agents with Claude Desktop. This server allows you to call Headless Agents API directly from Claude Desktop.

## Features

- Seamless integration with Claude Desktop
- Support for conversation continuity via conversation IDs
- Error handling and logging
- Environment-based configuration

## Prerequisites

- Node.js (v16 or higher)
- A Headless Agents API key from [headlessagents.ai](https://headlessagents.ai)
- Claude Desktop application

## Installation

1. Clone the repository:
```bash
git clone https://github.com/headless-agents/headless-agents-mcp-ts.git
cd headless-agents-mcp-ts
```

2. Install dependencies:
```bash
cd headless-agents-mcp && npm install
```

3. Create a `.env` file in the `headless-agents-mcp` directory:
```bash
HEADLESS_AGENTS_API_KEY=your_api_key_here
```

4. Build and start the server:
```bash
npm run build && node dist/index.js
```

## Integration with Claude Desktop

Add the following configuration to your Claude Desktop config file:

```json
{
    "headless-agents": {
        "command": "node",
        "args": [
            "{path_to_headless-agents-mcp}/dist/index.js"
        ]
    }
}
```

Replace `{path_to_headless-agents-mcp}` with the absolute path to your installation directory.

## Usage

Once configured, you can call Headless Agents directly from Claude Desktop using the `call_agent` tool. Here's an example:

```javascript
// Example tool call
{
    "agent_id": "agent-id",
    "request": "Hey! How are you?",
    "conversation_id": "optional-conversation-id"
}
```

### Parameters

- `agent_id` (required): The ID of the Headless Agent you want to call
- `request` (required): The message or request you want to send to the agent
- `conversation_id` (optional): ID for maintaining conversation context across multiple calls

## Error Handling

The server includes comprehensive error handling:
- API authentication errors
- Network request failures
- Invalid agent IDs or requests
- Server connection issues



