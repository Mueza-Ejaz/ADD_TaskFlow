import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { TaskCard } from './TaskCard';
import clsx from 'clsx';
import { AnimatePresence } from 'framer-motion';

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

interface TaskListProps {
  id: string;
  title: string;
  tasks: TaskRead[];
  status: string;
  onEditTask: (task: TaskRead) => void;
  onDeleteTask: (taskId: number) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ id, title, tasks, status, onEditTask, onDeleteTask }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        "flex h-full w-80 flex-shrink-0 flex-col rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-all duration-300",
        isOver && "bg-white/10 border-emerald-500/30 ring-4 ring-emerald-500/5 shadow-2xl shadow-emerald-500/10"
      )}
    >
      <div className="mb-4 flex items-center justify-between px-1">
        <h3 className="font-semibold text-gray-200">{title}</h3>
        <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-white/10 px-1.5 text-xs text-gray-400">
          {tasks.filter(task => task.status === status).length}
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto px-1 -mx-1 custom-scrollbar">
        <div className="space-y-3 min-h-[100px]">
          <AnimatePresence mode="popLayout">
            {tasks
              .filter(task => task.status === status)
              .map((task) => (
                <TaskCard 
                  key={task.id} 
                  {...task} 
                  onEditTask={onEditTask} 
                  onDeleteTask={onDeleteTask} 
                />
              ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};