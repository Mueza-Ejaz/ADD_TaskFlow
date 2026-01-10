'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import BackgroundGlow from '../../components/BackgroundGlow';
import { useToast } from '@/providers/ToastProvider';

export default function SignupPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { showToast } = useToast();
  
  const [name, setName] = useState('');
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          full_name: name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(data.detail || 'Signup failed', 'error');
        setIsLoading(false);
        return;
      }

      showToast('Account created successfully!', 'success');
      
      // Auto-login after successful signup
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        showToast('Signup successful, but auto-login failed. Please login manually.', 'warning');
        router.push('/login');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      showToast('An error occurred during signup', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || status === 'authenticated') {
    return null; // Or a loading spinner
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center overflow-hidden">
      <BackgroundGlow />
      
      <div className="relative z-10 w-[90%] max-w-md rounded-2xl border border-white/20 bg-white/10 px-8 py-10 shadow-2xl backdrop-blur-lg">
        <h1 className="mb-6 text-center text-3xl font-bold text-white">Sign Up</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="name" className="sr-only">Name</label>
            <input
              type="text"
              id="name"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 w-full rounded-md border border-white/20 bg-black/40 px-4 text-white placeholder-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 w-full rounded-md border border-white/20 bg-black/40 px-4 text-white placeholder-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
              required
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 w-full rounded-md border border-white/20 bg-black/40 px-4 text-white placeholder-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`mt-2 h-11 w-full rounded-md bg-emerald-400 font-semibold text-black transition-all duration-200 hover:bg-emerald-300 hover:shadow-lg flex items-center justify-center ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <button 
            onClick={() => router.push('/login')}
            className="font-medium text-emerald-400 hover:text-emerald-300 hover:underline"
            disabled={isLoading}
          >
            Login
          </button>
        </div>
      </div>
    </main>
  );
}

