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
    <div className="flex flex-wrap items-end gap-4 p-4 bg-white rounded-lg shadow-md">
      {/* Search Input */}
      <div className="flex-grow">
        <Label htmlFor="search">Search</Label>
        <Input
          id="search"
          type="text"
          placeholder="Search tasks..."
          value={currentFilters.search}
          onChange={handleInputChange}
          className="w-full"
        />
      </div>

      {/* Priority Filter */}
      <div>
        <Label htmlFor="priority">Priority</Label>
        <Select value={currentFilters.priority} onValueChange={handlePriorityChange}>
          <SelectTrigger id="priority" className="w-[180px]">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="1">High</SelectItem>
            <SelectItem value="2">Medium</SelectItem>
            <SelectItem value="3">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Status Filter */}
      <div>
        <Label htmlFor="status">Status</Label>
        <Select value={currentFilters.status} onValueChange={handleStatusChange}>
          <SelectTrigger id="status" className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sort By */}
      <div>
        <Label htmlFor="sortBy">Sort By</Label>
        <Select value={currentFilters.sortBy} onValueChange={handleSortByChange}>
          <SelectTrigger id="sortBy" className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="due_date">Due Date</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="title">Title</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sort Order Toggle */}
      <Button
        variant="outline"
        size="icon"
        onClick={handleSortOrderToggle}
        aria-label="Sort Order"
        className="self-end"
      >
        <ArrowDownUp className={`h-4 w-4 ${currentFilters.sortOrder === 'desc' ? 'rotate-180' : ''}`} />
      </Button>
    </div>
  );
};
