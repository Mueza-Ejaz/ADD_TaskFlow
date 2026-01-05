import React from 'react';
import { TaskCard } from './TaskCard'; // Assuming TaskCard is in the same directory

interface Task {
  id: number;
  title: string;
  description?: string;
  priority?: number;
  due_date?: string;
  status: string;
  // Add any other task properties as needed
}

interface TaskListProps {
  title: string;
  tasks: Task[];
  status: string; // The status this column represents
}

export const TaskList: React.FC<TaskListProps> = ({ title, tasks, status }) => {
  return (
    <div className="bg-gray-200 p-4 rounded-lg shadow-md w-80 flex-shrink-0">
      <h3 className="text-lg font-semibold mb-4 border-b pb-2">{title} ({tasks.length})</h3>
      <div className="space-y-3">
        {tasks.filter(task => task.status === status).map((task) => (
          <TaskCard key={task.id} {...task} />
        ))}
      </div>
    </div>
  );
};
