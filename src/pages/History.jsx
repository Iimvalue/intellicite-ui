import FilterDropdown from "../components/filter-dropdown/FilterDropdown";
import HistoryCard from "../components/history-card/HistoryCard";
import { useState } from "react";
import SearchBar from "../components/searchbar/SearchBar";
import Footer from "../components/footer/Footer";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data for demonstration
  const dateOptions = [
    { label: 'Last 7 days', value: '7d' },
    { label: 'Last 30 days', value: '30d' },
    { label: 'Last 90 days', value: '90d' },
    { label: 'Last year', value: '1y' },
    { label: 'All time', value: 'all' }
  ];

  const footerNavigation = [
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
    { label: 'Terms of Service', path: '/terms' },
    { label: 'Privacy Policy', path: '/privacy' }
  ];

  const sampleHistoryItems = [
    {
      id: 1,
      dateHistory: "2024-01-15",
      title: "Machine Learning in Healthcare",
      description: "Explored papers on the application of machine learning techniques in healthcare, focusing on predictive analytics and patient outcome improvement."
    },
    {
      id: 2,
      dateHistory: "2024-01-10",
      title: "Reinforcement Learning for Robotics",
      description: "An investigation into the use of reinforcement learning algorithms for controlling robotic systems, focusing on applications in navigation and manipulation."
    },
    {
      id: 3,
      dateHistory: "2024-01-05",
      title: "Natural Language Processing with Transformers",
      description: "An in-depth analysis of transformer models and their impact on natural language processing tasks, including machine translation and text summarization."
    }
  ];

  const handleSearch = (query) => {
    console.log('Searching for:', query);
    // Implement search logic
  };

  const handleDateFilter = (value) => {
    console.log('Filtering by date:', value);
    // Implement filter logic
  };

  const handleDownload = (itemId) => {
    console.log('Downloading item:', itemId);
    // Implement download logic
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 pb-40">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Left Sidebar - Filter */}
          <div className="w-full lg:w-80 lg:flex-shrink-0 order-2 lg:order-1">
            <FilterDropdown
              label="Filter"
              placeholder="Select an option"
              options={dateOptions}
              value={selectedDate}
              onValueChange={setSelectedDate}
              onFilter={handleDateFilter}
              filterButtonText="Filter"
              className="lg:sticky lg:top-4"
            />
          </div>

          {/* Right Content Area */}
          <div className="flex-1 space-y-6 sm:space-y-8 order-1 lg:order-2">
            {/* Search Bar */}
            <SearchBar
              placeholder="Search about your history"
              onSearch={handleSearch}
              onInputChange={setSearchQuery}
              initialValue={searchQuery}
              className="w-full"
            />

            {/* Results Section */}
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">History</h2>
              
              {/* History Items List */}
              <div className="space-y-4 sm:space-y-6">
                {sampleHistoryItems.map((item) => (
                  <HistoryCard
                    key={item.id}
                    dateHistory={item.dateHistory}
                    title={item.title}
                    description={item.description}
                    onDownload={() => handleDownload(item.id)}
                    className="w-full"
                  />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center space-x-1 sm:space-x-2 mt-8 sm:mt-12">
                <button className="p-2 text-gray-400 hover:text-gray-600 touch-manipulation">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="flex space-x-1 sm:space-x-2">
                  {[1, 2, 3, 4, 5].map((page) => (
                    <button
                      key={page}
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-md text-xs sm:text-sm font-medium transition-colors touch-manipulation ${
                        page === 1 
                          ? 'bg-blue-600 text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button className="p-2 text-gray-400 hover:text-gray-600 touch-manipulation">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}