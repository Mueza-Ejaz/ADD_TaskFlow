import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { TaskCard } from './TaskCard'; // Assuming TaskCard is in the same directory
import clsx from 'clsx'; // Import clsx for conditional class names
import { AnimatePresence } from 'framer-motion'; // Import AnimatePresence

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
  id: string; // Add id for droppable
  title: string;
  tasks: TaskRead[];
  status: string; // The status this column represents
  onEditTask: (task: TaskRead) => void;
  onDeleteTask: (taskId: number) => void; // Add onDeleteTask prop
}

export const TaskList: React.FC<TaskListProps> = ({ id, title, tasks, status, onEditTask, onDeleteTask }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        "bg-gray-200 p-4 rounded-lg shadow-md w-80 flex-shrink-0",
        isOver && "bg-blue-100" // Visual indicator when dragging over
      )}
    >
      <h3 className="text-lg font-semibold mb-4 border-b pb-2">{title} ({tasks.length})</h3>
      <div className="space-y-3">
        <AnimatePresence>
          {tasks.filter(task => task.status === status).map((task) => (
            <TaskCard key={task.id} {...task} onEditTask={onEditTask} onDeleteTask={onDeleteTask} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
