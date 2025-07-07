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

const PaperCitation = ({
  badges = [],
  title,
  description,
  authors = [],
  journal,
  publicationDate,
  citationCount,
  viewPaperLink,
  onSavePaper,
  onViewPaper,
  onViewPdf,
  initialSaved = false,
  className = "",
}) => {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isLoading, setIsLoading] = useState(false);

  const getBadgeStyle = (badge) => {
    switch (badge) {
      case "Highly Cited":
        return {
          background: "rgba(16, 183, 127, 0.15)",
          text: "#10b77f",
          border: "#10b77f",
        };
      case "Open Access":
        return {
          background: "rgba(59, 130, 246, 0.15)",
          text: "#3b82f6",
          border: "#3b82f6",
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
      default:
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

  const handleSave = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await onSavePaper?.();
      setIsSaved((prev) => !prev);
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  const handleView = () => {
    const isPdf = viewPaperLink?.toLowerCase().includes(".pdf");
    if (isPdf && onViewPdf) return onViewPdf(viewPaperLink, title);
    if (viewPaperLink && onViewPaper) return onViewPaper(viewPaperLink);
    if (viewPaperLink) window.open(viewPaperLink, "_blank");
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
                onClick={handleView}
                className={`w-2/3 sm:w-auto transition-all duration-200 font-medium ${
                  viewPaperLink && viewPaperLink.toLowerCase().includes(".pdf")
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 hover:border-gray-400"
                }`}
                title={viewPaperLink || "No link available"}
              >
                {viewPaperLink &&
                viewPaperLink.toLowerCase().includes(".pdf") ? (
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
                onClick={handleSave}
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
    </div>
  );
};

export default PaperCitation;
