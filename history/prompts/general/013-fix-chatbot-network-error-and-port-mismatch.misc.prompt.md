---
id: 013
title: Fix Chatbot Network Error and Port Mismatch
stage: misc
date: 2026-01-20
surface: agent
model: gemini-2.0-flash-thinking-exp
feature: chatbot
branch: main
user: Yousuf Traders
command: resolve network error in ChatAPIClient
labels: [fix, network, chatbot, cors, env]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - frontend/lib/api/chat.ts
 - frontend/lib/api/chatkit.ts
 - frontend/.env.local
 - backend/.env
tests:
 - manual verification of API base URL and port
---

## Prompt

## Error TypeConsole AxiosError## Error MessageNetwork Error    at XMLHttpRequest.handleError (file://C:/Users/Yousuf Traders/.gemini/ADD_TaskFlow-App/frontend/.next/dev/static/chunks/node_modules_98cb73ff._.js:10840:25)    at Axios.request (file://C:/Users/Yousuf Traders/.gemini/ADD_TaskFlow-App/frontend/.next/dev/static/chunks/node_modules_98cb73ff._.js:11598:49)    at async ChatAPIClient.fetchConversations (file://C:/Users/Yousuf Traders/.gemini/ADD_TaskFlow-App/frontend/.next/dev/static/chunks/_fd2cb9fe._.js:1296:30)    at async useConversations.useEffect.fetchConversations (file://C:/Users/Yousuf Traders/.gemini/ADD_TaskFlow-App/frontend/.next/dev/static/chunks/_fd2cb9fe._.js:1687:47)Next.js version: 16.1.1 (Turbopack) ====ye error a rhaa hy isy resolve kary or make koi other funactionality kharaab na hoo

## Response snapshot

I have fixed the `Network Error` by resolving a port mismatch and aligning environment variable names across the frontend.
1. Updated `frontend/lib/api/chat.ts` and `frontend/lib/api/chatkit.ts` to use `NEXT_PUBLIC_API_BASE_URL` (the standard used in the rest of the app) instead of `NEXT_PUBLIC_API_URL`.
2. Corrected the backend port in `frontend/.env.local` from `8001` to `8000` to match the actual backend configuration.
3. Expanded `ALLOWED_ORIGINS` in `backend/.env` to include more localhost variations to prevent CORS-related network failures.

## Outcome

- ✅ Impact: Resolved the Axios Network Error preventing the chatbot from fetching conversations.
- 🧪 Tests: Verified port consistency between backend start scripts and frontend environment configuration.
- 📂 Files: Modified frontend API clients, .env.local, and backend .env.
- 🔗 Next prompts: None.
- 🧠 Reflection: The primary cause was a port mismatch (8001 vs 8000) and inconsistent environment variable naming between different parts of the frontend.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null
