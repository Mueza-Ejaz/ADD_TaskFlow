import React, { useState } from 'react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy, // Use horizontal for columns if columns are sortable
  verticalListSortingStrategy, // Use vertical for tasks within a column
} from '@dnd-kit/sortable';
import { TaskList } from './TaskList';
import { useUpdateTask } from '@/hooks/useTasks'; // Import useUpdateTask

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

interface TaskKanbanProps {
  initialTasks: TaskRead[];
  onEditTask: (task: TaskRead) => void;
  onDeleteTask: (taskId: number) => void; // Add onDeleteTask prop
}

export const TaskKanban: React.FC<TaskKanbanProps> = ({ initialTasks, onEditTask, onDeleteTask }) => {
  const [tasks, setTasks] = useState<TaskRead[]>(initialTasks);
  const updateTaskMutation = useUpdateTask();

  // Define the order and titles of your Kanban columns
  const kanbanColumns = [
    { status: "todo", title: "To Do" },
    { status: "in_progress", title: "In Progress" },
    { status: "done", title: "Done" },
  ];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findColumn = (id: string | number) => {
    if (kanbanColumns.find(col => col.status === id)) {
      return kanbanColumns.find(col => col.status === id);
    }
    const task = tasks.find(t => t.id === id);
    if (task) {
      return kanbanColumns.find(col => col.status === task.status);
    }
    return undefined;
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      const activeTask = tasks.find(t => t.id === active.id);
      const overColumn = kanbanColumns.find(col => col.status === over.id);

      if (activeTask && overColumn && activeTask.status !== overColumn.status) {
        // Task dragged to a different column (status change)
        const updatedTask = { ...activeTask, status: overColumn.status };
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
        );
        await updateTaskMutation.mutateAsync(updatedTask);
      } else {
        // Handle reordering within a column if needed (not explicitly requested yet)
        // For now, we'll just re-set tasks to trigger a re-render if necessary
        setTasks((prevTasks) => [...prevTasks]);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div className="flex space-x-4 overflow-x-auto p-4">
        {kanbanColumns.map(column => (
          <SortableContext
            key={column.status}
            items={tasks.filter(task => task.status === column.status).map(task => task.id)}
            strategy={verticalListSortingStrategy}
          >
            <TaskList
              id={column.status} // Pass ID for droppable context
              key={column.status}
              title={column.title}
              status={column.status}
              tasks={tasks.filter(task => task.status === column.status)}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask} // Pass onDeleteTask
            />
          </SortableContext>
        ))}
      </div>
    </DndContext>
  );
};
