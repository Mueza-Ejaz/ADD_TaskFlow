# Data Model: Phase 6 AI Chatbot Frontend

**Feature**: AI Chatbot Frontend (`P3-06-AI-chatbotUI`)
**Date**: 2026-01-16

## 1. Entities

### Message
Represents a single unit of communication in the chat stream.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string (UUID) | Yes | Unique identifier for the message. |
| `role` | enum | Yes | Sender role: `'user'`, `'assistant'`, or `'system'`. |
| `content` | string | Yes | The actual text content of the message. |
| `createdAt` | DateTime | Yes | Timestamp of when the message was sent. |
| `status` | enum | Yes | Delivery status: `'sending'`, `'sent'`, `'error'`. |
| `toolCalls` | `ToolCall[]` | No | Array of tool calls associated with this message. |

### ToolCall
Represents an action performed by the AI agent (e.g., creating a task).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique ID for the tool call. |
| `name` | string | Yes | Name of the tool (e.g., `add_task`, `list_tasks`). |
| `args` | object | Yes | JSON object of arguments passed to the tool. |
| `status` | enum | Yes | Execution status: `'call'`, `'success'`, `'error'`. |
| `result` | string/object | No | The output returned from the tool execution. |

### Conversation
Represents a thread of interaction.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string (UUID) | Yes | Unique identifier for the conversation. |
| `title` | string | No | Auto-generated title based on the first message. |
| `updatedAt` | DateTime | Yes | Last activity timestamp. |
| `messages` | `Message[]` | Yes | List of messages in the thread. |

## 2. Frontend State (React Context)

### ChatState
The global state managed by `ChatProvider`.

```typescript
interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Message[]; // Messages for the active conversation
  isLoading: boolean;
  isTyping: boolean; // True when AI is generating response
  error: Error | null;
}
```

## 3. Validation Rules

- **Message Content**: Must not be empty (trimmed length > 0).
- **Tool Args**: Must match the schema defined by the specific MCP tool.
- **Optimistic Updates**:
  - When user sends a message, immediately add to `messages` with `status: 'sending'`.
  - Update to `status: 'sent'` upon server ACK.
  - Update to `status: 'error'` if request fails.
