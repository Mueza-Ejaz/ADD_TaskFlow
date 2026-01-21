'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { Mail, Lock, ArrowLeft, CheckCircle2 } from "lucide-react";
import ParticleBackground from '@/components/ParticleBackground';
import { useToast } from '@/providers/ToastProvider';

export default function LoginPage() {
  const router = useRouter();
  const { status } = useSession();
  const { showToast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        showToast('Invalid email or password', 'error');
      } else {
        showToast('Successfully logged in!', 'success');
        router.push('/dashboard');
      }
    } catch (error) {
      showToast('An error occurred during login', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#00FFD1] border-t-transparent shadow-[0_0_15px_rgba(0,255,209,0.2)]" />
      </div>
    );
  }

  if (status === 'authenticated') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#00FFD1] border-t-transparent shadow-[0_0_15px_rgba(0,255,209,0.2)] mx-auto mb-4" />
          <p className="text-white">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
      <ParticleBackground />

      <div className="relative z-10 w-full flex flex-col items-center px-6 animate-fadeInUp">
        <div className="w-full max-w-[480px] mb-8">
          <Link href="/" className="back-btn">
            <ArrowLeft size={20} /> Back to Home
          </Link>
        </div>

        <div className="auth-card">
          <div className="text-center mb-8">
            <CheckCircle2 className="mx-auto text-[#00FFD1] mb-3" size={48} />
            <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="auth-label">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="auth-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="auth-label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="auth-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="auth-btn"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent" />
              ) : (
                "Sign In"
              )}
            </button>

            <p className="text-center auth-footer-text pt-4">
              No account?{" "}
              <Link href="/signup" className="auth-link">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}