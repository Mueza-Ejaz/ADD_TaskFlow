---
id: 7
title: Replace Browser Confirm with Custom Dark Modal
stage: general
date_iso: 2026-01-18
surface: agent
model: gemini-2.0-flash
feature: none
branch: main
user: current-user
command: none
labels: ["ui-improvement", "ux", "modal", "dark-theme"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml: |
  - frontend/components/chatbot/ConversationHistory.tsx
tests_yaml: |
  - none
---

# Prompt History Record (PHR)

## Prompt Text
acha ab me conversation is tab ko delete karti hoo to opar aik white box me text show hota hy... wahan pass me hi message show ho naaaa url k pass aik box me message q show ho rhaa hy... Are you sure you want to delete this conversation?

## Response Text
I have replaced the browser's native `confirm()` dialog with a custom dark-themed `ConfirmationModal`. This ensures the UI remains consistent with the dark theme and glassmorphism style, providing a much better user experience compared to the default white browser box.
