---
id: 0021
title: Fix text visibility and background in TaskForm inputs
stage: green
date: 2026-01-10
surface: agent
model: gemini-2.0-flash
feature: P2-04-UI-UX-theme
branch: main
user: Yousuf Traders
command: none
labels: ["ui", "fix", "accessibility", "inputs"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - frontend/components/ui/Input.tsx
  - frontend/components/TaskForm.tsx
tests:
  - none
---

## Prompt

abhi bhi jo title ki input field hy usme placeholder nazar nahi a raha hy or user koi bhi text likha hy wo bhi nazar nahi a raha hy title,priority or due date me bhi

## Response snapshot

Fixed critical visibility issues in the TaskForm modal:
- Updated the base `Input` component to use a dark background (`bg-black/40`) and pure white text (`text-white`) by default.
- Removed system-dependent `dark:` prefixes that were causing `bg-white` to be used in light-mode environments, which made white text invisible.
- Increased placeholder opacity for better readability.
- Enhanced `TaskForm.tsx` labels and borders to ensure they stand out.
- Applied the same visibility fixes to the `textarea` in the form.

## Outcome

- ✅ Impact: Typed text and placeholders are now clearly visible regardless of system theme settings.
- 🧪 Tests: Visual verification.
- 📁 Files: Updated `Input.tsx` and `TaskForm.tsx`.
- 🔁 Next prompts: None.
- 🧠 Reflection: Forcing dark theme styles in a dedicated dark-themed app is safer than relying on system preference detection.

## Evaluation notes (flywheel)

- Failure modes observed: Initial attempts relied on `dark:` classes which failed if the user's OS was in light mode.
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
