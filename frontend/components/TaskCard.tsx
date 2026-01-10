import React from 'react';
import { GlassCard } from './ui/GlassCard';
import { Button } from './ui/Button';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { fadeAnimation } from '@/lib/animations';
import { Calendar, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

interface TaskRead {
  id: number;
  title: string;
  description?: string;
  priority?: number;
  due_date?: string;
  status: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

interface TaskCardProps extends TaskRead {
  onEditTask: (task: TaskRead) => void;
  onDeleteTask: (taskId: number) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  id,
  title,
  description,
  priority,
  due_date,
  status,
  user_id,
  created_at,
  updated_at,
  onEditTask,
  onDeleteTask,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const formattedDueDate = due_date ? new Date(due_date).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  }) : null;

  const priorityColor = 
    priority === 3 ? 'border-red-500/50' : 
    priority === 2 ? 'border-yellow-500/50' : 
    'border-white/10';

  return (
    <motion.div
      layout
      variants={fadeAnimation}
      initial="initial"
      animate="animate"
      exit="exit"
      style={style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="touch-none"
    >
      <div 
        className={clsx(
          "group relative mb-3 rounded-xl border bg-white/5 p-4 backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1",
          priorityColor,
          isDragging && "ring-2 ring-emerald-500/50 scale-105 rotate-2"
        )}
      >
        <div className="mb-2">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-white">{title}</h3>
            {priority && priority > 1 && (
               <span className={clsx(
                 "flex h-2 w-2 rounded-full",
                 priority === 3 ? "bg-red-500" : "bg-yellow-500"
               )} />
            )}
          </div>
          {description && (
            <p className="mt-1 line-clamp-2 text-sm text-gray-400">{description}</p>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            {formattedDueDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formattedDueDate}</span>
              </div>
            )}
          </div>
          
          <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100 sm:opacity-100">
            <Button
              onClick={() => onEditTask({ id, title, description, priority, due_date, status, user_id, created_at, updated_at })}
              variant="secondary"
              size="sm"
              className="h-7 px-2 text-xs"
            >
              Edit
            </Button>
            <Button
              onClick={() => onDeleteTask(id)}
              variant="destructive"
              size="sm"
              className="h-7 px-2 text-xs"
            >
              Del
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};