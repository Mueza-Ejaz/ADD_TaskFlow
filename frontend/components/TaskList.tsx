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
      case 'pending': return 'bg-white/40';
      case 'in-progress': return 'bg-[#00FFD1]';
      case 'completed': return 'bg-green-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        "flex h-full w-[350px] flex-shrink-0 flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl transition-all duration-300 shadow-2xl",
        isOver && "bg-white/10 border-[#00FFD1]/30 ring-4 ring-[#00FFD1]/5 shadow-2xl shadow-[#00FFD1]/10 scale-[1.01]"
      )}
    >
      <div className="mb-6 flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className={clsx("h-3 w-3 rounded-full shadow-[0_0_12px_rgba(0,0,0,0.5)]", getStatusColor())} />
          <h3 className="font-black text-white tracking-widest uppercase text-[13px] opacity-90">{title}</h3>
        </div>
        <span className="flex h-7 min-w-[1.75rem] items-center justify-center rounded-xl bg-white/10 px-2.5 text-[12px] font-black text-white border border-white/10 shadow-lg">
          {columnTasks.length}
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto px-1 -mx-1 custom-scrollbar">
        <div className="space-y-5 min-h-full">
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
              <div className="flex flex-col items-center justify-center py-20 px-4 border-2 border-dashed border-white/5 rounded-[2rem] bg-white/[0.01] h-full min-h-[250px]">
                <p className="text-[17px] font-bold text-white/20 text-center">Empty Column</p>
                <p className="text-[13px] text-white/10 text-center mt-3 font-semibold uppercase tracking-tighter">Ready for new tasks</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};