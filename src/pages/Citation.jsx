import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import PdfModal from "../components/modal/Modal";
import PaperCitation from "../components/cards/paper/PaperCitation";
import PaperSkeletonCard from "../components/cards/paper-sekelton/PaperSkeletonCard";
import axiosInstance from "../services/axiosInstance";
import { useNavigate } from "react-router";
import { getValidToken } from "../services/tokenService";
import { Toast } from "primereact/toast";

function Citation() {
  const [doi, setDoi] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [paper, setPaper] = useState(null);
  const [error, setError] = useState(null);
  const [savedPapers, setSavedPapers] = useState(new Set()); // Track saved paper IDs
  const [pdfModal, setPdfModal] = useState({
    isOpen: false,
    pdfUrl: "",
    title: "",
  });

  const navigate = useNavigate();
  const toast = useRef(null);
  const token = getValidToken();

  const handleCheck = async () => {
    if (!token) {
      toast.current.show({
        severity: "warn",
        summary: "Login required to perform search",
        life: 3000,
      });
      setTimeout(() => {
        navigate("/login");
      }, 3000);
      return;
    }

    if (!doi.trim() || !query.trim()) return;
    setLoading(true);
    setError(null);
    setPaper(null);

    try {
      // const token = localStorage.getItem("token");

      const response = await axiosInstance.post(`/api/papers/citeCheck`, {
        doi,
        query,
      });

      const data = response.data;
      if (data.success) {
        setPaper({
          ...data.data.paperId,
          reportText: data.data.report,
        });
      } else {
        setError("Citation check failed");
      }
    } catch (err) {
      console.error("Evaluation error:", err);
      setError("Server error during evaluation");
    } finally {
      setLoading(false);
    }
  };

  const handleViewPdf = (pdfUrl, title) => {
    setPdfModal({ isOpen: true, pdfUrl, title });
  };

  const handleViewPaper = (paperId, link) => {
    if (link?.trim()) {
      window.open(link, "_blank");
    } else {
      const fallback = `https://doi.org/${paperId}`;
      window.open(fallback, "_blank");
    }
  };

  const handleClosePdfModal = () => {
    setPdfModal({ isOpen: false, pdfUrl: "", title: "" });
  };

  const getDescription = (reportText, paper) => {
    if (reportText?.trim()) return reportText;
    const year = new Date(paper.publicationDate).getFullYear();
    return `Published in ${paper.journal} (${year})`;
  };

  // Load saved papers on component mount
  useEffect(() => {
    loadPersistedState();
  }, []);

  // Debug effect to log saved papers state
  useEffect(() => {
    console.log("Saved papers updated:", Array.from(savedPapers));
  }, [savedPapers]);

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

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {" "}
      <Toast ref={toast} />
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Title & Intro */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Citation Evaluation
          </h1>
          <p className="text-sm text-gray-600">
            Check the credibility and relevance of academic papers using their
            DOI and your research topic.
          </p>
        </div>

        {/* Input Section */}
        <div className="flex flex-col lg:flex-row gap-5">
          {/* Left Inputs */}
          <div className="w-full lg:w-1/3 space-y-6">
            {/* Query input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Enter Your Research Topic
              </label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Research Topic"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white "
              />
            </div>

            {/* DOI input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Enter Citation DOI
              </label>
              <input
                type="text"
                value={doi}
                onChange={(e) => setDoi(e.target.value)}
                placeholder="e.g 10.1000/xyz123"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white "
              />
            </div>

            {/* Button */}
            <Button
              onClick={handleCheck}
              disabled={loading || !doi.trim() || !query.trim()}
              className="w-full Rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Evaluating..." : "Evaluate Citation"}
            </Button>

            {/* Error Message */}
            {error && <p className="text-red-600 text-sm pt-2">{error}</p>}
          </div>
          {/* Right - Result */}
          <div className="flex-3/3 ">
            {loading && <PaperSkeletonCard className="w-full" />}

            {!loading && paper && (
              <PaperCitation
                title={paper.title}
                description={getDescription(paper.reportText, paper)}
                badges={paper.badges || []}
                authors={paper.authors}
                journal={paper.journal}
                publicationDate={paper.publicationDate}
                citationCount={paper.citationCount}
                viewPaperLink={paper.pdfLink || paper.sourceLink}
                pdfLink={paper.pdfLink}
                initialSaved={false}
                onSavePaper={() => {}}
                onViewPaper={() => handleViewPaper(paper._id, paper.sourceLink)}
                onViewPdf={handleViewPdf}
                className="w-full"
              />
            )}

            {!loading && !paper && !error && (
              <div className="text-gray-400 text-center mt-8 text-sm">
                Enter a topic and DOI to evaluate a paper.
              </div>
            )}
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

export default Citation;
