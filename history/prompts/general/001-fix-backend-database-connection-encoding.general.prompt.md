---
id: "001"
title: "Fix Backend Database Connection Encoding"
stage: "misc"
date: "2026-01-21"
surface: "agent"
model: "gemini-2.0-flash-exp"
feature: "chatbot-task-integration"
branch: "main"
user: "Yousuf Traders"
command: "fix-db-connection"
labels: ["bugfix", "backend", "configuration", "encoding"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - "backend/src/config.py"
tests:
  - "debug_config.py (manual)"
  - "test_encoding.py (manual)"
outcome: "Resolved environment variable loading issue caused by UTF-8 BOM in .env file."
evaluation: "Backend now correctly connects to Neon DB instead of falling back to SQLite."
---

## Prompt
actually waisy mera data neon me save ho rhaa hy jab ap khud try akrty hoo lakin jab me chatbot sy task add karwati hoto dashabord par to show ho jata hy lakin datbase me neon me nahi o rha hy issue ko identify akry or isko resolve kary jaldi sy

## Response
I identified that the backend was failing to load the `.env` file because of a UTF-8 BOM encoding issue, causing it to fall back to a local `sqlite:///taskflow.db` instead of the Neon database. This explained why tasks appeared in the app (connected to local DB) but not in Neon.

I modified `backend/src/config.py` to explicitly load the `.env` file with `encoding="utf-8-sig"`, ensuring the `DATABASE_URL` is correctly read. Verified the fix with a debug script.
