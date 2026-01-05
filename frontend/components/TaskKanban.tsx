import React from 'react';
import { TaskList } from './TaskList'; // Assuming TaskList is in the same directory

interface Task {
  id: number;
  title: string;
  description?: string;
  priority?: number;
  due_date?: string;
  status: string;
  // Add any other task properties as needed
}

interface TaskKanbanProps {
  tasks: Task[];
}

export const TaskKanban: React.FC<TaskKanbanProps> = ({ tasks }) => {
  // Define the order and titles of your Kanban columns
  const kanbanColumns = [
    { status: "todo", title: "To Do" },
    { status: "in_progress", title: "In Progress" },
    { status: "done", title: "Done" },
  ];

  return (
    <div className="flex space-x-4 overflow-x-auto p-4">
      {kanbanColumns.map(column => (
        <TaskList
          key={column.status}
          title={column.title}
          status={column.status}
          tasks={tasks.filter(task => task.status === column.status)}
        />
      ))}
    </div>
  );
};
