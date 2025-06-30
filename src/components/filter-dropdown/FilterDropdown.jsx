import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Button } from '../ui/button';

const FilterDropdown = ({
  label = "Filter",
  placeholder = "Select an option",
  options = [],
  value,
  onValueChange,
  onFilter,
  showFilterButton = true,
  filterButtonText = "Filter",
  className = ""
}) => {
  const handleFilter = () => {
    if (onFilter) {
      onFilter(value);
    }
  };

  return (
    <div className={`space-y-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100 ${className}`}>
      {/* Filter Label */}
      <h3 className="text-lg font-semibold text-gray-900">
        {label}
      </h3>

      {/* Dropdown Select */}
      <div className="w-full">
        <Select value={value} onValueChange={onValueChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem 
                key={option.value} 
                value={option.value}
                className="cursor-pointer"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filter Button */}
      {showFilterButton && (
        <Button
          onClick={handleFilter}
          disabled={!value}
          className="w-full transition-all duration-200"
          style={{
            backgroundColor: value ? '#3c83f6' : '#9ca3af',
            color: 'white'
          }}
        >
          {filterButtonText}
        </Button>
      )}
    </div>
  );
};

export default FilterDropdown;