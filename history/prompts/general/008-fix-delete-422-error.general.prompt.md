---
id: 8
title: Fix 422 Error on Deleting Local Conversations
stage: general
date_iso: 2026-01-18
surface: agent
model: gemini-2.0-flash
feature: none
branch: main
user: current-user
command: none
labels: ["bug-fix", "422-error", "delete-conversation"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml: |
  - frontend/lib/api/chat.ts
tests_yaml: |
  - none
---

# Prompt History Record (PHR)

## Prompt Text
ab delete kar rahi hoto error a rha ahy ye ===## Error Type Console AxiosError ## Error Message Request failed with status code 422

## Response Text
I have fixed the 422 error occurring when deleting conversations. The issue was caused by sending non-numeric temporary IDs (`conv-...`) to the backend. I added a check in `deleteConversation` to handle these local IDs without making an API call.
