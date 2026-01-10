'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Mail, Book, FileText, Github } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="text-center py-6">
        <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">About TaskFlow</h1>
        <p className="text-xl text-gray-400">Simplifying task management for modern teams.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <GlassCard className="space-y-4">
           <h2 className="text-xl font-bold text-white flex items-center gap-2">
             <Book className="text-emerald-400" /> User Guide
           </h2>
           <p className="text-gray-400">
             Learn how to maximize your productivity with TaskFlow. Check out our comprehensive documentation and tutorials.
           </p>
           <Button variant="secondary" className="w-full">Read Documentation</Button>
        </GlassCard>

        <GlassCard className="space-y-4">
           <h2 className="text-xl font-bold text-white flex items-center gap-2">
             <Mail className="text-blue-400" /> Contact Support
           </h2>
           <p className="text-gray-400">
             Need help or have suggestions? Our support team is here to assist you 24/7.
           </p>
           <Button variant="secondary" className="w-full">Contact Us</Button>
        </GlassCard>
      </div>

      <GlassCard>
        <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-white mb-2">Is TaskFlow free to use?</h3>
            <p className="text-gray-400">Yes, TaskFlow offers a generous free tier for individuals and small teams. Premium features are available for enterprise needs.</p>
          </div>
          <div className="border-t border-white/5 pt-4">
            <h3 className="text-lg font-medium text-white mb-2">How secure is my data?</h3>
            <p className="text-gray-400">We use industry-standard encryption and security practices to ensure your data remains safe and private.</p>
          </div>
          <div className="border-t border-white/5 pt-4">
            <h3 className="text-lg font-medium text-white mb-2">Can I export my tasks?</h3>
            <p className="text-gray-400">Yes, you can export your data in various formats including CSV and JSON from the Settings page.</p>
          </div>
        </div>
      </GlassCard>
      
      <div className="flex justify-center gap-6 text-gray-400 mt-12">
        <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
        <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
        <a href="https://github.com/Mueza-Ejaz" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
           <Github className="h-4 w-4" /> Open Source
        </a>
      </div>
      
      <div className="text-center text-sm text-gray-600 mt-4">
        © Crafted with care by Mueza Ejaz 
      </div>
    </div>
  );
}
