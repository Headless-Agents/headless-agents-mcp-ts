import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { 
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListPromptsRequestSchema,
  ListToolsRequestSchema
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import dotenv from 'dotenv';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file in project root
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const HEADLESS_AGENTS_API_KEY = process.env.HEADLESS_AGENTS_API_KEY;
if (!HEADLESS_AGENTS_API_KEY) {
  throw new Error('HEADLESS_AGENTS_API_KEY environment variable is required');
}

// Create MCP server instance
const server = new Server(
  {
    name: 'headless-agents',
    version: '1.0.0'
  },
  {
    capabilities: {
      resources: {},
      prompts: {},
      tools: {
        call_agent: {
          name: 'call_agent',
          description: 'Call a Headless Agent with a request',
          inputSchema: {
            type: 'object',
            properties: {
              agent_id: {
                type: 'string',
                description: 'The ID of the agent to call'
              },
              request: {
                type: 'string',
                description: 'The request message to send to the agent'
              },
              conversation_id: {
                type: 'string',
                description: 'Optional conversation ID for continuing conversations'
              }
            },
            required: ['agent_id', 'request']
          },
          examples: [
            {
              description: "Call an agent with a request",
              arguments: {
                agent_id: "example-agent-id",
                request: "What is the weather like today?"
              }
            }
          ]
        }
      }
    }
  }
);

// Add the call_agent tool
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name !== 'call_agent') {
    throw new Error(`Unknown tool: ${request.params.name}`);
  }

  const args = request.params.arguments as {
    agent_id: string;
    request: string;
    conversation_id?: string;
  };

  const { agent_id, request: agentRequest, conversation_id } = args;
    try {
      const baseUrl = 'https://api.headlessagents.ai/call/';
      const agentUrl = baseUrl + agent_id;

      const headers = {
        'X-API-Key': HEADLESS_AGENTS_API_KEY,
        'Content-Type': 'application/json'
      };

      const payload = {
        request: agentRequest,
        conversation_id
      };

      const response = await fetch(agentUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(data, null, 2)
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Error calling Headless Agents API: ${errorMessage}`);
    }
  }
);

// Add handlers for tools/list, resources/list and prompts/list
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'call_agent',
        description: 'Call a Headless Agent with a request',
        inputSchema: {
          type: 'object',
          properties: {
            agent_id: {
              type: 'string',
              description: 'The ID of the agent to call'
            },
            request: {
              type: 'string',
              description: 'The request message to send to the agent'
            },
            conversation_id: {
              type: 'string',
              description: 'Optional conversation ID for continuing conversations'
            }
          },
          required: ['agent_id', 'request']
        }
      }
    ]
  };
});

server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: []
  };
});

server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: []
  };
});

// Error handling
server.onerror = (error) => console.error('[MCP Error]', error);

// Start the server
const transport = new StdioServerTransport();
await server.connect(transport);
console.error('Headless Agents MCP server running on stdio');
