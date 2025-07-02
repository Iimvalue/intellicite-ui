import FilterDropdown from "../components/filter-dropdown/FilterDropdown";
import PaperCard from "../components/cards/paper/PaperCard";
import { useState, useEffect } from "react";
import SearchBar from "../components/searchbar/SearchBar";
import Footer from "../components/footer/Footer";

export default function History() {
  const [searchQuery, setSearchQuery] = useState('');
  const [papers, setPapers] = useState([]);
  const [allPapers, setAllPapers] = useState([]); // Store original unfiltered results
  const [filters, setFilters] = useState({
    dateRange: 'any',
    paperType: 'all',
    citationRange: 'any',
    accessType: 'all'
  });

  const footerNavigation = [
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
    { label: 'Terms of Service', path: '/terms' },
    { label: 'Privacy Policy', path: '/privacy' }
  ];

  // Mock data for history - papers user previously searched/viewed
  const historyPapers = [
    {
      id: 1,
      paper: {
        _id: "1",
        badges: ["Highly Cited", "Open Access"],
        title: "Machine Learning in Healthcare: Predictive Analytics for Patient Outcomes",
        authors: ["Dr. Sarah Johnson", "Michael Chen", "Dr. Emily Rodriguez"],
        journal: "Journal of Medical Internet Research",
        publicationDate: "2024-01-15T00:00:00.000Z",
        citationCount: 1456,
        pdfLink: "https://example.com/papers/ml-healthcare.pdf",
        sourceLink: "https://example.com/papers/ml-healthcare.pdf"
      },
      reportText: "Explored papers on the application of machine learning techniques in healthcare, focusing on predictive analytics and patient outcome improvement. This research demonstrates significant improvements in early diagnosis accuracy."
    },
    {
      id: 2,
      paper: {
        _id: "2",
        badges: ["Recent"],
        title: "Reinforcement Learning for Robotics: Navigation and Manipulation",
        authors: ["Dr. James Wilson", "Alice Kumar", "Professor David Thompson"],
        journal: "IEEE Robotics and Automation Letters",
        publicationDate: "2024-01-10T00:00:00.000Z",
        citationCount: 892,
        pdfLink: "",
        sourceLink: "https://doi.org/10.1109/example.2024.robotics"
      },
      reportText: "An investigation into the use of reinforcement learning algorithms for controlling robotic systems, focusing on applications in navigation and manipulation. Comprehensive analysis of different RL approaches in robotics."
    },
    {
      id: 3,
      paper: {
        _id: "3",
        badges: ["Highly Cited", "Open Access"],
        title: "Natural Language Processing with Transformers: Modern Approaches",
        authors: ["Dr. Maria Garcia", "John Park", "Lisa Zhang"],
        journal: "Computational Linguistics",
        publicationDate: "2024-01-05T00:00:00.000Z",
        citationCount: 2341,
        pdfLink: "https://example.com/papers/nlp-transformers.pdf",
        sourceLink: "https://example.com/papers/nlp-transformers.pdf"
      },
      reportText: "An in-depth analysis of transformer models and their impact on natural language processing tasks, including machine translation and text summarization. Covers latest developments in attention mechanisms."
    },
    {
      id: 4,
      paper: {
        _id: "4",
        badges: ["Open Access"],
        title: "Climate Change Impact on Agricultural Systems: A Global Analysis",
        authors: ["Professor Anna Kowalski", "David Kim"],
        journal: "Nature Climate Change",
        publicationDate: "2023-12-20T00:00:00.000Z",
        citationCount: 734,
        pdfLink: "https://example.com/papers/climate-agriculture.pdf",
        sourceLink: "https://example.com/papers/climate-agriculture.pdf"
      },
      reportText: "Comprehensive study examining the effects of climate change on global agricultural productivity. Analysis includes data from multiple continents and predictive modeling for future scenarios."
    }
  ];

  // Initialize papers on component mount
  useEffect(() => {
    setAllPapers(historyPapers);
    setPapers(historyPapers);
  }, []);

  // Filter function (same as Home page)
  const applyFilters = (filterCriteria) => {
    let filteredPapers = [...allPapers];

    // Date range filter
    if (filterCriteria.dateRange && filterCriteria.dateRange !== 'any') {
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
    if (filterCriteria.paperType && filterCriteria.paperType !== 'all') {
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
    if (filterCriteria.citationRange && filterCriteria.citationRange !== 'any') {
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
    if (filterCriteria.accessType && filterCriteria.accessType !== 'all') {
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

  const handleSearch = (query) => {
    console.log('Searching history for:', query);
    setSearchQuery(query);
    // Implement search logic for history
    if (query.trim()) {
      const searchResults = allPapers.filter(item => 
        item.paper.title.toLowerCase().includes(query.toLowerCase()) ||
        item.paper.authors.some(author => author.toLowerCase().includes(query.toLowerCase())) ||
        item.reportText.toLowerCase().includes(query.toLowerCase())
      );
      setPapers(searchResults);
    } else {
      // Reset filters when search is cleared
      setFilters({ dateRange: 'any', paperType: 'all', citationRange: 'any', accessType: 'all' });
      setPapers(allPapers);
    }
  };

  const handleSavePaper = async (paperId) => {
    console.log('Saving paper from history:', paperId);
    // Implement save logic
    return new Promise(resolve => setTimeout(resolve, 1000));
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

  const handleViewPdf = (pdfUrl, title) => {
    console.log('Opening PDF modal:', pdfUrl, title);
    // Implement PDF modal logic if needed
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
              placeholder="Search your research history"
              onSearch={handleSearch}
              onInputChange={setSearchQuery}
              initialValue={searchQuery}
              className="w-full"
            />

            {/* Results Section */}
            <div>
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  Research History
                  {papers.length !== allPapers.length && allPapers.length > 0 && (
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      ({papers.length} of {allPapers.length})
                    </span>
                  )}
                </h2>
              </div>
              
              {/* History Papers List */}
              <div className="space-y-4 sm:space-y-6">
                {papers.map((item) => {
                  const paper = item.paper;
                  const reportText = item.reportText || '';
                  const description = getDescription(reportText, paper);
                  const viewLink = paper.pdfLink && paper.pdfLink.trim() !== "" 
                    ? paper.pdfLink 
                    : paper.sourceLink;
                  
                  return (
                    <PaperCard
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

              {/* Empty State - Search Results */}
              {papers.length === 0 && searchQuery && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No papers found</h3>
                  <p className="text-gray-500">Try searching with different keywords in your history.</p>
                </div>
              )}

              {/* Initial Empty State */}
              {papers.length === 0 && !searchQuery && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No search history</h3>
                  <p className="text-gray-500">Your research history will appear here as you search for papers.</p>
                </div>
              )}

              {/* Pagination */}
              {papers.length > 0 && (
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

     
    </div>
  );
}