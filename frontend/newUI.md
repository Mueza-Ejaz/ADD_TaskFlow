You are a senior frontend UI/UX engineer.

TASK:
Improve visibility, hierarchy, and empty-state presentation of the existing dashboard UI WITHOUT changing layout structure, logic, or theme.

ABSOLUTE RULES:
- ❌ Do NOT change routing, components, or data logic
- ❌ Do NOT add new sections or remove existing ones
- ❌ Do NOT change background animation or color palette
- ❌ Do NOT break responsiveness
- ✅ ONLY adjust CSS (spacing, shadows, contrast, font weight, empty states)

SPECIFIC CHANGES REQUIRED:

────────────────────────
1️⃣ SIDEBAR VISIBILITY & DEPTH
────────────────────────
Problem:
- Sidebar blends too much with main page
- Hard to distinguish sidebar from content

Fix:
- Add clear elevation to sidebar:
  - box-shadow: 4px 0 18px rgba(0,0,0,0.6)
- Slight background contrast increase (same color family)
- Keep width unchanged
- Add subtle border on right for clarity

Sidebar items:
- Increase font-weight slightly (500–600)
- Improve hover contrast
- Active item should feel clearly selected

────────────────────────
2️⃣ LOGOUT BUTTON (Bottom Left)
────────────────────────
Problem:
- Logout text is too dim and not noticeable

Fix:
- Increase opacity and font-weight
- Add icon + text alignment consistency
- Default color:
  - rgba(255,255,255,0.75)
- Hover:
  - Soft red accent
  - Background highlight
- Add small divider above logout to separate it from menu

────────────────────────
3️⃣ TOP NAVBAR – PROFILE VISIBILITY
────────────────────────
Problem:
- Profile email & avatar look faint and blend into background

Fix:
- Increase text contrast and font-weight
- Email font-size slightly smaller than name
- Avatar:
  - Add border or glow
  - Make clickable area clearer
- Add subtle hover effect to whole profile block
- Do NOT change navbar height or alignment

────────────────────────
4️⃣ TASK COLUMNS (TO DO / IN PROGRESS / DONE)
────────────────────────
Problems:
- Columns are too tall on initial load
- Empty state looks boring and broken

Fix:
- Reduce min-height
- Set max-height relative to viewport (e.g. 65–70vh)
- Improve internal spacing

EMPTY STATE DESIGN (IMPORTANT):
- When no tasks exist:
  - Show centered placeholder text:
    - "No tasks yet"
    - "Tasks in progress will appear here"
  - Text opacity: 0.45
  - Font-size smaller than headings
  - Optional dashed border or subtle gradient
- Make empty state look intentional, not broken
- Do NOT add loud icons or illustrations

────────────────────────
5️⃣ GENERAL POLISH
────────────────────────
- Use consistent transitions:
  - transition: all 0.2s ease
- No sharp animations
- Keep modern SaaS feel
- Maintain dark theme identity

OUTPUT REQUIREMENTS:
- Output ONLY updated CSS or Tailwind utility classes
- Use safe, scoped selectors
- No explanations, no emojis, no extra text
- Code must be production-ready

GOAL:
Dashboard should feel structured, readable, and alive from first load — even with zero data — while keeping the original design intact.
