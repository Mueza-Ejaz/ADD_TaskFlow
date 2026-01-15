# Quickstart: AI Chatbot Backend

## Prerequisites

- Python 3.12+
- Docker (for database)
- OpenAI API Key

## Setup

1. **Environment Variables**:
   Ensure `.env` contains:
   ```bash
   DATABASE_URL=postgresql://postgres:password@localhost:5432/taskflow
   OPENAI_API_KEY=sk-...
   JWT_SECRET=your_secret
   ```

2. **Install Dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   # Ensure mcp and openai-agents-sdk are installed (if not in requirements yet)
   pip install mcp openai
   ```

3. **Database Migration**:
   ```bash
   # Run migrations to create conversations/messages tables
   alembic upgrade head
   ```

## Running the Server

Since the MCP tools are embedded in the FastAPI application (internal usage), you just need to run the FastAPI server.

```bash
cd backend
uvicorn src.main:app --reload --port 8000
```

## Testing the Chat

Use curl or Postman to test the endpoint:

```bash
curl -X POST "http://localhost:8000/api/v1/{USER_ID}/chat" \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer {YOUR_JWT_TOKEN}" \
     -d '{
           "message": "Remind me to call Mom",
           "conversation_id": null
         }'
```

## Developer Tools

To check documentation for libraries using the skill:
```bash
# In CLI agent
Apply skill from .claude/skills/context7-expert.md
```

