import FilterDropdown from "../components/filter-dropdown/FilterDropdown";
import PdfModal from "../components/modal/Modal";
import { useState, useEffect } from "react";
import SearchBar from "../components/searchbar/SearchBar";
import PaperCard from "../components/cards/paper/PaperCard";
import PaperSkeletonCard from "../components/cards/paper-sekelton/PaperSkeletonCard";
import axiosInstance from "../services/axiosInstance";
import { Button } from "../components/ui/button";
import { Filter } from "lucide-react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [papers, setPapers] = useState([]);
  const [allPapers, setAllPapers] = useState([]); // Store original unfiltered results
  const [savedPapers, setSavedPapers] = useState(new Set()); // Track saved paper IDs
  const [loading, setLoading] = useState(false);
  // Mobile filter visibility
  const [showFiltersMobile, setShowFiltersMobile] = useState(false)
const toggleFilters = () => setShowFiltersMobile(!showFiltersMobile);

  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    dateRange: "any",
    paperType: "all",
    citationRange: "any",
    accessType: "all",
  });
  const [pdfModal, setPdfModal] = useState({
    isOpen: false,
    pdfUrl: "",
    title: "",
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

  // Load saved papers on component mount
  useEffect(() => {
    fetchSavedPaperIds();
    loadPersistedState();
  }, []);

  // Debug effect to log saved papers state
  useEffect(() => {
    console.log("Saved papers updated:", Array.from(savedPapers));
  }, [savedPapers]);

  // Persist state to localStorage whenever search results change
  useEffect(() => {
    if (papers.length > 0 || searchQuery) {
      const stateToSave = {
        searchQuery,
        papers,
        allPapers,
        filters,
        timestamp: Date.now(),
      };
      localStorage.setItem("homePageState", JSON.stringify(stateToSave));
      console.log("Home state saved to localStorage");
    }
  }, [papers, allPapers, searchQuery, filters]);

  // Load persisted state from localStorage
  const loadPersistedState = () => {
    try {
      const savedState = localStorage.getItem("homePageState");
      if (savedState) {
        const parsedState = JSON.parse(savedState);

        // Check if saved state is not too old (e.g., 24 hours)
        const MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        if (Date.now() - parsedState.timestamp < MAX_AGE) {
          setSearchQuery(parsedState.searchQuery || "");
          setPapers(parsedState.papers || []);
          setAllPapers(parsedState.allPapers || []);
          setFilters(
            parsedState.filters || {
              dateRange: "any",
              paperType: "all",
              citationRange: "any",
              accessType: "all",
            }
          );
          console.log("Home state restored from localStorage:", parsedState);
        } else {
          // Clear old state if it's too old
          localStorage.removeItem("homePageState");
          console.log("Old home state cleared");
        }
      }
    } catch (error) {
      console.error("Error loading persisted state:", error);
      localStorage.removeItem("homePageState");
    }
  };

  // Clear persisted state (can be called when needed)
  const clearPersistedState = () => {
    localStorage.removeItem("homePageState");
    console.log("Home state cleared from localStorage");
  };

  const searchPapers = async (query) => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // استخدم axiosInstance مع بناء رابط الطلب
      const response = await axiosInstance.get(
        `/api/papers/search?q=${encodeURIComponent(query)}`
      );

      const data = response.data;

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
    if (filterCriteria.paperType) {
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
    if (filterCriteria.citationRange) {
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
    if (filterCriteria.accessType) {
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
  const getDescription = (reportText, paper) => {
    if (reportText && reportText.trim() !== "") {
      return reportText; // Return exactly as received from API
    }

    // Fallback to journal and publication info only if no reportText
    const year = new Date(paper.publicationDate).getFullYear();
    return `Published in ${paper.journal} (${year})`;
  };

  // Updated handleSavePaper function with API integration
  const handleSavePaper = async (paperId) => {
    console.log("Saving paper:", paperId);

    try {
      const response = await axiosInstance.post("/api/bookmarks/", {
        paperId: paperId,
        notes: "Saved from search results for further research.",
      });

      if (response.status === 200 && response.data.success) {
        console.log("Paper saved successfully:", response.data);
        // You can show a success message to the user here
        // For example, you could add a toast notification
        return { success: true, message: "Paper saved successfully!" };
      } else {
        console.error(
          "Failed to save paper:",
          response.data.message || "Unknown error"
        );
        return {
          success: false,
          message: response.data.message || "Failed to save paper",
        };
      }
    } catch (error) {
      console.error("Error saving paper:", error);
      return {
        success: false,
        message: "Network error occurred while saving paper",
      };
    }
  };

  const handleViewPdf = (pdfUrl, title) => {
    setPdfModal({
      isOpen: true,
      pdfUrl: pdfUrl,
      title: title,
    });
  };

  const handleClosePdfModal = () => {
    setPdfModal({
      isOpen: false,
      pdfUrl: "",
      title: "",
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

  const handleSearch = (query) => {
    setSearchQuery(query);
    setFilters({
      dateRange: "any",
      paperType: "all",
      citationRange: "any",
      accessType: "all",
    });

    if (query.trim()) {
      searchPapers(query);
    } else {
      // If search is cleared, clear the results but keep them in localStorage for potential restoration
      setPapers([]);
      setAllPapers([]);
    }
  };

  // Fetch saved papers to check which ones are already saved
  const fetchSavedPaperIds = async () => {
    try {
      
      const response = await axiosInstance.get("http://localhost:3000/api/bookmarks/");

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          // Extract paper IDs from saved papers
          const savedIds = new Set(
            data.data.map((savedItem) => savedItem.paperId._id)
          );
          setSavedPapers(savedIds);
          console.log("Loaded saved paper IDs:", savedIds);
        }
      }
    } catch (error) {
      console.error("Error fetching saved papers:", error);
    }
  };

  // Handle unsaving papers (for when bookmark is clicked on saved papers)
  const handleUnsavePaper = async (paperId) => {
    console.log("Removing paper from saved:", paperId);

    try {
      const response = await axiosInstance.delete(
        `http://localhost:3000/api/bookmarks/${paperId}`
      );

      if (response.status === 200) {
        console.log("Paper unsaved successfully");
        // Remove from saved papers set
        setSavedPapers((prev) => {
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

  const handleDateFilter = (value) => {
    console.log("Filtering by date:", value);
    // This function can be removed as we're using the comprehensive filter
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 lg:px-20"> 
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 pb-40">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Left Sidebar - Filter Panel */}
          <div className="w-full lg:w-80 lg:flex-shrink-0 hidden lg:block lg:sticky lg:top-4">
            <FilterDropdown
              filters={filters}
              onFilterChange={handleFilterChange}
              onApplyFilter={handleApplyFilter}
              className="lg:sticky lg:top-4"
            />
          </div>
{/* Right Content Area */}
<div className="flex-1 space-y-6 sm:space-y-8 ">

  {/* Mobile only: SearchBar + Filter side by side */}
  <div className="flex items-center gap-2 lg:hidden mb-4 w-full">
    <div className="flex-1">
      <SearchBar
        placeholder="Enter Your Research Topic"
        onSearch={handleSearch}
        onInputChange={setSearchQuery}
        initialValue={searchQuery}
        className="w-full"
      />
    </div>
    <Button
      variant="outline"
      size="icon"
           className="px-5 py-6 text-sm"
      onClick={() => setShowFiltersMobile((prev) => !prev)}
    >
      <Filter className="w-5 h-5" />
    </Button>
  </div>

  {/* Desktop only: Full-width SearchBar */}
  <div className="hidden lg:block mb-4 w-full">
    <SearchBar
      placeholder="Enter Your Research Topic"
      onSearch={handleSearch}
      onInputChange={setSearchQuery}
      initialValue={searchQuery}
      className="w-full"
    />
  </div>

  {/* Mobile FilterDropdown (after search & button) */}
  {showFiltersMobile && (
    <div className="lg:hidden mb-6">
      <FilterDropdown
              filters={filters}
              onFilterChange={handleFilterChange}
              onApplyFilter={handleApplyFilter}
              className="lg:sticky lg:top-4"
            />
          </div>
  )}




            {/* Results Section */}
            <div>
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  Results
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

              {/* Loading Skeletons */}
              {loading && (
                <div className="space-y-4 sm:space-y-6">
                  {[1, 2, 3].map((index) => (
                    <PaperSkeletonCard key={index} className="w-full" />
                  ))}
                </div>
              )}
       

              {/* Papers List */}
              {!loading && (
                <div className="space-y-4 sm:space-y-6">     
                  {papers.map((item) => {
                    const paper = item.paper;
                    const reportText = item.reportText || "";
                    const description = getDescription(reportText, paper);
                    const viewLink =
                      paper.pdfLink && paper.pdfLink.trim() !== ""
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
                        initialSaved={savedPapers.has(paper._id)} // Check if paper is saved
                        onSavePaper={() => handleToggleSave(paper._id)}
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
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No papers found
                  </h3>
                  <p className="text-gray-500">
                    Try searching with different keywords.
                  </p>
                </div>
              )}

              {/* Initial State */}
              {!loading && papers.length === 0 && !searchQuery && (
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
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Start your research
                  </h3>
                  <p className="text-gray-500">
                    Enter a topic above to search for academic papers.
                  </p>
                </div>
              )}

              {/* Pagination - only show if there are results */}
              {!loading && papers.length > 0 && (
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
