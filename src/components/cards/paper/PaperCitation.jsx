import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Bookmark,
  Calendar,
  FileText,
  Users,
  ExternalLink,
  StickyNote,
} from "lucide-react";
import PdfModal from "@/components/modal/Modal";

const PaperCitation = ({
  badges = [],
  title,
  description,
  authors = [],
  journal,
  publicationDate,
  citationCount,
  viewPaperLink,
  pdfLink,
  onSavePaper,
  onViewPaper,
  onViewPdf,
  initialSaved = false,
  className = "",
}) => {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isLoading, setIsLoading] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Helper function to check if we have a PDF link
  const hasPdfAvailable = () => {
    const hasValidPdfLink = pdfLink && pdfLink.trim() !== "";
    const isPdfViewLink = viewPaperLink && (
      viewPaperLink.toLowerCase().includes(".pdf") || 
      viewPaperLink.toLowerCase().includes("pdf") ||
      viewPaperLink.toLowerCase().includes("filetype=pdf")
    );
    return hasValidPdfLink || isPdfViewLink;
  };

  // Determine badge color based on badge type
  const getBadgeStyle = (badge) => {
    switch (badge) {
      case "Highly Cited":
        return {
          background: "rgba(16, 183, 127, 0.15)",
          text: "#10b77f",
          border: "#10b77f",
        };
      case "Well Cited":
        return {
          background: "rgba(34, 197, 94, 0.15)",
          text: "#22c55e",
          border: "#22c55e",
        };
      case "Top 1% Most Cited":
        return {
          background: "rgba(5, 150, 105, 0.15)",
          text: "#059669",
          border: "#059669",
        };
      case "Top 10% Most Cited":
        return {
          background: "rgba(16, 183, 127, 0.15)",
          text: "#10b77f",
          border: "#10b77f",
        };
      case "High Impact":
        return {
          background: "rgba(34, 197, 94, 0.15)",
          text: "#22c55e",
          border: "#22c55e",
        };
      case "Above Average Impact":
        return {
          background: "rgba(59, 130, 246, 0.15)",
          text: "#3b82f6",
          border: "#3b82f6",
        };
      case "Top Percentile":
        return {
          background: "rgba(34, 197, 94, 0.15)",
          text: "#22c55e",
          border: "#22c55e",
        };
      case "High Percentile":
        return {
          background: "rgba(59, 130, 246, 0.15)",
          text: "#3b82f6",
          border: "#3b82f6",
        };
      case "Low Citation":
        return {
          background: "rgba(249, 115, 22, 0.15)",
          text: "#f97316",
          border: "#f97316",
        };
      case "No Citations":
        return {
          background: "rgba(239, 68, 68, 0.15)",
          text: "#ef4444",
          border: "#ef4444",
        };
      case "Low Impact":
        return {
          background: "rgba(249, 115, 22, 0.15)",
          text: "#f97316",
          border: "#f97316",
        };
      case "Recent":
        return {
          background: "rgba(168, 85, 247, 0.15)",
          text: "#a855f7",
          border: "#a855f7",
        };
      case "Outdated":
        return {
          background: "rgba(107, 114, 128, 0.15)",
          text: "#6b7280",
          border: "#6b7280",
        };
      case "Open Access":
        return {
          background: "rgba(59, 130, 246, 0.15)",
          text: "#3b82f6",
          border: "#3b82f6",
        };
      case "Full Text Available":
        return {
          background: "rgba(14, 165, 233, 0.15)",
          text: "#0ea5e9",
          border: "#0ea5e9",
        };
      case "Retracted":
        return {
          background: "rgba(239, 68, 68, 0.15)",
          text: "#ef4444",
          border: "#ef4444",
        };
      case "MeSH Indexed":
        return {
          background: "rgba(34, 197, 94, 0.15)",
          text: "#22c55e",
          border: "#22c55e",
        };
      case "Preprint":
        return {
          background: "rgba(245, 158, 11, 0.15)",
          text: "#f59e0b",
          border: "#f59e0b",
        };
      case "Pre-Review":
        return {
          background: "rgba(245, 158, 11, 0.15)",
          text: "#f59e0b",
          border: "#f59e0b",
        };
      case "Peer Reviewed":
        return {
          background: "rgba(34, 197, 94, 0.15)",
          text: "#22c55e",
          border: "#22c55e",
        };
      case "High Impact Journal":
        return {
          background: "rgba(217, 119, 6, 0.15)",
          text: "#d97706",
          border: "#d97706",
        };
      case "Medium Impact Journal":
        return {
          background: "rgba(59, 130, 246, 0.15)",
          text: "#3b82f6",
          border: "#3b82f6",
        };
      case "International Collaboration":
        return {
          background: "rgba(147, 51, 234, 0.15)",
          text: "#9333ea",
          border: "#9333ea",
        };
      case "Large Collaboration":
        return {
          background: "rgba(168, 85, 247, 0.15)",
          text: "#a855f7",
          border: "#a855f7",
        };
      case "Multi-Author":
        return {
          background: "rgba(59, 130, 246, 0.15)",
          text: "#3b82f6",
          border: "#3b82f6",
        };
      case "Single Author":
        return {
          background: "rgba(107, 114, 128, 0.15)",
          text: "#6b7280",
          border: "#6b7280",
        };
      case "Multi-Funded":
        return {
          background: "rgba(34, 197, 94, 0.15)",
          text: "#22c55e",
          border: "#22c55e",
        };
      case "Grant Funded":
        return {
          background: "rgba(34, 197, 94, 0.15)",
          text: "#22c55e",
          border: "#22c55e",
        };
      case "Funded Research":
        return {
          background: "rgba(59, 130, 246, 0.15)",
          text: "#3b82f6",
          border: "#3b82f6",
        };
      case "Highly Focused":
        return {
          background: "rgba(99, 102, 241, 0.15)",
          text: "#6366f1",
          border: "#6366f1",
        };
      case "Interdisciplinary":
        return {
          background: "rgba(139, 92, 246, 0.15)",
          text: "#8b5cf6",
          border: "#8b5cf6",
        };
      case "Spanish Language":
      case "French Language":
      case "German Language":
      case "Chinese Language":
      case "Japanese Language":
      case "Portuguese Language":
      case "Russian Language":
      case "Italian Language":
      case "Korean Language":
      case "Arabic Language":
      case "Non-English":
        return {
          background: "rgba(20, 184, 166, 0.15)",
          text: "#14b8a6",
          border: "#14b8a6",
        };
      case "Book":
      case "Book Chapter":
      case "Dataset":
      case "Dissertation":
      case "Editorial":
      case "Letter":
      case "Review Article":
      case "Report":
      case "Conference Paper":
      case "Special Publication":
        return {
          background: "rgba(100, 116, 139, 0.15)",
          text: "#64748b",
          border: "#64748b",
        };
      case "Invalid Date":
        return {
          background: "rgba(239, 68, 68, 0.15)",
          text: "#ef4444",
          border: "#ef4444",
        };
      default:
        if (badge.includes("Research")) {
          return {
            background: "rgba(99, 102, 241, 0.15)",
            text: "#6366f1",
            border: "#6366f1",
          };
        }
        return {
          background: "rgba(156, 163, 175, 0.15)",
          text: "#9ca3af",
          border: "#9ca3af",
        };
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
  };

  const formatCitations = (count) =>
    count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count;

  const handleSavePaper = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    if (onSavePaper) {
      try {
        await onSavePaper();
        setIsSaved(prev => !prev);
      } catch (error) {
        console.error('Error saving paper:', error);
      }
    } else {
      setIsSaved(prev => !prev);
    }
    
    setIsLoading(false);
  };
  
  const handleViewPaper = () => {
    if (hasPdfAvailable()) {
      setIsPdfModalOpen(true);
    } else if (viewPaperLink && onViewPaper) {
      onViewPaper(viewPaperLink);
    } else if (viewPaperLink) {
      window.open(viewPaperLink, '_blank');
    } else if (onViewPaper) {
      onViewPaper(null);
    }
  };

  const handleClosePdfModal = () => {
    setIsPdfModalOpen(false);
  };

  return (
    <div className={` p-2 ${className}`}>
      <div className="flex justify-between items-start mb-5">
        <div className="space-y-3">
          <h2 className="sm:text-2xl font-bold text-gray-900 leading-snug">
            {title}
          </h2>

          {/* Badges */}
          <div className="flex flex-wrap">
            {badges.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap mt-2">
                {badges.map((badge, index) => {
                  const badgeStyle = getBadgeStyle(badge);
                  return (
                    <span
                      key={index}
                      className="px-2.5 py-1 text-xs font-medium rounded-full border"
                      style={{
                        backgroundColor: badgeStyle.background,
                        color: badgeStyle.text,
                        borderColor: badgeStyle.border,
                      }}
                    >
                      {badge}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1  gap-4 pt-4 text-sm text-gray-500 w-full">
            <div className="grid grid-cols-1 gap-2">
              {/* authors */}

              <div className="flex items-center ">
                <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                <p className="text-sm line-clamp-1">
                  <span>
                    {authors.length ? authors.join(", ") : "Unknown authors"}
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>{journal || "Unknown journal"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(publicationDate)}</span>
              </div>
              {citationCount > 0 && (
                <div className="flex items-center gap-2">
                  <StickyNote className="w-4 h-4" />
                  <span>{formatCitations(citationCount)} citations</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-row sm:justify-end items-center gap-3 w-full">
              <Button
                onClick={handleViewPaper}
                className={`w-2/3 sm:w-auto transition-all duration-200 font-medium ${
                  hasPdfAvailable()
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 hover:border-gray-400"
                }`}
                title={pdfLink || viewPaperLink || "No link available"}
              >
                {hasPdfAvailable() ? (
                  <>
                    <svg
                      className="h-4 w-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    View Paper
                  </>
                ) : (
                  <>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Go to Paper
                  </>
                )}
              </Button>

              <button
                onClick={handleSavePaper}
                disabled={isLoading}
                className={`w-full sm:w-auto p-2 rounded-full transition ${
                  isSaved
                    ? "text-green-600 bg-green-50"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Bookmark
                  className={`w-5 h-5 mx-auto ${isSaved ? "fill-current" : ""}`}
                />
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t pt-4 text-sm text-gray-500">
            <p className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap">
              {description}
            </p>
          </div>
        </div>
      </div>
      
      {/* PDF Modal */}
      <PdfModal
        isOpen={isPdfModalOpen}
        onClose={handleClosePdfModal}
        pdfUrl={pdfLink || viewPaperLink}
        title={title}
      />
    </div>
  );
};

export default PaperCitation;
