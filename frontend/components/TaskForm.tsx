"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Label } from "./ui/label";
import { Calendar, Tag, Type, AlignLeft, Info } from "lucide-react";

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
  status: z.string().optional(),
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
      status: defaultValues?.status || "pending",
    },
  });

  const isEdit = !!defaultValues?.title;

  return (
    <form
      onSubmit={handleSubmit((data) => {
        onSubmit(data);
      })}
      className="space-y-6"
    >
      <div className="space-y-2">
        <Label htmlFor="title" className="flex items-center gap-2 text-white font-bold text-[14px]">
          <Type size={16} className="text-[#00FFD1]" />
          Title
        </Label>
        <Input 
          id="title" 
          {...register("title")} 
          placeholder="Enter task title..."
          className="border-white/20 focus:border-[#00FFD1] text-white !opacity-100"
        />
        {errors.title && (
          <p className="mt-1.5 text-xs font-semibold text-red-400">
            {errors.title.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="flex items-center gap-2 text-white font-bold text-[14px]">
          <AlignLeft size={16} className="text-[#00FFD1]" />
          Description
        </Label>
        <textarea 
          id="description" 
          {...register("description")} 
          placeholder="Add some details about this task..."
          className="flex min-h-[100px] w-full bg-black/60 border border-white/20 text-white placeholder:text-white/40 focus:border-[#00FFD1] focus:ring-2 focus:ring-[#00FFD1]/20 rounded-xl px-4 py-3 text-[15px] transition-all hover:border-white/30 outline-none resize-none !opacity-100"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="priority" className="flex items-center gap-2 text-white font-bold text-[14px]">
            <Tag size={16} className="text-[#00FFD1]" />
            Priority (1–3)
          </Label>
          <select
            id="priority"
            {...register("priority")}
            className="flex h-12 w-full bg-black/60 border border-white/20 text-white focus:border-[#00FFD1] focus:ring-2 focus:ring-[#00FFD1]/20 rounded-xl px-4 text-[15px] transition-all hover:border-white/30 outline-none appearance-none"
          >
            <option value="1" className="bg-gray-900">High</option>
            <option value="2" className="bg-gray-900">Medium</option>
            <option value="3" className="bg-gray-900">Low</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="due_date" className="flex items-center gap-2 text-white font-bold text-[14px]">
            <Calendar size={16} className="text-[#00FFD1]" />
            Due Date
          </Label>
          <Input
            id="due_date"
            type="datetime-local"
            {...register("due_date")}
            disabled={isSubmitting}
            onClick={(e) => {
              // Try to open the picker programmatically on click
              try {
                if ('showPicker' in HTMLInputElement.prototype) {
                  e.currentTarget.showPicker();
                }
              } catch (error) {
                // Ignore errors (e.g. if already open or not supported)
              }
            }}
            onFocus={(e) => {
              // Also try on focus for better accessibility
              try {
                if ('showPicker' in HTMLInputElement.prototype) {
                  e.currentTarget.showPicker();
                }
              } catch (error) {
                // Ignore
              }
            }}
            className="border-white/20 focus:border-[#00FFD1] text-white !opacity-100 dark-calendar cursor-pointer"
          />
        </div>
      </div>

      {isEdit && (
        <div className="space-y-2">
            <Label htmlFor="status" className="flex items-center gap-2 text-white font-bold text-[14px]">
            <Info size={16} className="text-[#00FFD1]" />
            Status
            </Label>
            <select
            id="status"
            {...register("status")}
            className="flex h-12 w-full bg-black/60 border border-white/20 text-white focus:border-[#00FFD1] focus:ring-2 focus:ring-[#00FFD1]/20 rounded-xl px-4 text-[15px] transition-all hover:border-white/30 outline-none appearance-none"
            >
            <option value="pending" className="bg-gray-900">To Do</option>
            <option value="in-progress" className="bg-gray-900">In Progress</option>
            <option value="completed" className="bg-gray-900">Done</option>
            </select>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-6 border-t border-white/10 mt-2">
        {onCancel && (
          <Button 
            type="button" 
            variant="secondary" 
            onClick={onCancel} 
            disabled={isSubmitting}
            className="h-12 px-6 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold transition-all"
          >
            Cancel
          </Button>
        )}
        <Button 
          type="submit" 
          variant="primary" 
          isLoading={isSubmitting}
          className="h-12 px-8 rounded-xl bg-[#00FFD1] text-black font-bold shadow-[0_0_15px_rgba(0,255,209,0.3)] hover:shadow-[0_0_25px_rgba(0,255,209,0.5)] transition-all hover:scale-[1.05] active:scale-[0.98]"
        >
          {defaultValues ? "Update Task" : "Create Task"}
        </Button>
      </div>
    </form>
  );
}