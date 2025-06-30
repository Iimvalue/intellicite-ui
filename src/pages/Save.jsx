import FilterDropdown from "../components/filter-dropdown/FilterDropdown";
import HomeCard from "../components/home-card/HomeCard";
import { useState } from "react";
import SearchBar from "../components/searchbar/SearchBar";

export default function Save() {
  const [selectedDate, setSelectedDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Sample data for demonstration
  const dateOptions = [
    { label: "Last 7 days", value: "7d" },
    { label: "Last 30 days", value: "30d" },
    { label: "Last 90 days", value: "90d" },
    { label: "Last year", value: "1y" },
    { label: "All time", value: "all" },
  ];

  const footerNavigation = [
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
    { label: "Terms of Service", path: "/terms" },
    { label: "Privacy Policy", path: "/privacy" },
  ];

  // Saved papers - all should be marked as saved (initialSaved: true)
  const savedPapers = [
    {
      id: 1,
      relevancePercentage: 95,
      citationCount: 12333,
      title: "Deep Learning for Image Recognition",
      description:
        "A comprehensive study on the application of deep learning techniques in image recognition, exploring various architectures and their performance on benchmark datasets.",
      authors: ["Authors Name"],
      downloadable: true,
      initialSaved: true, // All saved papers should be true
    },
    {
      id: 2,
      relevancePercentage: 88,
      citationCount: 12333,
      title: "Reinforcement Learning for Robotics",
      description:
        "An investigation into the use of reinforcement learning algorithms for controlling robotic systems, focusing on applications in navigation and manipulation.",
      authors: ["Authors Name"],
      downloadable: false,
      initialSaved: true, // All saved papers should be true
    },
    {
      id: 3,
      relevancePercentage: 92,
      citationCount: 12333,
      title: "Natural Language Processing with Transformers",
      description:
        "An in-depth analysis of transformer models and their impact on natural language processing tasks, including machine translation and text summarization.",
      authors: ["Authors Name"],
      downloadable: true,
      initialSaved: true, // All saved papers should be true
    },
  ];

  const handleSearch = (query) => {
    console.log("Searching saved papers for:", query);
    // Implement search logic for saved papers
  };

  const handleDateFilter = (value) => {
    console.log("Filtering saved papers by date:", value);
    // Implement filter logic for saved papers
  };

  const handleUnsavePaper = async (paperId) => {
    console.log("Removing paper from saved:", paperId);
    // Implement unsave logic - remove from bookmarks
    return new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handleDownload = (paperId) => {
    console.log("Downloading saved paper:", paperId);
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
              placeholder="Search Your Saved Papers"
              onSearch={handleSearch}
              onInputChange={setSearchQuery}
              initialValue={searchQuery}
              className="w-full"
            />

            {/* Saved Papers Section */}
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
                Saved Papers
              </h2>

              {/* Papers List */}
              <div className="space-y-4 sm:space-y-6">
                {savedPapers.map((paper) => (
                  <HomeCard
                    key={paper.id}
                    relevancePercentage={paper.relevancePercentage}
                    citationCount={paper.citationCount}
                    title={paper.title}
                    description={paper.description}
                    authors={paper.authors}
                    downloadable={paper.downloadable}
                    initialSaved={paper.initialSaved}
                    onSavePaper={() => handleUnsavePaper(paper.id)}
                    onDownload={() => handleDownload(paper.id)}
                    className="w-full"
                  />
                ))}
              </div>

              {/* Empty State */}
              {savedPapers.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg
                      className="mx-auto h-12 w-12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No saved papers
                  </h3>
                  <p className="text-gray-500">
                    Papers you bookmark will appear here.
                  </p>
                </div>
              )}

              {/* Pagination */}
              {savedPapers.length > 0 && (
                <div className="flex items-center justify-center space-x-1 sm:space-x-2 mt-8 sm:mt-12">
                  <button className="p-2 text-gray-400 hover:text-gray-600 touch-manipulation">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  <div className="flex space-x-1 sm:space-x-2">
                    {[1, 2, 3, 4, 5].map((page) => (
                      <button
                        key={page}
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-md text-xs sm:text-sm font-medium transition-colors touch-manipulation ${
                          page === 1
                            ? "bg-blue-600 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button className="p-2 text-gray-400 hover:text-gray-600 touch-manipulation">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
