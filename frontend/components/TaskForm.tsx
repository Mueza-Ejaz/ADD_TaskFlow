"use client"

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from './ui/button'; // Assuming shadcn-ui button
import { Input } from './ui/input';   // Assuming shadcn-ui input
import { Label } from './ui/label';   // Assuming shadcn-ui label

// Define the Zod schema for the task form
const TaskFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  priority: z.preprocess(
    (val) => Number(val),
    z.number().min(1).max(5).optional(), // Assuming priority is between 1-5
  ),
  due_date: z.string().optional(), // Make due_date validation less strict for now
});

type TaskFormValues = z.infer<typeof TaskFormSchema>;

interface TaskFormProps {
  onSubmit: (values: TaskFormValues) => void;
  defaultValues?: Partial<TaskFormValues>;
}

export function TaskForm({ onSubmit, defaultValues }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(TaskFormSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit((data) => { console.log('Form submitted with data:', data); onSubmit(data); })} className="space-y-4" role="form">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...register("title")} />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Input id="description" {...register("description")} />
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
      </div>

      <div>
        <Label htmlFor="priority">Priority (1-5)</Label>
        <Input id="priority" type="number" {...register("priority")} />
        {errors.priority && <p className="text-red-500 text-sm">{errors.priority.message}</p>}
      </div>

      <div>
        <Label htmlFor="due_date">Due Date</Label>
        <Input id="due_date" type="datetime-local" {...register("due_date")} />
        {errors.due_date && <p className="text-red-500 text-sm">{errors.due_date.message}</p>}
      </div>

      <Button type="submit">Submit</Button>
    </form>
  );
}
