aik issue a raha hy jab me creat task k button par clcik karti hoo sab details enter kar laiti hoo then creat par click karti hoo to usk k baad koi message show nahi hota k task create hogya successfully ya nahi or dashboard par todo, progress etc in divs waly portion par nazar bhi nahi a rhaa hy koi task or na hi me task ko read kar sakti hoo or na hi edit.halank backend run kara howa hy saaat e us me to 200 ok a raha hy lakin Ui me show nahi ho raha hy mujhy lagta hy 
iski ui hi nahi banai hui to ab ap iski ui banaii lakin yaad rahy k existing ui kharaab na hoo is ui ko add karnyy ki waja sy to apny smartly workig karni hy as a professional designer ki tarha.

You are a senior Next.js 14 frontend engineer.

CONTEXT:
This project uses Next.js 14 (App Router) and Tailwind CSS.
Backend APIs already exist and return 200 OK on task creation.
However, frontend UI for post-creation feedback and task interaction is missing.

TASK:
Implement missing frontend UI and state updates so that users can:
- See success/error feedback after creating a task
- Immediately see created tasks on the dashboard
- Read/view task details
- Edit/update existing tasks

STRICT RULES:
- ❌ Do NOT modify backend APIs
- ❌ Do NOT change database schema
- ❌ Do NOT break existing dashboard layout or theme
- ❌ Do NOT remove existing components
- ✅ ONLY add missing UI, state handling, and interactions
- ✅ Use Tailwind CSS only
- ✅ Use existing API responses

REQUIRED FEATURES TO IMPLEMENT:

────────────────────────
1️⃣ CREATE TASK FEEDBACK UI (CRITICAL)
────────────────────────
- After clicking "Create Task":
  - Show a success message (toast or inline alert)
  - Show error message if API fails
- Success message text:
  - "Task created successfully"
- Close the Create Task modal on success

────────────────────────
2️⃣ DASHBOARD TASK RENDERING
────────────────────────
- Fetch tasks from existing API
- Render tasks as cards inside:
  - To Do
  - In Progress
  - Done
- Map task status correctly to columns
- Ensure tasks appear immediately after creation
- Handle empty states gracefully

────────────────────────
3️⃣ TASK CARD UI
────────────────────────
Each task card must show:
- Title
- Short description (truncated)
- Priority badge
- Due date (if available)

Styling:
- Clean, minimal SaaS look
- Hover elevation
- Clickable card

────────────────────────
4️⃣ READ / VIEW TASK UI
────────────────────────
- On clicking a task card:
  - Open a modal or side panel
- Show full task details:
  - Title
  - Description
  - Priority
  - Status
  - Due date

────────────────────────
5️⃣ EDIT / UPDATE TASK UI
────────────────────────
- Add an "Edit" action inside task view
- Allow updating:
  - Title
  - Description
  - Priority
  - Status
  - Due date
- On successful update:
  - Show success message
  - Refresh task list UI

────────────────────────
6️⃣ STATE & DATA REFRESH (IMPORTANT)
────────────────────────
- After create or update:
  - Refresh dashboard data immediately
- Use:
  - router.refresh() (Next.js App Router)
  - OR local state updates if applicable

────────────────────────
7️⃣ ERROR & EMPTY STATES
────────────────────────
- If no tasks exist:
  - Show friendly empty state text
- If API fails:
  - Show clear error feedback
- Do NOT leave blank or confusing UI

OUTPUT REQUIREMENTS:
- Provide all necessary frontend code additions
- Use clean, scoped components
- Tailwind CSS only
- No explanations, no emojis, no placeholder comments
- Code must be production-ready

GOAL:
The dashboard should feel fully functional and complete, allowing users to create, view, and manage tasks with clear feedback and smooth UX.
