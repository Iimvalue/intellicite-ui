import FilterDropdown from "../components/filter-dropdown/FilterDropdown";
import HomeCard from "../components/home/home-card/HomeCard";
import HomeCardSkeleton from "../components/home/home-sekelton/HomeSkeletonCard";
import PdfModal from "../components/modal/Modal";
import { useState } from "react";
import SearchBar from "../components/searchbar/SearchBar";
import Footer from "../components/footer/Footer";

export default function Home() {
const [searchQuery, setSearchQuery] = useState("");
const [papers, setPapers] = useState([]);
const [allPapers, setAllPapers] = useState([]); // Store original unfiltered results
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [filters, setFilters] = useState({
  dateRange: 'any',
  paperType: 'all',
  citationRange: 'any',
  accessType: 'all'
});
const [pdfModal, setPdfModal] = useState({
  isOpen: false,
  pdfUrl: '',
  title: ''
});

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

// Function to search papers from API
const searchPapers = async (query) => {
  if (!query.trim()) return;
  
  setLoading(true);
  setError(null);
  
  try {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NjExOGZkYzNkYzM3ZjQyMTExM2EyMCIsImlhdCI6MTc1MTM3NjYzOCwiZXhwIjoxNzUxNDYzMDM4fQ.ES4uNmoXTKcjEtmNFlk9prFU7sYfaCP4JUolim60d8k";
    
    const response = await fetch(`http://localhost:3000/api/papers/search?q=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      setAllPapers(data.data); // Store original results
      setPapers(data.data); // Display results
    } else {
      setError("Failed to fetch papers");
    }
  } catch (err) {
    setError("Error connecting to server");
    console.error("Search error:", err);
  } finally {
    setLoading(false);
  }
};

// Filter function
const applyFilters = (filterCriteria) => {
  let filteredPapers = [...allPapers];

  // Date range filter
  if (filterCriteria.dateRange) {
    const now = new Date();
    filteredPapers = filteredPapers.filter(item => {
      const pubDate = new Date(item.paper.publicationDate);
      const yearsDiff = (now - pubDate) / (1000 * 60 * 60 * 24 * 365);
      
      switch(filterCriteria.dateRange) {
        case '1y': return yearsDiff <= 1;
        case '2y': return yearsDiff <= 2;
        case '5y': return yearsDiff <= 5;
        case 'before-2020': return pubDate.getFullYear() < 2020;
        default: return true;
      }
    });
  }

  // Paper type filter
  if (filterCriteria.paperType) {
    filteredPapers = filteredPapers.filter(item => {
      const badges = item.paper.badges || [];
      switch(filterCriteria.paperType) {
        case 'highly-cited': return badges.includes('Highly Cited');
        case 'recent': return badges.includes('Recent');
        case 'open-access': return badges.includes('Open Access');
        default: return true;
      }
    });
  }

  // Citation range filter
  if (filterCriteria.citationRange) {
    filteredPapers = filteredPapers.filter(item => {
      const count = item.paper.citationCount || 0;
      switch(filterCriteria.citationRange) {
        case '1000+': return count >= 1000;
        case '500+': return count >= 500;
        case '100+': return count >= 100;
        case '0-100': return count < 100;
        default: return true;
      }
    });
  }

  // Access type filter
  if (filterCriteria.accessType) {
    filteredPapers = filteredPapers.filter(item => {
      const hasPdf = item.paper.pdfLink && item.paper.pdfLink.trim() !== "";
      switch(filterCriteria.accessType) {
        case 'pdf-available': return hasPdf;
        case 'doi-only': return !hasPdf;
        default: return true;
      }
    });
  }

  setPapers(filteredPapers);
};

const handleFilterChange = (newFilters) => {
  setFilters(newFilters);
};

const handleApplyFilter = (filterCriteria) => {
  applyFilters(filterCriteria);
};

// Function to get description - use reportText as-is or fallback
const getDescription = (reportText, paper) => {
  if (reportText && reportText.trim() !== "") {
    return reportText; // Return exactly as received from API
  }
  
  // Fallback to journal and publication info only if no reportText
  const year = new Date(paper.publicationDate).getFullYear();
  return `Published in ${paper.journal} (${year})`;
};

const handleSavePaper = async (paperId) => {
  console.log("Saving paper:", paperId);
  // Implement save logic - you can call your API here
  return new Promise((resolve) => setTimeout(resolve, 1000));
};

const handleViewPdf = (pdfUrl, title) => {
  setPdfModal({
    isOpen: true,
    pdfUrl: pdfUrl,
    title: title
  });
};

const handleClosePdfModal = () => {
  setPdfModal({
    isOpen: false,
    pdfUrl: '',
    title: ''
  });
};

const handleViewPaper = (paperId, link) => {
  console.log('Viewing paper:', paperId, 'Link:', link);
  
  if (link && link.trim() !== "") {
    // Open the provided link (non-PDF links)
    window.open(link, '_blank');
  } else {
    // Fallback: try to find the paper and use sourceLink
    const paperItem = papers.find(p => p.paper._id === paperId);
    if (paperItem?.paper.sourceLink) {
      console.log('Using sourceLink as fallback:', paperItem.paper.sourceLink);
      window.open(paperItem.paper.sourceLink, '_blank');
    } else if (paperItem?.paper.doi) {
      // Last resort: create DOI link
      const doiLink = `https://doi.org/${paperItem.paper.doi}`;
      console.log('Using DOI link as fallback:', doiLink);
      window.open(doiLink, '_blank');
    } else {
      alert('Paper link not available. Please search for this paper manually.');
    }
  }
};

const handleSearch = (query) => {
  console.log("Searching for:", query);
  setSearchQuery(query);
  // Reset filters when new search is performed
  setFilters({ dateRange: 'any', paperType: 'all', citationRange: 'any', accessType: 'all' });
  searchPapers(query);
};

const handleDateFilter = (value) => {
  console.log("Filtering by date:", value);
  // This function can be removed as we're using the comprehensive filter
};

return (
  <div className="min-h-screen bg-gray-50">
    {/* Main Content */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 pb-40">
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
        {/* Left Sidebar - Filter Panel */}
        <div className="w-full lg:w-80 lg:flex-shrink-0 order-2 lg:order-1">
          <FilterDropdown
            filters={filters}
            onFilterChange={handleFilterChange}
            onApplyFilter={handleApplyFilter}
            className="lg:sticky lg:top-4"
          />
        </div>

        {/* Right Content Area */}
        <div className="flex-1 space-y-6 sm:space-y-8 order-1 lg:order-2">
          {/* Search Bar */}
          <SearchBar
            placeholder="Enter Your Research Topic"
            onSearch={handleSearch}
            onInputChange={setSearchQuery}
            initialValue={searchQuery}
            className="w-full"
          />

          {/* Results Section */}
          <div>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                Results
                {papers.length !== allPapers.length && allPapers.length > 0 && (
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({papers.length} of {allPapers.length})
                  </span>
                )}
              </h2>
            </div>

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="text-red-800 text-sm">{error}</div>
              </div>
            )}

            {/* Loading Skeletons */}
            {loading && (
              <div className="space-y-4 sm:space-y-6">
                {[1, 2, 3].map((index) => (
                  <HomeCardSkeleton key={index} className="w-full" />
                ))}
              </div>
            )}

            {/* Papers List */}
            {!loading && (
              <div className="space-y-4 sm:space-y-6">
                {papers.map((item) => {
                  const paper = item.paper;
                  const reportText = item.reportText || '';
                  const description = getDescription(reportText, paper);
                  const viewLink = paper.pdfLink && paper.pdfLink.trim() !== "" 
                    ? paper.pdfLink 
                    : paper.sourceLink;
                  
                  return (
                    <HomeCard
                      key={paper._id}
                      badges={paper.badges || []}
                      title={paper.title}
                      description={description}
                      authors={paper.authors}
                      journal={paper.journal}
                      publicationDate={paper.publicationDate}
                      citationCount={paper.citationCount}
                      viewPaperLink={viewLink}
                      initialSaved={false}
                      onSavePaper={() => handleSavePaper(paper._id)}
                      onViewPaper={(link) => handleViewPaper(paper._id, link)}
                      onViewPdf={handleViewPdf}
                      className="w-full"
                    />
                  );
                })}
              </div>
            )}

            {/* Empty State */}
            {!loading && papers.length === 0 && searchQuery && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No papers found</h3>
                <p className="text-gray-500">Try searching with different keywords.</p>
              </div>
            )}

            {/* Initial State */}
            {!loading && papers.length === 0 && !searchQuery && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Start your research</h3>
                <p className="text-gray-500">Enter a topic above to search for academic papers.</p>
              </div>
            )}

            {/* Pagination - only show if there are results */}
            {!loading && papers.length > 0 && (
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
            )}
          </div>
        </div>
      </div>
    </div>

    {/* PDF Modal */}
    <PdfModal
      isOpen={pdfModal.isOpen}
      onClose={handleClosePdfModal}
      pdfUrl={pdfModal.pdfUrl}
      title={pdfModal.title}
    />

    {/* Footer */}
    <Footer 
      navigationItems={footerNavigation}
      copyrightText="© 2025 IntelliCite. All rights reserved."
    />
  </div>
);
}
