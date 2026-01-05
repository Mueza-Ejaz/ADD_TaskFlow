import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card'; // Assuming shadcn-ui card components

interface TaskCardProps {
  id: number;
  title: string;
  description?: string;
  priority?: number;
  due_date?: string;
  status: string;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  id,
  title,
  description,
  priority,
  due_date,
  status,
}) => {
  return (
    <Card className="mb-3 cursor-grab">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p><strong>Status:</strong> {status}</p>
        {priority && <p><strong>Priority:</strong> {priority}</p>}
        {due_date && <p><strong>Due Date:</strong> {new Date(due_date).toLocaleDateString()}</p>}
      </CardContent>
    </Card>
  );
};
