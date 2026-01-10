'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StatisticsCardProps {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  className?: string;
}

export const StatisticsCard = ({ label, value, icon, trend, trendUp, className }: StatisticsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className={cn(
        "relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">{label}</p>
          <motion.h3 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-2 text-3xl font-bold text-white"
          >
            {value}
          </motion.h3>
        </div>
        {icon && (
          <div className="rounded-lg bg-white/10 p-2 text-emerald-400">
            {icon}
          </div>
        )}
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center gap-1 text-sm">
          <span className={cn(
            "font-medium",
            trendUp ? "text-emerald-400" : "text-red-400"
          )}>
            {trend}
          </span>
          <span className="text-gray-500">vs last month</span>
        </div>
      )}
    </motion.div>
  );
};
