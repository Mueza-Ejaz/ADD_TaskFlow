import React from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowDownUp } from 'lucide-react'; // Assuming lucide-react is available for icons

interface TaskFiltersProps {
  currentFilters: {
    priority: string;
    status: string;
    search: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };
  onFilterChange: (newFilters: {
    priority?: string;
    status?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({ currentFilters, onFilterChange }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ search: e.target.value });
  };

  const handlePriorityChange = (value: string) => {
    onFilterChange({ priority: value === 'all' ? '' : value });
  };

  const handleStatusChange = (value: string) => {
    onFilterChange({ status: value === 'all' ? '' : value });
  };

  const handleSortByChange = (value: string) => {
    onFilterChange({ sortBy: value === 'none' ? '' : value });
  };

  const handleSortOrderToggle = () => {
    onFilterChange({ sortOrder: currentFilters.sortOrder === 'asc' ? 'desc' : 'asc' });
  };

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
      {/* Search Input */}
      <div className="min-w-[200px] flex-1">
        <Input
          id="search"
          type="text"
          placeholder="Search tasks..."
          value={currentFilters.search}
          onChange={handleInputChange}
          className="bg-black/20 border-white/10 text-white placeholder:text-gray-500"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Priority Filter */}
        <Select value={currentFilters.priority || 'all'} onValueChange={handlePriorityChange}>
          <SelectTrigger className="w-[140px] bg-black/20 border-white/10">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="1">High</SelectItem>
            <SelectItem value="2">Medium</SelectItem>
            <SelectItem value="3">Low</SelectItem>
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select value={currentFilters.status || 'all'} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[140px] bg-black/20 border-white/10">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort By */}
        <Select value={currentFilters.sortBy || 'none'} onValueChange={handleSortByChange}>
          <SelectTrigger className="w-[140px] bg-black/20 border-white/10">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Sort by</SelectItem>
            <SelectItem value="due_date">Due Date</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="title">Title</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort Order Toggle */}
        <Button
          variant="secondary"
          size="icon"
          onClick={handleSortOrderToggle}
          aria-label="Sort Order"
          className="bg-black/20 border-white/10"
        >
          <ArrowDownUp className={`h-4 w-4 transition-transform duration-200 ${currentFilters.sortOrder === 'desc' ? 'rotate-180' : ''}`} />
        </Button>
      </div>
    </div>
  );
};
