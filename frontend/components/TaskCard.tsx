import React from 'react';
import { Card } from './ui/Card'; // Simple Card component
import { Button } from './ui/Button'; // Import Button component
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion'; // Import motion
import { fadeAnimation, scaleAnimation } from '@/lib/animations'; // Import animations

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
  onDeleteTask: (taskId: number) => void; // Add onDeleteTask prop
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
  onDeleteTask, // Destructure onDeleteTask
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const formattedDueDate = due_date ? new Date(due_date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }) : null;

  return (
    <motion.div
      layout // Enable layout animations
      initial="initial"
      animate="animate"
      exit="exit"
      variants={fadeAnimation}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    >
      <Card
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="mb-3 cursor-grab"
      >
        <div className="pb-4 border-b border-gray-200 mb-4">
          <h3 className="font-semibold text-lg mb-1">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
        <div className="pt-4">
          <p><strong>Status:</strong> {status}</p>
          {priority && <p><strong>Priority:</strong> {priority}</p>}
          {formattedDueDate && <p><strong>Due Date:</strong> {formattedDueDate}</p>}
          <div className="flex space-x-2 mt-2">
            <Button
              onClick={() => onEditTask({ id, title, description, priority, due_date, status, user_id, created_at, updated_at })}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-sm"
              aria-label={`Edit task: ${title}`}
            >
              Edit
            </Button>
            <Button
              onClick={() => onDeleteTask(id)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
              aria-label={`Delete task: ${title}`}
            >
              Delete
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

