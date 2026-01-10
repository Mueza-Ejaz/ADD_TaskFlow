import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  defaultDropAnimationSideEffects,
  DropAnimation,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { TaskList } from './TaskList';
import { TaskCard } from './TaskCard';
import { useUpdateTask } from '@/hooks/useTasks';
import { createPortal } from 'react-dom';

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
  onDeleteTask: (taskId: number) => void;
}

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  }),
};

export const TaskKanban: React.FC<TaskKanbanProps> = ({ initialTasks, onEditTask, onDeleteTask }) => {
  const [tasks, setTasks] = useState<TaskRead[]>(initialTasks);
  const [activeId, setActiveId] = useState<number | null>(null);
  const updateTaskMutation = useUpdateTask();

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const kanbanColumns = [
    { status: "todo", title: "To Do" },
    { status: "in_progress", title: "In Progress" },
    { status: "done", title: "Done" },
  ];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as number);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeTask = tasks.find(t => t.id === active.id);
    const overColumn = kanbanColumns.find(col => col.status === over.id);
    
    // If dropped over a column container (empty column case)
    if (activeTask && overColumn && activeTask.status !== overColumn.status) {
        const updatedTask = { ...activeTask, status: overColumn.status };
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
        );
        await updateTaskMutation.mutateAsync(updatedTask);
        return;
    }

    // If dropped over another task
    if (active.id !== over.id) {
       // Logic for reordering within column or moving to another column via task drop
       // Check if over is a task
       const overTask = tasks.find(t => t.id === over.id);
       if (overTask && activeTask && activeTask.status !== overTask.status) {
           // Moved to different column by dropping on a task
           const updatedTask = { ...activeTask, status: overTask.status };
           setTasks((prevTasks) =>
            prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
          );
          await updateTaskMutation.mutateAsync(updatedTask);
       }
    }
  };

  const activeTask = activeId ? tasks.find(t => t.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full gap-6 overflow-x-auto pb-4">
        {kanbanColumns.map(column => (
          <SortableContext
            key={column.status}
            items={tasks.filter(task => task.status === column.status).map(task => task.id)}
            strategy={verticalListSortingStrategy}
          >
            <TaskList
              id={column.status}
              title={column.title}
              status={column.status}
              tasks={tasks}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
            />
          </SortableContext>
        ))}
      </div>
      {createPortal(
        <DragOverlay dropAnimation={dropAnimation}>
          {activeTask ? (
             <TaskCard
               {...activeTask}
               onEditTask={onEditTask}
               onDeleteTask={onDeleteTask}
             />
          ) : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
};