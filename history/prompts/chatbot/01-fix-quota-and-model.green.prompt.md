---
id: 1
title: Fix Chatbot Quota and Model Name
stage: green
date_iso: 2026-01-20
surface: agent
model: gemini-1.5-flash
feature: chatbot
branch: main
user: Yousuf Traders
command: none
labels: ["chatbot", "gemini", "quota", "bug-fix"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - backend/src/services/agent_service.py
  - backend/src/services/official_agent_service.py
tests_yaml:
  - none
---

### PROMPT_TEXT
mery chatbot me quota exceeded dy rhaa hy phely mera chatbot chal rhaa tha mainy new key bhi update ki hy ye issue q a rhaa hy mujhy lagta hy code e koi issue hy jis waja sy aisa kar raha hy jab k phely answer kar raha tha

### RESPONSE_TEXT
آپ کے چیٹ بوٹ میں "quota exceeded" کا مسئلہ آنے کی دو بڑی وجوہات تھیں جنہیں میں نے ٹھیک کر دیا ہے:

1. **غلط ماڈل کا نام (Invalid Model Name):** کوڈ میں ماڈل کا نام `gemini-2.5-flash` لکھا ہوا تھا، جبکہ حقیقت میں ایسا کوئی ماڈل نہیں ہے۔ میں نے اسے درست کر کے `gemini-1.5-flash` کر دیا ہے، جو کہ ایک مستحکم (stable) اور تیز ماڈل ہے۔
2. **غیر ضروری API کالز (API Call Optimization):** پہلے ہر ٹول کال (tool call) کے لیے علیحدہ پیغام بھیجا جا رہا تھا، جس کی وجہ سے آپ کا کوٹہ (quota) جلدی ختم ہو رہا تھا۔ اب میں نے کوڈ کو ری فیکٹر (refactor) کر دیا ہے تاکہ تمام ٹول رزلٹس ایک ہی بار میں بھیجے جائیں، جس سے API کالز کم ہوں گی۔

**اگلے اقدامات (Next Steps):**
*   **بیک اینڈ سرور ری سٹارٹ کریں:** چونکہ آپ نے نئی API کی (Key) ڈالی ہے، اس لیے تبدیلیاں لاگو کرنے کے لیے بیک اینڈ سرور کو بند کر کے دوبارہ چلائیں۔
*   **Free Tier کی حدود:** اگر آپ گوگل کا فری ورژن استعمال کر رہے ہیں، تو اس کی روزانہ اور فی منٹ کی کچھ حدود ہوتی ہیں۔ اگر بہت زیادہ میسجز بھیجے جائیں تو یہ ایرر آ سکتا ہے۔

اب آپ چیک کریں، امید ہے کہ یہ بہتر چلے گا۔

### OUTCOME
- Fixed invalid model name 'gemini-2.5-flash' to 'gemini-1.5-flash' in `agent_service.py` and `official_agent_service.py`.
- Optimized tool call handling in both services to send all tool results in a single message turn instead of multiple sequential messages.
- Updated error message checks to match the new model name.
