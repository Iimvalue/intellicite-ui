import React, { useState } from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({
  placeholder = "Enter Your Research Topic",
  onSearch,
  onInputChange,
  initialValue = "",
  className = ""
}) => {
  const [searchValue, setSearchValue] = useState(initialValue);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    
    if (onInputChange) {
      onInputChange(value);
    }
  };

  const handleSearch = () => {
    if (onSearch && searchValue.trim()) {
      onSearch(searchValue.trim());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={`flex w-full max-w-4xl mx-auto overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}>
      {/* Search Input */}
      <input
        type="text"
        value={searchValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        className="flex-1 px-6 py-4 text-gray-900 placeholder-gray-400 bg-transparent border-none focus:outline-none"
      />
      
      {/* Search Button */}
      <button
        onClick={handleSearch}
        disabled={!searchValue.trim()}
        className={`px-6 py-4 rounded-bl-4xl transition-all duration-200 ${
          searchValue.trim() 
            ? 'bg-slate-700 text-white hover:bg-slate-800 cursor-pointer' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
        title="Search"
      >
        <Search className="h-6 w-6" />
      </button>
    </div>
  );
};

export default SearchBar;