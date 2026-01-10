import React from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowDownUp, Search, SlidersHorizontal } from 'lucide-react';

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
    <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md shadow-lg transition-all duration-300 hover:border-white/20">
      <div className="flex items-center gap-2 text-white/40 mr-2 border-r border-white/10 pr-4 hidden md:flex">
        <SlidersHorizontal size={18} />
        <span className="text-sm font-medium">Filters</span>
      </div>

      {/* Search Input */}
      <div className="min-w-[200px] flex-1 relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 transition-colors group-focus-within:text-[#00FFD1]" />
        <Input
          id="search"
          type="text"
          placeholder="Search tasks..."
          value={currentFilters.search}
          onChange={handleInputChange}
          className="bg-black/20 border-white/10 text-white placeholder:text-gray-500 pl-10 h-11 transition-all focus:border-[#00FFD1]/50 focus:ring-2 focus:ring-[#00FFD1]/10 rounded-xl"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Priority Filter */}
        <Select value={currentFilters.priority || 'all'} onValueChange={handlePriorityChange}>
          <SelectTrigger className="w-[140px] h-11 bg-black/20 border-white/10 rounded-xl transition-all focus:border-[#00FFD1]/50">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent className="bg-black/90 backdrop-blur-xl border-white/10 text-white">
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="1">High</SelectItem>
            <SelectItem value="2">Medium</SelectItem>
            <SelectItem value="3">Low</SelectItem>
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select value={currentFilters.status || 'all'} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[140px] h-11 bg-black/20 border-white/10 rounded-xl transition-all focus:border-[#00FFD1]/50">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-black/90 backdrop-blur-xl border-white/10 text-white">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort By */}
        <Select value={currentFilters.sortBy || 'none'} onValueChange={handleSortByChange}>
          <SelectTrigger className="w-[140px] h-11 bg-black/20 border-white/10 rounded-xl transition-all focus:border-[#00FFD1]/50">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-black/90 backdrop-blur-xl border-white/10 text-white">
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
          className="h-11 w-11 bg-black/20 border-white/10 rounded-xl hover:bg-[#00FFD1]/10 hover:text-[#00FFD1] hover:border-[#00FFD1]/30 transition-all active:scale-95"
        >
          <ArrowDownUp className={`h-4 w-4 transition-transform duration-300 ${currentFilters.sortOrder === 'desc' ? 'rotate-180' : ''}`} />
        </Button>
      </div>
    </div>
  );
};