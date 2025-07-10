import React, { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Bookmark,
  BookmarkCheck,
  Calendar,
  FileText,
  Users,
  ExternalLink,
  Check,
  Loader2,
} from "lucide-react";
import { Toast } from "primereact/toast";
import { FiClipboard } from "react-icons/fi";
import { 
  generateCitation
} from "@/services/citationService";
import PdfModal from "@/components/modal/Modal";

const PaperCard = ({
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
  doi,
  volume,
  issue,
  pages,
  className = "",
}) => {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [citationLoading, setCitationLoading] = useState({ APA: false, MLA: false });
  const [citationSuccess, setCitationSuccess] = useState({ APA: false, MLA: false });
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const toast = useRef(null);

  useEffect(() => {
    setIsSaved(initialSaved);
  }, [initialSaved]);

  const hasPdfAvailable = useCallback(() => {
    const hasValidPdfLink = pdfLink && pdfLink.trim() !== "";
    const isPdfViewLink = viewPaperLink && (
      viewPaperLink.toLowerCase().includes(".pdf") || 
      viewPaperLink.toLowerCase().includes("pdf") ||
      viewPaperLink.toLowerCase().includes("filetype=pdf")
    );
  
    return hasValidPdfLink || isPdfViewLink;
  }, [pdfLink, viewPaperLink, title]);

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


  const handleSavePaper = async () => {
    if (isLoading) return;

    setIsLoading(true);

    if (onSavePaper) {
      try {
        await onSavePaper();
        setIsSaved((prev) => !prev);
      } catch (error) {
        console.error("Error saving paper:", error);
      }
    } else {
      setIsSaved((prev) => !prev);
    }

    setIsLoading(false);
  };

  const handleViewPaper = () => {
    if (hasPdfAvailable()) {
      setIsPdfModalOpen(true);
    } else if (viewPaperLink && onViewPaper) {
      onViewPaper(viewPaperLink);
    } else if (viewPaperLink) {
      window.open(viewPaperLink, "_blank");
    } else if (onViewPaper) {
      onViewPaper(null);
    }
  };

  const handleClosePdfModal = () => {
    setIsPdfModalOpen(false);
  };


  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const formatCitations = (count) => {
    if (!count) return "0";
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toLocaleString();
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  const handleCopyDOI = (doi) => {
    if (!doi) return;

    navigator.clipboard
      .writeText(doi)
      .then(() => {
        toast.current.show({
          severity: "success",
          summary: "Copied",
          detail: "DOI copied to clipboard",
          life: 3000,
        });
      })
      .catch(() => {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to copy DOI",
          life: 3000,
        });
      });
  };

  const handleCopyCitation = useCallback((style) => {
    if (!doi || citationLoading[style]) return;

    setCitationLoading(prev => ({ ...prev, [style]: true }));
    setCitationSuccess(prev => ({ ...prev, [style]: false }));

    try {
      const year = publicationDate ? new Date(publicationDate).getFullYear().toString() : '';
      
      const citationData = {
        title: title || '',
        authors: authors || [],
        journal: journal || '',
        year,
        volume: volume || '',
        issue: issue || '',
        pages: pages || '',
        doi: doi || ''
      };

      const citation = generateCitation(citationData, style);
      
      if (!citation || citation.trim() === '') {
        toast.current.show({
          severity: "warn",
          summary: "Citation Unavailable",
          detail: "Unable to generate citation. Missing required information.",
          life: 4000,
        });
        setCitationLoading(prev => ({ ...prev, [style]: false }));
        return;
      }

      if (navigator.clipboard) {
        navigator.clipboard.writeText(citation).then(() => {
          setCitationSuccess(prev => ({ ...prev, [style]: true }));
          toast.current.show({
            severity: "success",
            summary: "Citation Copied",
            detail: `${style} citation copied to clipboard`,
            life: 3000,
          });
          
          setTimeout(() => {
            setCitationSuccess(prev => ({ ...prev, [style]: false }));
          }, 2000);
        }).catch(() => {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to copy citation to clipboard",
            life: 3000,
          });
        });
      }

    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to generate citation",
        life: 3000,
      });
    } finally {
      setCitationLoading(prev => ({ ...prev, [style]: false }));
    }
  }, [doi, citationLoading, title, authors, journal, publicationDate, volume, issue, pages, toast]);

  const shouldShowViewMore = description && description.length > 200;

  return (
    <>
      <Toast ref={toast} />

      <div
        className={`bg-white border border-gray-200 rounded-xl hover:shadow-xl transition-all duration-300 group ${className}`}
      >
        {/* Card Header */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between mb-4">
            {/* Left side - Badges */}
            <div className="flex-1">
              {badges.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap mb-3">
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

            {/* Right side - Bookmark */}
            <button
              onClick={handleSavePaper}
              disabled={isLoading}
              className={`ml-4 p-2 rounded-full transition-all duration-200 ${
                isSaved
                  ? "bg-green-50 hover:bg-green-100 shadow-sm"
                  : "hover:bg-gray-50 opacity-70 group-hover:opacity-100"
              } ${
                isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
              title={isSaved ? "Remove from saved" : "Save paper"}
            >
              {isSaved ? (
                <BookmarkCheck className="h-5 w-5 text-green-600" />
              ) : (
                <Bookmark className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
              )}
            </button>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight line-clamp-2">
            {title}
          </h3>

          {/* Authors */}
          <div className="flex items-center text-gray-600 mb-3">
            <Users className="h-4 w-4 mr-2 flex-shrink-0" />
            <p className="text-sm font-medium line-clamp-1">
              {authors.length > 0 ? authors.join(", ") : "Unknown Authors"}
            </p>
          </div>
        </div>

        {/* Card Body */}
        <div className="px-6 pb-4">
          {/* Publication Info */}
          <div className="flex items-center flex-wrap gap-4 text-gray-500 text-sm mb-4">
            {journal && (
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-1.5 flex-shrink-0" />
                <span className="line-clamp-1 max-w-xs">{journal}</span>
              </div>
            )}

            {publicationDate && (
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1.5 flex-shrink-0" />
                <span>{formatDate(publicationDate)}</span>
              </div>
            )}

            {citationCount > 0 && (
              <div className="flex items-center">
                <span className="text-sm font-medium text-blue-800 px-2.5 py-1 rounded-full">
                  {formatCitations(citationCount)} citations
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-4">
            <p
              className={`text-gray-700 text-sm leading-relaxed ${
                !isExpanded && shouldShowViewMore ? "line-clamp-3" : ""
              }`}
            >
              {description}
            </p>
            {shouldShowViewMore && (
              <button
                onClick={toggleExpanded}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2 transition-colors duration-200"
              >
                {isExpanded ? "View Less" : "View More"}
              </button>
            )}
          </div>
        </div>

        {/* Card Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-xl">
          <div className="flex items-center justify-between">
            {/* Left side - Quick Actions */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleCopyDOI(doi)}
                  className="p-2 rounded-lg hover:bg-gray-200 transition-colors text-gray-500"
                  title={doi ? `Copy DOI: ${doi}` : "DOI not available"}
                >
                  <FiClipboard size={16} />
                </button>
                
                <button
                  onClick={() => handleCopyCitation('APA')}
                  disabled={citationLoading.APA || !doi}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    citationSuccess.APA
                      ? 'text-green-700 bg-green-100 hover:bg-green-200'
                      : citationLoading.APA
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                  title={citationSuccess.APA ? 'APA citation copied to clipboard' : 'Copy APA citation'}
                >
                  {citationLoading.APA ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : citationSuccess.APA ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    "APA"
                  )}
                </button>
                
                <button
                  onClick={() => handleCopyCitation('MLA')}
                  disabled={citationLoading.MLA || !doi}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    citationSuccess.MLA
                      ? 'text-green-700 bg-green-100 hover:bg-green-200'
                      : citationLoading.MLA
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                  title={citationSuccess.MLA ? 'MLA citation copied to clipboard' : 'Copy MLA citation'}
                >
                  {citationLoading.MLA ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : citationSuccess.MLA ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    "MLA"
                  )}
                </button>
              </div>
            </div>

            {/* Right side - Primary Action */}
            <Button
              onClick={handleViewPaper}
              className={`transition-all duration-200 font-medium ${
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
                  Go to Source
                </>
              )}
            </Button>
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
    </>
  );
};

export default PaperCard;
