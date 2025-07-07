import FilterDropdown from "../components/filter-dropdown/FilterDropdown";
import PaperCard from "../components/cards/paper/PaperCard";
import { useState, useEffect } from "react";
import SearchBar from "../components/searchbar/SearchBar";
import PdfModal from "../components/modal/Modal";

export default function History() {
  const [searchQuery, setSearchQuery] = useState("");
  const [papers, setPapers] = useState([]);
  const [allPapers, setAllPapers] = useState([]); // Store original unfiltered results
  const [savedPapers, setSavedPapers] = useState(new Set()); // Track saved paper IDs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    dateRange: "any",
    paperType: "all",
    citationRange: "any",
    accessType: "all",
  });
  const [pdfModal, setPdfModal] = useState({
    isOpen: false,
    pdfUrl: '',
    title: ''
  });

  // Function to transform backend response to component format
  const transformHistoryData = (apiResponse) => {
    if (!apiResponse.data || !Array.isArray(apiResponse.data)) {
      return [];
    }

    const transformedData = [];
    
    apiResponse.data.forEach((historyItem) => {
      // Skip items with empty results (like the Arabic query)
      if (historyItem.results && Array.isArray(historyItem.results) && historyItem.results.length > 0) {
        historyItem.results.forEach((result, index) => {
          transformedData.push({
            id: `${historyItem._id}_${index}`, // Create unique ID combining history ID and result index
            paper: {
              _id: result.paper._id,
              badges: result.paper.badges || [],
              title: result.paper.title,
              authors: result.paper.authors || [],
              journal: result.paper.journal,
              publicationDate: result.paper.publicationDate,
              citationCount: result.paper.citationCount || 0,
              pdfLink: result.paper.pdfLink || "",
              sourceLink: result.paper.sourceLink,
              doi: result.paper.doi,
              isOpenAccess: result.paper.isOpenAccess
            },
            reportText: result.report?.report || "",
            searchQuery: historyItem.query, // Keep track of original search query
            searchDate: historyItem.createdAt
          });
        });
      }
    });

    // Remove duplicates based on paper._id and searchQuery combination
    const uniqueData = transformedData.filter((item, index, self) => 
      index === self.findIndex((t) => 
        t.paper._id === item.paper._id && t.searchQuery === item.searchQuery
      )
    );

    return uniqueData;
  };

  // Fetch history data from backend
  const fetchHistoryData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODZhZDlmODBkYmM2YzZmNjRmYTZmYzgiLCJpYXQiOjE3NTE4MzMwODAsImV4cCI6MTc1MTkxOTQ4MH0.Y75HE6n5G7mLp4QMvtGGJS3T3B3aPmaX1a5hEGdkSg8";

      const response = await fetch(`http://localhost:3000/api/user-history`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("API Response:", data);
        
        if (data.success) {
          const transformedData = transformHistoryData(data);
          setAllPapers(transformedData);
          setPapers(transformedData);
        } else {
          setError(data.message || "Failed to fetch history");
        }
      } else {
        setError(`Failed to fetch history: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
      setError("Network error occurred while fetching history");
    } finally {
      setLoading(false);
    }
  };

  // Fetch saved papers to check which ones are already saved
  const fetchSavedPaperIds = async () => {
    try {
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODZhZDlmODBkYmM2YzZmNjRmYTZmYzgiLCJpYXQiOjE3NTE4MzMwODAsImV4cCI6MTc1MTkxOTQ4MH0.Y75HE6n5G7mLp4QMvtGGJS3T3B3aPmaX1a5hEGdkSg8";

      const response = await fetch('http://localhost:3000/api/saved-papers/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          // Extract paper IDs from saved papers
          const savedIds = new Set(data.data.map(savedItem => savedItem.paperId._id));
          setSavedPapers(savedIds);
          console.log("Loaded saved paper IDs:", savedIds);
        }
      }
    } catch (error) {
      console.error("Error fetching saved papers:", error);
    }
  };

  // Initialize papers on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load both history and saved papers concurrently
        await Promise.all([
          fetchHistoryData(),
          fetchSavedPaperIds()
        ]);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Watch for searchQuery changes to handle clearing
  useEffect(() => {
    if (searchQuery === "" && allPapers.length > 0) {
      console.log("Search query is empty, showing all papers:", allPapers.length);
      setFilters({
        dateRange: "any",
        paperType: "all",
        citationRange: "any",
        accessType: "all",
      });
      setPapers(allPapers);
    }
  }, [searchQuery, allPapers]);

  // Debug effect to log saved papers state
  useEffect(() => {
    console.log("Saved papers updated:", Array.from(savedPapers));
  }, [savedPapers]);

  // Filter function (same as Home page)
  const applyFilters = (filterCriteria) => {
    let filteredPapers = [...allPapers];

    // Date range filter
    if (filterCriteria.dateRange && filterCriteria.dateRange !== "any") {
      const now = new Date();
      filteredPapers = filteredPapers.filter((item) => {
        const pubDate = new Date(item.paper.publicationDate);
        const yearsDiff = (now - pubDate) / (1000 * 60 * 60 * 24 * 365);

        switch (filterCriteria.dateRange) {
          case "1y":
            return yearsDiff <= 1;
          case "2y":
            return yearsDiff <= 2;
          case "5y":
            return yearsDiff <= 5;
          case "before-2020":
            return pubDate.getFullYear() < 2020;
          default:
            return true;
        }
      });
    }

    // Paper type filter
    if (filterCriteria.paperType && filterCriteria.paperType !== "all") {
      filteredPapers = filteredPapers.filter((item) => {
        const badges = item.paper.badges || [];
        switch (filterCriteria.paperType) {
          case "highly-cited":
            return badges.includes("Highly Cited");
          case "recent":
            return badges.includes("Recent");
          case "open-access":
            return badges.includes("Open Access");
          default:
            return true;
        }
      });
    }

    // Citation range filter
    if (
      filterCriteria.citationRange &&
      filterCriteria.citationRange !== "any"
    ) {
      filteredPapers = filteredPapers.filter((item) => {
        const count = item.paper.citationCount || 0;
        switch (filterCriteria.citationRange) {
          case "1000+":
            return count >= 1000;
          case "500+":
            return count >= 500;
          case "100+":
            return count >= 100;
          case "0-100":
            return count < 100;
          default:
            return true;
        }
      });
    }

    // Access type filter
    if (filterCriteria.accessType && filterCriteria.accessType !== "all") {
      filteredPapers = filteredPapers.filter((item) => {
        const hasPdf = item.paper.pdfLink && item.paper.pdfLink.trim() !== "";
        switch (filterCriteria.accessType) {
          case "pdf-available":
            return hasPdf;
          case "doi-only":
            return !hasPdf;
          default:
            return true;
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
  const getDescription = (reportText, paper, searchQuery) => {
    if (reportText && reportText.trim() !== "" && !reportText.includes("static test response")) {
      return reportText; // Return exactly as received from API
    }
    
    // Enhanced fallback with search context
    const year = new Date(paper.publicationDate).getFullYear();
    const baseInfo = `Published in ${paper.journal} (${year})`;
    
    if (searchQuery) {
      return `Found in search: "${searchQuery}" - ${baseInfo}`;
    }
    
    return baseInfo;
  };

  const handleSearch = (query) => {
    console.log("Searching history for:", query);
    setSearchQuery(query);
    
    if (query && query.trim() !== "") {
      // If there's a search query, filter the results
      const searchResults = allPapers.filter(
        (item) =>
          item.paper.title.toLowerCase().includes(query.toLowerCase()) ||
          item.paper.authors.some((author) =>
            author.toLowerCase().includes(query.toLowerCase())
          ) ||
          item.reportText.toLowerCase().includes(query.toLowerCase()) ||
          (item.searchQuery && item.searchQuery.toLowerCase().includes(query.toLowerCase()))
      );
      setPapers(searchResults);
    } else {
      // If search is empty or cleared, show ALL results and reset filters
      console.log("Search cleared, showing all papers:", allPapers.length);
      setFilters({
        dateRange: "any",
        paperType: "all",
        citationRange: "any",
        accessType: "all",
      });
      setPapers(allPapers); // Show all papers when search is cleared
    }
  };

  // Updated handleSavePaper function with API integration
  const handleSavePaper = async (paperId) => {
    console.log("Saving paper:", paperId);
    
    try {
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODZhZDlmODBkYmM2YzZmNjRmYTZmYzgiLCJpYXQiOjE3NTE4MzMwODAsImV4cCI6MTc1MTkxOTQ4MH0.Y75HE6n5G7mLp4QMvtGGJS3T3B3aPmaX1a5hEGdkSg8";
      
      const response = await fetch('http://localhost:3000/api/saved-papers/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          paperId: paperId,
          notes: "Saved from search results for further research."
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log("Paper saved successfully:", data);
        // Add to saved papers set
        setSavedPapers(prev => new Set([...prev, paperId]));
        return { success: true, message: "Paper saved successfully!" };
      } else {
        console.error("Failed to save paper:", data.message || "Unknown error");
        return { success: false, message: data.message || "Failed to save paper" };
      }
    } catch (error) {
      console.error("Error saving paper:", error);
      return { success: false, message: "Network error occurred while saving paper" };
    }
  };

  // Handle unsaving papers (for when bookmark is clicked on saved papers)
  const handleUnsavePaper = async (paperId) => {
    console.log("Removing paper from saved:", paperId);
    
    try {
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODZhZDlmODBkYmM2YzZmNjRmYTZmYzgiLCJpYXQiOjE3NTE4MzMwODAsImV4cCI6MTc1MTkxOTQ4MH0.Y75HE6n5G7mLp4QMvtGGJS3T3B3aPmaX1a5hEGdkSg8";
      
      const response = await fetch(`http://localhost:3000/api/saved-papers/${paperId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        console.log("Paper unsaved successfully");
        // Remove from saved papers set
        setSavedPapers(prev => {
          const newSet = new Set(prev);
          newSet.delete(paperId);
          return newSet;
        });
        return { success: true, message: "Paper removed from saved list" };
      } else {
        console.error("Failed to unsave paper:", response.status);
        return { success: false, message: "Failed to remove paper" };
      }
    } catch (error) {
      console.error("Error unsaving paper:", error);
      return { success: false, message: "Network error occurred" };
    }
  };

  // Handle save/unsave toggle
  const handleToggleSave = async (paperId) => {
    const isCurrentlySaved = savedPapers.has(paperId);
    
    if (isCurrentlySaved) {
      return await handleUnsavePaper(paperId);
    } else {
      return await handleSavePaper(paperId);
    }
  };

 

  const handleViewPdf = (pdfUrl, title) => {
    console.log("Opening PDF modal:", pdfUrl, title);
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
    console.log("Viewing paper:", paperId, "Link:", link);

    if (link && link.trim() !== "") {
      // Open the provided link (non-PDF links)
      window.open(link, "_blank");
    } else {
      // Fallback: try to find the paper and use sourceLink
      const paperItem = papers.find((p) => p.paper._id === paperId);
      if (paperItem?.paper.sourceLink) {
        console.log(
          "Using sourceLink as fallback:",
          paperItem.paper.sourceLink
        );
        window.open(paperItem.paper.sourceLink, "_blank");
      } else if (paperItem?.paper.doi) {
        // Last resort: create DOI link
        const doiLink = `https://doi.org/${paperItem.paper.doi}`;
        console.log("Using DOI link as fallback:", doiLink);
        window.open(doiLink, "_blank");
      } else {
        alert(
          "Paper link not available. Please search for this paper manually."
        );
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
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
                  </h2>
                </div>
                
                {/* Loading Skeletons */}
                <div className="space-y-4 sm:space-y-6">
                  {[1, 2, 3].map((index) => (
                    <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
                      <div className="flex items-start space-x-4">
                        <div className="flex-1">
                          {/* Title skeleton */}
                          <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
                          
                          {/* Authors skeleton */}
                          <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
                          
                          {/* Journal skeleton */}
                          <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
                          
                          {/* Description skeleton */}
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                          </div>
                          
                          {/* Badges skeleton */}
                          <div className="flex space-x-2 mt-4">
                            <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                            <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                          </div>
                        </div>
                        
                        {/* Action buttons skeleton */}
                        <div className="flex flex-col space-y-2">
                          <div className="h-8 bg-gray-200 rounded w-24"></div>
                          <div className="h-8 bg-gray-200 rounded w-20"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                  {papers.length !== allPapers.length &&
                    allPapers.length > 0 && (
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

              {/* History Papers List */}
              <div className="space-y-4 sm:space-y-6">
                {papers.map((item) => {
                  const paper = item.paper;
                  const reportText = item.reportText || "";
                  const description = getDescription(reportText, paper, item.searchQuery);
                  const viewLink =
                    paper.pdfLink && paper.pdfLink.trim() !== ""
                      ? paper.pdfLink
                      : paper.sourceLink;

                  return (
                    <PaperCard
                      key={item.id}
                      badges={paper.badges || []}
                      title={paper.title}
                      description={description}
                      authors={paper.authors}
                      journal={paper.journal}
                      publicationDate={paper.publicationDate}
                      citationCount={paper.citationCount}
                      viewPaperLink={viewLink}
                      initialSaved={savedPapers.has(paper._id)} // Check if paper is saved
                      onSavePaper={() => handleToggleSave(paper._id)}
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
              {papers.length === 0 && !searchQuery && !loading && (
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No search history
                  </h3>
                  <p className="text-gray-500">
                    Your research history will appear here as you search for papers.
                  </p>
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

      {/* PDF Modal */}
      <PdfModal
        isOpen={pdfModal.isOpen}
        onClose={handleClosePdfModal}
        pdfUrl={pdfModal.pdfUrl}
        title={pdfModal.title}
      />
    </div>
  );
}