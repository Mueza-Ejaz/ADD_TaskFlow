---
id: 5
title: Fix Viewport Layout to Eliminate Scrollbars
stage: general
date_iso: 2026-01-18
surface: agent
model: gemini-2.0-flash
feature: none
branch: main
user: current-user
command: none
labels: ["layout-fix", "viewport", "scrolling"]
links:
  spec: "frontend/UI.md"
  ticket: null
  adr: null
  pr: null
files_yaml: |
  - frontend/app/dashboard/layout.tsx
  - frontend/app/dashboard/chatbot/page.tsx
  - frontend/components/chatbot/WelcomeScreen.tsx
  - frontend/components/layout/Header.tsx
tests_yaml: |
  - none
---

# Prompt History Record (PHR)

## Prompt Text
thorra or isy sahi akry qk abhi bhi scroll bar a rha ahy

## Response Text
I have overhauled the layout to eliminate the scrollbar. Changes include setting the dashboard to a fixed h-screen with overflow-hidden, optimizing the header size, and making the WelcomeScreen even more compact. The app is now locked to the viewport, and only the message area will scroll.
