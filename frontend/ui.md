You are a professional UI/UX designer and React + TypeScript expert. 
I want you to create a **Todo App Landing Page** with the following instructions:

1️⃣ Layout & Design:
- Center of page: Logo at top
- One line hero title describing the app
- Two buttons below the title: **Start** (primary) and **Login** (secondary)
- Card containing title + buttons should be **glassmorphism style** (semi-transparent + blurred background + subtle shadow)
- Background of page: animated, dark, cosmic theme (stars + soft glow circles)
- Buttons: neon-style hover effect, subtle animations on hover
- Typography: clean, modern, sans-serif (like Inter), accent color #00FFD1 for highlights
- Responsive: mobile-friendly, buttons stack vertically on small screens

2️⃣ Components:
- **AnimatedBackground**: canvas animation with stars and blurred glowing circles
- **Landing page**: imports AnimatedBackground and shows logo, hero text, buttons

3️⃣ Technology:
- React + TypeScript (TSX)
- CSS for styling (can be inline for simplicity or separate CSS)
- No external frameworks like Tailwind needed
- Fully functional hover effects and animations

4️⃣ Files:
- `/src/components/AnimatedBackground.tsx`
- `/src/pages/Landing.tsx`
- `/src/App.tsx`
- `/src/index.css`
- `/src/assets/logo.png` (just a placeholder)

5️⃣ Behavior:
- Animated stars and floating blurred circles behind the hero card
- Buttons highlight with neon glow on hover
- Hero card floats slightly when hovered
- Page scales correctly on mobile

Please generate **all the TypeScript + CSS code** for these files in one block, 
so I can copy-paste directly into my project and it works without errors. 
Include **file names as comments** above each code block, like:

// File: src/components/AnimatedBackground.tsx
import React, { useEffect, useRef } from 'react';

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Star particles
    const stars: Star[] = [];
    const starCount = 120;

    class Star {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      twinkleSpeed: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.twinkleSpeed = Math.random() * 0.02 + 0.01;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;

        this.opacity += this.twinkleSpeed;
        if (this.opacity > 1 || this.opacity < 0.3) this.twinkleSpeed *= -1;
      }

      draw() {
        ctx.fillStyle = `rgba(0,255,209,${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size*3);
        gradient.addColorStop(0, `rgba(0,255,209,${this.opacity*0.3})`);
        gradient.addColorStop(1, 'rgba(0,255,209,0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size*3, 0, Math.PI*2);
        ctx.fill();
      }
    }

    for (let i = 0; i < starCount; i++) stars.push(new Star());

    // Blur circles
    const blurCircles: BlurCircle[] = [];
    const circleCount = 5;

    class BlurCircle {
      x: number;
      y: number;
      radius: number;
      speedX: number;
      speedY: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 150 + 100;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.color = `rgba(0,255,209,${Math.random()*0.1 + 0.05})`;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width + this.radius) this.x = -this.radius;
        if (this.x < -this.radius) this.x = canvas.width + this.radius;
        if (this.y > canvas.height + this.radius) this.y = -this.radius;
        if (this.y < -this.radius) this.y = canvas.height + this.radius;
      }

      draw() {
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'rgba(0,255,209,0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fill();
      }
    }

    for (let i = 0; i < circleCount; i++) blurCircles.push(new BlurCircle());

    const animate = () => {
      ctx.fillStyle = '#000';
      ctx.fillRect(0,0,canvas.width,canvas.height);

      blurCircles.forEach(c => { c.update(); c.draw(); });
      stars.forEach(s => { s.update(); s.draw(); });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);

  }, []);

  return (
    <canvas ref={canvasRef} style={{ position:'fixed', top:0, left:0, width:'100%', height:'100%', zIndex:0, pointerEvents:'none' }} />
  );
};

export default AnimatedBackground;


// File: src/pages/Landing.tsx
import React from 'react';
import AnimatedBackground from '../components/AnimatedBackground';
import logo from '../assets/logo.png';

const Landing: React.FC = () => {
  return (
    <div className="landing-container">
      <AnimatedBackground />

      <main className="hero-section">
        <div className="hero-content">
          <div className="glass-card">
            <img src={logo} alt="Todo Logo" className="hero-logo" />
            <h1 className="hero-title">
              Organize your life,<br />
              <span className="title-accent">one task at a time</span>
            </h1>
            <p className="hero-description">
              Manage your tasks effortlessly with TodoFlow — the sleek, modern way to stay productive.
            </p>
            <div className="cta-buttons">
              <button className="btn-primary">Start</button>
              <button className="btn-secondary">Login</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;

3️⃣ /src/App.tsx
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";

const App: React.FC = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;

4️⃣ /src/index.css

CSS is same as previous — glassmorphism + buttons + responsive + animations
/* Global Variables */
:root {
  --bg-primary: #000000;
  --text-primary: #FFFFFF;
  --accent-color: #00FFD1;
}

.landing-container {
  min-height: 100vh;
  background: var(--bg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow-x: hidden;
}

.glass-card {
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 24px;
  padding: 60px 40px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.glass-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 48px rgba(0,255,209,0.3);
}

.hero-logo {
  width: 120px;
  margin-bottom: 20px;
}

.hero-title {
  font-size: 48px;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.title-accent {
  color: var(--accent-color);
  text-shadow: 0 0 20px rgba(0,255,209,0.5);
  animation: glow 2s ease-in-out infinite;
}

@keyframes glow {
  0%,100% { text-shadow: 0 0 20px rgba(0,255,209,0.5); }
  50% { text-shadow: 0 0 40px rgba(0,255,209,0.8); }
}

.hero-description {
  font-size: 18px;
  color: rgba(255,255,255,0.85);
  margin-bottom: 32px;
}

.cta-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.btn-primary {
  background: rgba(0,255,209,0.1);
  color: var(--accent-color);
  border: 1px solid var(--accent-color);
  padding: 14px 28px;
  font-size: 18px;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: var(--accent-color);
  color: #000;
  box-shadow: 0 0 20px var(--accent-color);
}

.btn-secondary {
  background: rgba(255,255,255,0.1);
  color: #FFF;
  border: 1px solid #FFF;
  padding: 14px 28px;
  font-size: 18px;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: #FFF;
  color: #000;
  box-shadow: 0 0 20px #FFF;
}

@media (max-width: 768px) {
  .glass-card { padding: 40px 24px; }
  .hero-title { font-size: 32px; }
  .hero-description { font-size: 16px; }
  .cta-buttons { flex-direction: column; }
  .btn-primary, .btn-secondary { width: 100%; }
}
 
ye suggestions di hy kinldy inhy apply kary or phely wali landing page ki ui hatha dy kindly.