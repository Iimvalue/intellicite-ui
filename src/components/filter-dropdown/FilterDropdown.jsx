import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Filter, Calendar, Award, FileText } from 'lucide-react';

const FilterDropdown = ({
  filters = {
    dateRange: '',
    paperType: '',
    citationRange: '',
    accessType: ''
  },
  onFilterChange,
  onApplyFilter,
  className = ""
}) => {
  const dateOptions = [
    { label: 'Any time', value: 'any' },
    { label: 'Last year', value: '1y' },
    { label: 'Last 2 years', value: '2y' },
    { label: 'Last 5 years', value: '5y' },
    { label: 'Before 2020', value: 'before-2020' }
  ];

  const paperTypeOptions = [
    { label: 'All papers', value: 'all' },
    { label: 'Highly Cited', value: 'highly-cited' },
    { label: 'Recent papers', value: 'recent' },
    { label: 'Open Access', value: 'open-access' }
  ];

  const citationOptions = [
    { label: 'Any citations', value: 'any' },
    { label: '1000+ citations', value: '1000+' },
    { label: '500+ citations', value: '500+' },
    { label: '100+ citations', value: '100+' },
    { label: 'Under 100 citations', value: '0-100' }
  ];

  const accessOptions = [
    { label: 'All access types', value: 'all' },
    { label: 'PDF available', value: 'pdf-available' },
    { label: 'DOI link only', value: 'doi-only' }
  ];

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    onFilterChange(newFilters);
  };

  const handleApplyFilter = () => {
    if (onApplyFilter) {
      onApplyFilter(filters);
    }
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== '' && value !== 'any' && value !== 'all'
  );

  return (
    <div className={`p-6 bg-white rounded-xl shadow-sm border border-gray-200 space-y-6 ${className}`}>
      {/* Filter Header */}
      <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
        <Filter className="h-5 w-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Filter Results
        </h3>
        {hasActiveFilters && (
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
            Active
          </span>
        )}
      </div>

      {/* Filter Options */}
      <div className="space-y-5">
        {/* Publication Date */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <label className="text-sm font-medium text-gray-700">
              Publication Date
            </label>
          </div>
          <Select 
            value={filters.dateRange} 
            onValueChange={(value) => handleFilterChange('dateRange', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              {dateOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Paper Type */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Award className="h-4 w-4 text-gray-500" />
            <label className="text-sm font-medium text-gray-700">
              Paper Type
            </label>
          </div>
          <Select 
            value={filters.paperType} 
            onValueChange={(value) => handleFilterChange('paperType', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select paper type" />
            </SelectTrigger>
            <SelectContent>
              {paperTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Citation Range */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <label className="text-sm font-medium text-gray-700">
              Citation Count
            </label>
          </div>
          <Select 
            value={filters.citationRange} 
            onValueChange={(value) => handleFilterChange('citationRange', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select citation range" />
            </SelectTrigger>
            <SelectContent>
              {citationOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Access Type */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4 text-gray-500" />
            <label className="text-sm font-medium text-gray-700">
              Access Type
            </label>
          </div>
          <Select 
            value={filters.accessType} 
            onValueChange={(value) => handleFilterChange('accessType', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select access type" />
            </SelectTrigger>
            <SelectContent>
              {accessOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Apply Filter Button */}
      <div className="pt-4 border-t border-gray-100">
        <Button
          onClick={handleApplyFilter}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 transition-colors duration-200 hover:cursor-pointer"
        >
          <Filter className="h-4 w-4 mr-2 " />
          Apply Filters
          {hasActiveFilters && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-blue-500 rounded-full ">
              {Object.values(filters).filter(value => value !== '').length}
            </span>
          )}
        </Button>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={() => onFilterChange({ dateRange: 'any', paperType: 'all', citationRange: 'any', accessType: 'all' })}
          className="w-full text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
};

export default FilterDropdown;