# Headless Agents MCP Server

A TypeScript implementation of an MCP server for interfacing with the Headless Agents API.

## Installation

1. Clone this repository
2. Install dependencies:
```bash
npm install
```
3. Copy `.env.example` to `.env` and add your Headless Agents API key:
```bash
HEADLESS_AGENTS_API_KEY=your_api_key_here
```

## Development

To run the server in development mode:

```bash
npm run dev
```

## Building

To build the server:

```bash
npm run build
```

## Running

To run the built server:

```bash
npm start
```

## Available Tools

### call_agent

Calls a Headless Agent with a request.

Parameters:
- `agent_id` (string): The ID of the agent to call
- `request` (string): The request message to send to the agent
- `conversation_id` (string, optional): Optional conversation ID for continuing conversations

Example usage:
```typescript
const result = await client.callTool({
  name: "call_agent",
  arguments: {
    agent_id: "your-agent-id",
    request: "Your request message",
    conversation_id: "optional-conversation-id"
  }
});
```

## License

MIT 