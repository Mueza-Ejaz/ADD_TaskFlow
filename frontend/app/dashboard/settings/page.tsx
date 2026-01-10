'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Moon, Bell, Shield, Smartphone, Globe, LogOut } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-sm text-gray-500">Manage your account preferences</p>
      </div>

      {/* Account Settings */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-300">Account</h2>
        <GlassCard className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-emerald-500/10 p-3 text-emerald-400">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium text-white">Password & Security</p>
                <p className="text-sm text-gray-400">Manage your password and 2FA</p>
              </div>
            </div>
            <Button variant="secondary">Update</Button>
          </div>
          
          <div className="flex items-center justify-between border-t border-white/5 pt-6">
             <div className="flex items-center gap-4">
              <div className="rounded-full bg-red-500/10 p-3 text-red-400">
                <LogOut className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium text-white text-red-400">Delete Account</p>
                <p className="text-sm text-gray-400">Permanently remove your account and data</p>
              </div>
            </div>
            <Button variant="destructive">Delete</Button>
          </div>
        </GlassCard>
      </section>

      {/* Preferences */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-300">Preferences</h2>
        <GlassCard className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-purple-500/10 p-3 text-purple-400">
                <Moon className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium text-white">Appearance</p>
                <p className="text-sm text-gray-400">Customize theme (Dark mode forced)</p>
              </div>
            </div>
             {/* Toggle Placeholder */}
             <div className="h-6 w-11 rounded-full bg-emerald-500 relative">
                <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm" />
             </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/5 pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-blue-500/10 p-3 text-blue-400">
                <Globe className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium text-white">Language</p>
                <p className="text-sm text-gray-400">English (US)</p>
              </div>
            </div>
            <Button variant="secondary">Change</Button>
          </div>

          <div className="flex items-center justify-between border-t border-white/5 pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-yellow-500/10 p-3 text-yellow-400">
                <Bell className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium text-white">Notifications</p>
                <p className="text-sm text-gray-400">Configure email and push notifications</p>
              </div>
            </div>
            <Button variant="secondary">Configure</Button>
          </div>
        </GlassCard>
      </section>

      {/* Devices */}
       <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-300">Sessions</h2>
        <GlassCard>
           <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-gray-500/10 p-3 text-gray-400">
                <Smartphone className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium text-white">Windows PC - Chrome</p>
                <p className="text-sm text-emerald-400">Active now • New York, USA</p>
              </div>
            </div>
          </div>
        </GlassCard>
       </section>
    </div>
  );
}
