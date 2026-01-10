'use client';

import React from 'react';
import Link from 'next/link';
import AnimatedBackground from '../components/AnimatedBackground';

export default function LandingPage() {
  // A clean, modern checkmark logo URL (Placeholder from the internet)
  const logoUrl = "https://cdn-icons-png.flaticon.com/512/5290/5290058.png";

  return (
    <div className="landing-container">
      {/* Animated background canvas */}
      <AnimatedBackground />

      <main className="relative z-10 w-full flex items-center justify-center p-4">
        <div className="glass-card">
          {/* Logo at Top */}
          <div className="flex justify-center mb-6">
            <img 
              src={logoUrl} 
              alt="TodoFlow Logo" 
              className="hero-logo" 
              style={{ filter: 'invert(80%) sepia(80%) saturate(500%) hue-rotate(130deg)' }} 
            />
          </div>

          {/* One line hero title */}
          <h1 className="hero-title">
            Organize your life, <span className="title-accent">one task at a time</span>
          </h1>
          
          {/* Optional description (from ui.md text) */}
          <p className="hero-description">
            Manage your tasks effortlessly with TodoFlow — the sleek, modern way to stay productive.
          </p>

          {/* Two buttons: Start (primary) and Login (secondary) */}
          <div className="cta-buttons">
            <Link href="/signup" className="btn-primary">
              Start
            </Link>
            <Link href="/login" className="btn-secondary">
              Login
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
