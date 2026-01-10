'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatisticsCard } from '@/components/ui/StatisticsCard';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { CheckCircle, Clock, Star, Edit, User as UserIcon, Mail } from 'lucide-react';
import { useToast } from '@/providers/ToastProvider';
import { motion, useSpring, useTransform, animate } from 'framer-motion';

function Counter({ value }: { value: number }) {
  const count = useSpring(0, { stiffness: 100, damping: 30 });
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    count.set(value);
  }, [value, count]);

  return <motion.span>{rounded}</motion.span>;
}

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const { showToast } = useToast();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [name, setName] = useState(session?.user?.name || '');
  const [email, setEmail] = useState(session?.user?.email || '');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '');
      setEmail(session.user.email || '');
    }
  }, [session]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      // Mock update - In a real app, you'd call an API here
      // const res = await fetch('/api/user/update', { ... })
      
      // Update the session client-side
      await update({
        ...session,
        user: {
          ...session?.user,
          name: name,
          email: email,
        },
      });

      showToast('Profile updated successfully!', 'success');
      setIsEditModalOpen(false);
    } catch (error) {
      showToast('Failed to update profile', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Profile Header */}
      <GlassCard className="flex flex-col md:flex-row items-center gap-8 py-10 px-10">
        <div className="relative">
          <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-emerald-500/20 bg-emerald-500/10 flex items-center justify-center">
            <div className="text-5xl font-bold text-emerald-500">
              {session?.user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
          <motion.div 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsEditModalOpen(true)}
            className="absolute bottom-1 right-1 h-8 w-8 bg-emerald-500 rounded-full flex items-center justify-center cursor-pointer shadow-lg border-2 border-gray-900"
          >
            <Edit className="h-4 w-4 text-black" />
          </motion.div>
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold text-white tracking-tight">{session?.user?.name || 'User Name'}</h1>
            <div className="flex justify-center md:justify-start gap-2">
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-[10px] uppercase tracking-wider font-bold text-emerald-400">Pro Member</span>
            </div>
          </div>
          <p className="text-gray-400 flex items-center justify-center md:justify-start gap-2">
            <Mail className="h-4 w-4 text-gray-500" />
            {session?.user?.email || 'user@example.com'}
          </p>
          <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-3">
            <Button onClick={() => setIsEditModalOpen(true)} variant="secondary" size="sm" className="gap-2 px-6">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
            <Button variant="outline" size="sm" className="gap-2 px-6">
              <Star className="h-4 w-4 text-yellow-500" />
              Upgrade Plan
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Statistics */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatisticsCard
          label="Tasks Completed"
          value={<Counter value={128} />}
          icon={<CheckCircle className="h-6 w-6" />}
          trend="+12%"
          trendUp={true}
        />
        <StatisticsCard
          label="Productivity Score"
          value={<><Counter value={94} />%</>}
          icon={<Star className="h-6 w-6" />}
          trend="+5%"
          trendUp={true}
        />
        <StatisticsCard
          label="Avg. Completion Time"
          value="2.4 days"
          icon={<Clock className="h-6 w-6" />}
          trend="-8%"
          trendUp={true}
        />
      </div>

      {/* Recent Activity */}
      <GlassCard className="p-8">
        <h2 className="mb-6 text-xl font-bold text-white flex items-center gap-2">
          <Clock className="h-5 w-5 text-emerald-400" />
          Recent Activity
        </h2>
        <div className="space-y-6">
          {[
            { action: "Completed \"Design Review\"", project: "UI Overhaul", time: "2 hours ago" },
            { action: "Created \"Implement Auth\"", project: "Backend API", time: "5 hours ago" },
            { action: "Updated \"Task Kanban\"", project: "Frontend Fixes", time: "1 day ago" }
          ].map((activity, i) => (
            <div key={i} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
              <div className="flex items-start gap-4">
                <div className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                <div>
                  <p className="font-medium text-white">{activity.action}</p>
                  <p className="text-sm text-gray-500">Project: {activity.project}</p>
                </div>
              </div>
              <span className="text-sm text-gray-500 whitespace-nowrap">{activity.time}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Edit Profile Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        title="Edit Profile"
      >
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="edit-name" className="text-gray-300">Full Name</Label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="pl-10 bg-black/40 border-white/10 text-white focus:border-emerald-500/50"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-email" className="text-gray-300">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                id="edit-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="pl-10 bg-black/40 border-white/10 text-white focus:border-emerald-500/50"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isUpdating}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

