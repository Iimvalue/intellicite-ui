import FilterDropdown from "../components/filter-dropdown/FilterDropdown";
import { useState, useEffect } from "react";
import SearchBar from "../components/searchbar/SearchBar";
import PaperCard from "../components/cards/paper/PaperCard";
import Footer from "../components/footer/Footer";

export default function Save() {
  const [searchQuery, setSearchQuery] = useState("");
  const [papers, setPapers] = useState([]);
  const [allPapers, setAllPapers] = useState([]); // Store original unfiltered results
  const [filters, setFilters] = useState({
    dateRange: 'any',
    paperType: 'all',
    citationRange: 'any',
    accessType: 'all'
  });

  const footerNavigation = [
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
    { label: "Terms of Service", path: "/terms" },
    { label: "Privacy Policy", path: "/privacy" },
  ];

  // Mock data for saved papers - all should be marked as saved (initialSaved: true)
  const savedPapers = [
    {
      id: 1,
      paper: {
        _id: "1",
        badges: ["Highly Cited", "Open Access"],
        title: "Deep Learning for Image Recognition: Advanced Neural Network Architectures",
        authors: ["Dr. Sarah Johnson", "Michael Chen", "Dr. Emily Rodriguez"],
        journal: "Nature Machine Intelligence",
        publicationDate: "2023-11-15T00:00:00.000Z",
        citationCount: 1823,
        pdfLink: "https://example.com/papers/deep-learning-image.pdf",
        sourceLink: "https://example.com/papers/deep-learning-image.pdf"
      },
      reportText: "A comprehensive study on the application of deep learning techniques in image recognition, exploring various neural network architectures and their performance on benchmark datasets. Includes analysis of CNNs, ResNets, and Vision Transformers."
    },
    {
      id: 2,
      paper: {
        _id: "2",
        badges: ["Recent", "Highly Cited"],
        title: "Reinforcement Learning for Autonomous Robotics Systems",
        authors: ["Dr. James Wilson", "Alice Kumar"],
        journal: "IEEE Transactions on Robotics",
        publicationDate: "2024-02-10T00:00:00.000Z",
        citationCount: 756,
        pdfLink: "",
        sourceLink: "https://doi.org/10.1109/example.2024.robotics"
      },
      reportText: "An investigation into the use of reinforcement learning algorithms for controlling autonomous robotic systems, focusing on applications in navigation, manipulation, and human-robot interaction in complex environments."
    },
    {
      id: 3,
      paper: {
        _id: "3",
        badges: ["Open Access"],
        title: "Natural Language Processing with Large Language Models",
        authors: ["Dr. Maria Garcia", "John Park", "Lisa Zhang", "Professor Robert Anderson"],
        journal: "Computational Linguistics",
        publicationDate: "2023-09-22T00:00:00.000Z",
        citationCount: 2187,
        pdfLink: "https://example.com/papers/nlp-llm.pdf",
        sourceLink: "https://example.com/papers/nlp-llm.pdf"
      },
      reportText: "An in-depth analysis of transformer models and their impact on natural language processing tasks, including machine translation, text summarization, and conversational AI. Comprehensive evaluation of model performance and efficiency."
    },
    {
      id: 4,
      paper: {
        _id: "4",
        badges: ["Highly Cited"],
        title: "Quantum Computing Applications in Cryptography and Security",
        authors: ["Professor Anna Kowalski", "David Kim", "Dr. Rachel Turner"],
        journal: "Physical Review Applied",
        publicationDate: "2023-07-08T00:00:00.000Z",
        citationCount: 1456,
        pdfLink: "https://example.com/papers/quantum-crypto.pdf",
        sourceLink: "https://example.com/papers/quantum-crypto.pdf"
      },
      reportText: "Exploring the revolutionary impact of quantum computing on modern cryptographic systems and cybersecurity. This research examines quantum algorithms, post-quantum cryptography, and secure communication protocols."
    },
    {
      id: 5,
      paper: {
        _id: "5",
        badges: ["Recent", "Open Access"],
        title: "Sustainable Energy Storage: Next-Generation Battery Technologies",
        authors: ["Dr. Jennifer Lee", "Mohamed Hassan", "Professor Lisa Wang"],
        journal: "Nature Energy",
        publicationDate: "2024-01-30T00:00:00.000Z",
        citationCount: 634,
        pdfLink: "https://example.com/papers/battery-tech.pdf",
        sourceLink: "https://example.com/papers/battery-tech.pdf"
      },
      reportText: "Comprehensive analysis of emerging battery technologies for sustainable energy storage, including solid-state batteries, lithium-metal batteries, and novel electrode materials for grid-scale applications."
    }
  ];

  // Initialize papers on component mount
  useEffect(() => {
    setAllPapers(savedPapers);
    setPapers(savedPapers);
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
    console.log("Searching saved papers for:", query);
    setSearchQuery(query);
    // Implement search logic for saved papers
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

  const handleUnsavePaper = async (paperId) => {
    console.log("Removing paper from saved:", paperId);
    // Implement unsave logic - remove from bookmarks
    return new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handleViewPaper = (paperId, link) => {
    console.log('Viewing saved paper:', paperId, 'Link:', link);
    
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
    console.log('Opening PDF modal for saved paper:', pdfUrl, title);
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
              placeholder="Search Your Saved Papers"
              onSearch={handleSearch}
              onInputChange={setSearchQuery}
              initialValue={searchQuery}
              className="w-full"
            />

            {/* Saved Papers Section */}
            <div>
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  Saved Papers
                  {papers.length !== allPapers.length && allPapers.length > 0 && (
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      ({papers.length} of {allPapers.length})
                    </span>
                  )}
                </h2>
              </div>

              {/* Papers List */}
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
                      initialSaved={true} // All saved papers should be true
                      onSavePaper={() => handleUnsavePaper(paper._id)}
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No papers found</h3>
                  <p className="text-gray-500">Try searching with different keywords in your saved papers.</p>
                </div>
              )}

              {/* Initial Empty State */}
              {papers.length === 0 && !searchQuery && (
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
              {papers.length > 0 && (
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