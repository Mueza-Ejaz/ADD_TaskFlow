# Quickstart: AI Chatbot Frontend Development

**Feature**: `P3-06-AI-chatbotUI`

## Prerequisites

1. **Backend Running**: Ensure the Phase 5 FastAPI backend is running on `http://localhost:8000`.
2. **Environment Variables**:
   Create or update `.env.local` in the `frontend/` directory:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_OPENAI_DOMAIN_KEY=your_dev_key_here  # If using ChatKit managed backend
   ```

## Running the Chatbot

1. **Install Dependencies**:
   ```bash
   cd frontend
   npm install @openai/chatkit framer-motion
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Verify Integration**:
   - Navigate to `http://localhost:3000/dashboard/chatbot`.
   - Open browser DevTools > Network tab.
   - Send a message "Hello".
   - Verify a `POST` request to `/api/{user_id}/chat` is made and returns a 200 OK.

## Troubleshooting

- **401 Unauthorized**: Check that you are logged in via Better Auth and the token is valid.
- **CORS Errors**: Ensure the backend `main.py` allows `http://localhost:3000` in `CORSMiddleware`.
- **ChatKit Errors**: Verify the `NEXT_PUBLIC_OPENAI_DOMAIN_KEY` is correct if utilizing ChatKit's hosted features (though we are proxying via our backend).
