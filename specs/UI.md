You are a senior Next.js 14 frontend engineer. Your task is to IMPLEMENT a landing page UI that visually matches the following description EXACTLY. Do not simplify the UI. Do not guess styles. Follow every instruction literally. This UI must NOT look plain or flat.

Use Next.js 14 App Router and Tailwind CSS ONLY. No external UI libraries. No inline CSS. No CSS files.

The landing page must visually look like a modern SaaS landing screen with a dark black background, green/teal glow effects, and a centered glassmorphism card.

PAGE LAYOUT:
The root page must take full viewport height using min-h-screen. The entire page must be a flex container that centers content both vertically and horizontally. The background must be fixed and must not scroll.

BACKGROUND:
Set the base background color to pure black (#000000). Add two large abstract gradient glow shapes using absolutely positioned divs.
Glow 1: Positioned bottom-left, size approx w-[500px] h-[500px], background gradient from emerald-400 to teal-500, opacity around 25%, heavily blurred using blur-2xl.
Glow 2: Positioned top-right, size approx w-[400px] h-[400px], background gradient from teal-400 to emerald-500, opacity around 20%, heavily blurred using blur-2xl.
These glow divs must sit behind the main card using negative z-index or relative layering.

CENTER CARD (MOST IMPORTANT):
Create ONE centered glassmorphism card.
Width: max-w-lg on desktop, w-[90%] on mobile.
Background: bg-white/10.
Backdrop blur: backdrop-blur-xl.
Border: border border-white/20.
Rounded corners: rounded-2xl.
Shadow: shadow-2xl with soft spread.
Padding: px-10 py-10.
The card must look translucent and premium, not flat or solid.

CARD CONTENT ALIGNMENT:
All content inside the card must be vertically stacked and center aligned.

ICON:
At the top of the card, place a square outline icon with a checkmark inside.
Do NOT use any icon library.
Create it manually using a bordered square div and an SVG checkmark.
Icon size: h-12 w-12.
Border color: emerald-400.
Checkmark color: emerald-400.
Margin bottom: mb-6.

TITLE:
Text must be exactly: "Todo App".
Font size: text-3xl.
Font weight: font-bold.
Color: text-white.
Letter spacing: tracking-wide.
Margin bottom: mb-3.

DESCRIPTION:
Text must be exactly:
"Organize your tasks efficiently and boost your productivity.
Simple, powerful, and beautifully designed task management."
Color: text-gray-300.
Font size: text-sm.
Line height: leading-relaxed.
Text align: center.
Max width: max-w-sm.
Margin bottom: mb-8.

BUTTON CONTAINER:
Buttons must be in a single row.
Use flex with gap-4.
Buttons must stretch equally using flex-1.

LOGIN BUTTON (PRIMARY):
Text: Login.
Height: h-11.
Background color: bg-emerald-400 (bright green).
Text color: text-black.
Font weight: font-semibold.
Rounded corners: rounded-md.
Hover effects: hover:bg-emerald-300 AND hover:shadow-lg.
Transition: transition-all duration-200 ease-in-out.
This button MUST visually stand out more than Sign Up.

SIGN UP BUTTON (SECONDARY):
Text: Sign Up.
Height: h-11.
Background color: bg-gray-700.
Text color: text-white.
Font weight: font-medium.
Rounded corners: rounded-md.
Hover effect: hover:bg-gray-600.
Transition: transition-all duration-200 ease-in-out.

NAVIGATION:
Use useRouter from next/navigation.
On Login button click, navigate to /login.
On Sign Up button click, navigate to /signup.
Do NOT reload the page.

LOGIN PAGE:
Create /login/page.tsx.
Use the SAME background and glow components as landing page.
Center a glass card similar to landing page but smaller.
Title text: "Login".
Include Email input and Password input.
Inputs must have bg-black/40, border border-white/20, text-white, rounded-md, px-4 py-2.
Login button must use emerald color and match landing button style.

SIGNUP PAGE:
Create /signup/page.tsx.
Same layout and styling as Login page.
Fields: Name, Email, Password.
Button text: "Create Account".

COMPONENT RULES:
Create BackgroundGlow component for glow effects.
Create LandingCard component for the center card.
Use "use client" where needed.
Use functional components only.
Code must compile without errors.

IMPORTANT FINAL RULE:
The UI must visually look PREMIUM, MODERN, GLASSY, and GLOWING. as like this 
C:\Users\Yousuf Traders\.gemini\ADD_TaskFlow-App\first_image.png

