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
    (val) => Number(val),
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
  defaultValues?: Partial<TaskFormValues>;
}

/* =========================
   COMPONENT
========================= */
export function TaskForm({
  onSubmit,
  defaultValues,
}: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(TaskFormSchema),
    defaultValues,
  });

  return (
    <div className="relative z-50 w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Create New Task</h2>
        </div>

        <form
          onSubmit={handleSubmit((data) => {
            console.log("Form submitted with data:", data);
            onSubmit(data);
          })}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register("title")} />
            {errors.title && (
              <p className="text-sm text-red-500">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input id="description" {...register("description")} />
          </div>

          <div>
            <Label htmlFor="priority">Priority (1–5)</Label>
            <Input
              id="priority"
              type="number"
              {...register("priority")}
            />
          </div>

          <div>
            <Label htmlFor="due_date">Due Date</Label>
            <Input
              id="due_date"
              type="datetime-local"
              {...register("due_date")}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="secondary">
              Cancel
            </Button>
            <Button type="submit">Create Task</Button>
          </div>
        </form>
      </div>
    );
  }
