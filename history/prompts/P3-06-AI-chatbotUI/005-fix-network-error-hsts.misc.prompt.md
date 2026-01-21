---
id: 005
title: Disable SecurityHeadersMiddleware to fix HSTS on localhost
stage: misc
date: 2026-01-18
surface: agent
model: gemini-2.0-flash-thinking-exp
feature: P3-06-AI-chatbotUI
branch: main
user: Yousuf Traders
command: none
labels: [bugfix, backend, security, network-error]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - backend/src/main.py
tests:
  - Invoke-WebRequest verification
---

## Prompt

## Error Type
Console AxiosError

## Error Message
Network Error
...
    at async ChatAPIClient.fetchConversations (file://C:/Users/Yousuf Traders/.gemini/ADD_TaskFlow-App/frontend/.next/dev/static/chunks/_fd2cb9fe._.js:1265:30)

## Response snapshot

I disabled the `SecurityHeadersMiddleware` in the backend because it was sending `Strict-Transport-Security` (HSTS) and restrictive `Content-Security-Policy` (CSP) headers. These cause browsers to block or force-upgrade requests to HTTPS on localhost, resulting in a "Network Error" in Axios. I also restarted the backend server.

## Outcome

- ✅ Impact: Removed restrictive security headers that break local development.
- 🧪 Tests: Verified headers are gone using `Invoke-WebRequest`.
- 📁 Files: Modified `backend/src/main.py`.
- 🔁 Next prompts: none.
- 🧠 Reflection: HSTS should never be enabled for non-HTTPS local development as it's difficult to clear once cached by the browser.

## Evaluation notes (flywheel)

- Failure modes observed: Browser caching HSTS.
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null
