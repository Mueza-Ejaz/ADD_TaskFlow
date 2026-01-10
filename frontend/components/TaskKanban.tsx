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

  // Aligned with backend status values: pending, in-progress, completed
  const kanbanColumns = [
    { status: "pending", title: "To Do" },
    { status: "in-progress", title: "In Progress" },
    { status: "completed", title: "Done" },
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
    // Try to find if over is a column status
    const overColumn = kanbanColumns.find(col => col.status === over.id);
    
    // If dropped over a column container (empty column case)
    if (activeTask && overColumn && activeTask.status !== overColumn.status) {
        const updatedTask = { ...activeTask, status: overColumn.status as string };
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
        );
        await updateTaskMutation.mutateAsync({ id: updatedTask.id, status: updatedTask.status });
        return;
    }

    // If dropped over another task
    if (active.id !== over.id) {
       const overTask = tasks.find(t => t.id === over.id);
       if (overTask && activeTask && activeTask.status !== overTask.status) {
           // Moved to different column by dropping on a task
           const updatedTask = { ...activeTask, status: overTask.status };
           setTasks((prevTasks) =>
            prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
          );
          await updateTaskMutation.mutateAsync({ id: updatedTask.id, status: updatedTask.status });
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
      {typeof document !== 'undefined' && createPortal(
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