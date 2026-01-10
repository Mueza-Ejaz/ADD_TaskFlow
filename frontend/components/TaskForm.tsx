"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Label } from "./ui/label";

/* =========================
   ZOD SCHEMA
========================= */
export const TaskFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  priority: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(1).max(5).optional()
  ),
  due_date: z.string().optional(),
});

export type TaskFormValues = z.infer<typeof TaskFormSchema>;

/* =========================
   PROPS
========================= */
interface TaskFormProps {
  onSubmit: (values: TaskFormValues) => void;
  onCancel?: () => void;
  defaultValues?: Partial<TaskFormValues>;
  isSubmitting?: boolean;
}

/* =========================
   COMPONENT
========================= */
export function TaskForm({
  onSubmit,
  onCancel,
  defaultValues,
  isSubmitting = false,
}: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(TaskFormSchema),
    defaultValues: {
      title: defaultValues?.title || "",
      description: defaultValues?.description || "",
      priority: defaultValues?.priority,
      due_date: defaultValues?.due_date ? new Date(defaultValues.due_date).toISOString().slice(0, 16) : "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => {
        onSubmit(data);
      })}
      className="space-y-4"
    >
      <div>
        <Label htmlFor="title" className="text-gray-300">Title</Label>
        <Input 
          id="title" 
          {...register("title")} 
          placeholder="Task title"
          className="bg-black/20 border-white/10 text-white placeholder:text-gray-500"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-400">
            {errors.title.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="description" className="text-gray-300">Description</Label>
        <Input 
          id="description" 
          {...register("description")} 
          placeholder="Task description (optional)"
          className="bg-black/20 border-white/10 text-white placeholder:text-gray-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="priority" className="text-gray-300">Priority (1–5)</Label>
          <Input
            id="priority"
            type="number"
            min="1"
            max="5"
            {...register("priority")}
            placeholder="3"
            className="bg-black/20 border-white/10 text-white placeholder:text-gray-500"
          />
          {errors.priority && (
            <p className="mt-1 text-sm text-red-400">
              {errors.priority.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="due_date" className="text-gray-300">Due Date</Label>
          <Input
            id="due_date"
            type="datetime-local"
            {...register("due_date")}
            className="bg-black/20 border-white/10 text-white"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          {defaultValues ? "Update Task" : "Create Task"}
        </Button>
      </div>
    </form>
  );
}

