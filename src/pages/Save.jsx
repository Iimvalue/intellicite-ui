import FilterDropdown from "../components/filter-dropdown/FilterDropdown";
import { useState, useEffect } from "react";
import SearchBar from "../components/searchbar/SearchBar";
import PaperCard from "../components/cards/paper/PaperCard";
import PdfModal from "../components/modal/Modal";
import axiosInstance from "../services/axiosInstance";
import { Button } from "../components/ui/button";
import { Filter } from "lucide-react";

export default function Save() {
  const [searchQuery, setSearchQuery] = useState("");
  const [papers, setPapers] = useState([]);
  const [allPapers, setAllPapers] = useState([]); // Store original unfiltered results
  const [loading, setLoading] = useState(true);
    // Mobile filter visibility
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
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

  // Function to transform backend response to component format
  const transformSavedData = (apiResponse) => {
    if (!apiResponse.data || !Array.isArray(apiResponse.data)) {
      return [];
    }

    return apiResponse.data.map((savedItem, index) => ({
      id: savedItem._id, // Use the saved paper ID
      paper: {
        _id: savedItem.paperId._id,
        badges: savedItem.paperId.badges || [],
        title: savedItem.paperId.title,
        authors: savedItem.paperId.authors || [],
        journal: savedItem.paperId.journal,
        publicationDate: savedItem.paperId.publicationDate,
        citationCount: savedItem.paperId.citationCount || 0,
        pdfLink: savedItem.paperId.pdfLink || "",
        sourceLink: savedItem.paperId.sourceLink,
        doi: savedItem.paperId.doi,
        isOpenAccess: savedItem.paperId.isOpenAccess,
      },
      reportText: savedItem.personalNotes || "", // Use personal notes as description
      savedAt: savedItem.createdAt, // When it was saved
      savedId: savedItem._id, // Keep track of the saved record ID for unsaving
    }));
  };

  // Fetch saved papers from backend
  const fetchSavedPapers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get("api/bookmarks/");

      if (response.data.success) {
        console.log("API Response:", response.data);
        const transformedData = transformSavedData(response.data);
        setAllPapers(transformedData);
        setPapers(transformedData);
      } else {
        setError(response.data.message || "Failed to fetch saved papers");
      }
    } catch (error) {
      console.error("Error fetching saved papers:", error);
      setError("Network error occurred while fetching saved papers");
    } finally {
      setLoading(false);
    }
  };

  // Initialize papers on component mount
  useEffect(() => {
    fetchSavedPapers();
  }, []);

  // Watch for searchQuery changes to handle clearing
  useEffect(() => {
    if (searchQuery === "" && allPapers.length > 0) {
      console.log(
        "Search query is empty, showing all saved papers:",
        allPapers.length
      );
      setFilters({
        dateRange: "any",
        paperType: "all",
        citationRange: "any",
        accessType: "all",
      });
      setPapers(allPapers);
    }
  }, [searchQuery, allPapers]);

  // Filter function (same as other pages)
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

  // Function to get description - use personal notes or fallback
  const getDescription = (paper) => {
    if (paper.reportText && paper.reportText.trim() !== "") {
      return paper.reportText; // Return personal notes if available
    }

    // Enhanced fallback with saved date
    const year = new Date(paper.publicationDate).getFullYear();
    const savedDate = new Date(paper.savedAt).toLocaleDateString();
    return `Published in ${paper.journal} (${year}) - Saved on ${savedDate}`;
  };

  const handleSearch = (query) => {
    console.log("Searching saved papers for:", query);
    setSearchQuery(query);

    if (query && query.trim() !== "") {
      // If there's a search query, filter the results
      const searchResults = allPapers.filter(
        (item) =>
          item.paper.title.toLowerCase().includes(query.toLowerCase()) ||
          item.paper.authors.some((author) =>
            author.toLowerCase().includes(query.toLowerCase())
          ) ||
          item.reportText.toLowerCase().includes(query.toLowerCase())
      );
      setPapers(searchResults);
    } else {
      // If search is empty or cleared, show ALL results and reset filters
      console.log(
        "Search cleared, showing all saved papers:",
        allPapers.length
      );
      setFilters({
        dateRange: "any",
        paperType: "all",
        citationRange: "any",
        accessType: "all",
      });
      setPapers(allPapers);
    }
  };

  // Updated unsave function to make API call
  const handleUnsavePaper = async (paperId) => {
    console.log("Removing paper from saved:", paperId);

    try {
      const response = await axiosInstance.delete(`api/bookmarks/${paperId}`);

      if (response.status === 200) {
        // Remove from local state immediately for better UX
        const updatedAllPapers = allPapers.filter(
          (p) => p.paper._id !== paperId
        );
        const updatedPapers = papers.filter((p) => p.paper._id !== paperId);
        setAllPapers(updatedAllPapers);
        setPapers(updatedPapers);

        console.log("Paper unsaved successfully");
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

  const handleViewPaper = (paperId, link) => {
    console.log("Viewing saved paper:", paperId, "Link:", link);

    if (link && link.trim() !== "") {
      window.open(link, "_blank");
    } else {
      const paperItem = papers.find((p) => p.paper._id === paperId);
      if (paperItem?.paper.sourceLink) {
        console.log(
          "Using sourceLink as fallback:",
          paperItem.paper.sourceLink
        );
        window.open(paperItem.paper.sourceLink, "_blank");
      } else if (paperItem?.paper.doi) {
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

  const handleViewPdf = (pdfUrl, title) => {
    console.log("Opening PDF modal for saved paper:", pdfUrl, title);
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
                placeholder="Search Your Saved Papers"
                onSearch={handleSearch}
                onInputChange={setSearchQuery}
                initialValue={searchQuery}
                className="w-full"
              />

              {/* Results Section */}
              <div>
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                    Saved Papers
                  </h2>
                </div>

                {/* Loading Skeletons */}
                <div className="space-y-4 sm:space-y-6">
                  {[1, 2, 3].map((index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-1">
                          <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
                          <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                          </div>
                          <div className="flex space-x-2 mt-4">
                            <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                            <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                          </div>
                        </div>
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

            {/* Saved Papers Section */}
            <div>
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  Saved Papers
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

              {/* Papers List */}
              <div className="space-y-4 sm:space-y-6">
                {papers.map((item) => {
                  const paper = item.paper;
                  const reportText = item.reportText || "";
                  const description = getDescription(paper);
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
                        pdfLink={paper.pdfLink}
                        doi={paper.doi}
                        className="w-full"
                        initialSaved={true}
                        onSavePaper={() => handleUnsavePaper(paper._id)}
                        onViewPaper={(link) => handleViewPaper(paper._id, link)}
                        onViewPdf={handleViewPdf}
                        volume={paper.volume || ""}
                        issue={paper.issue || ""}
                        pages={paper.pages || ""}
                      />
                    );
                })}
              </div>

              {/* Empty State - Search Results */}
              {papers.length === 0 && searchQuery && !loading && (
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
                    No papers found
                  </h3>
                  <p className="text-gray-500">
                    Try searching with different keywords in your saved papers.
                  </p>
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
