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

  const columnTasks = tasks.filter(task => task.status === status);

  const getStatusColor = () => {
    switch (status) {
      case 'todo': return 'bg-white/40';
      case 'in_progress': return 'bg-[#00FFD1]';
      case 'done': return 'bg-green-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        "flex h-fit min-h-[150px] max-h-[70vh] w-80 flex-shrink-0 flex-col rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-all duration-300 shadow-xl",
        isOver && "bg-white/10 border-[#00FFD1]/30 ring-4 ring-[#00FFD1]/5 shadow-2xl shadow-[#00FFD1]/10 scale-[1.01]"
      )}
    >
      <div className="mb-5 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className={clsx("h-2 w-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]", getStatusColor())} />
          <h3 className="font-bold text-white tracking-wide uppercase text-[11px] opacity-70">{title}</h3>
        </div>
        <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-lg bg-white/10 px-2 text-[10px] font-bold text-white/80 border border-white/10">
          {columnTasks.length}
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto px-1 -mx-1 custom-scrollbar">
        <div className="space-y-4 min-h-[50px]">
          <AnimatePresence mode="popLayout">
            {columnTasks.length > 0 ? (
              columnTasks.map((task) => (
                <TaskCard 
                  key={task.id} 
                  {...task} 
                  onEditTask={onEditTask} 
                  onDeleteTask={onDeleteTask} 
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 px-4 border-2 border-dashed border-white/5 rounded-xl bg-white/[0.02]">
                <p className="text-sm font-medium text-white/40 text-center">No tasks yet</p>
                <p className="text-[11px] text-white/20 text-center mt-1">Tasks in progress will appear here</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};