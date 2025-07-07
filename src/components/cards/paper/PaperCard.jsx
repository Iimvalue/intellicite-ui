import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark, Calendar, FileText, Users, ExternalLink } from 'lucide-react';

const PaperCard = ({
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
  className = ""
}) => {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isLoading, setIsLoading] = useState(false);

  // Determine badge color based on badge type
  const getBadgeStyle = (badge) => {
    switch (badge) {
      case "Highly Cited":
        return {
          background: 'rgba(16, 183, 127, 0.15)',
          text: '#10b77f',
          border: '#10b77f'
        };
      case "Open Access":
        return {
          background: 'rgba(59, 130, 246, 0.15)',
          text: '#3b82f6',
          border: '#3b82f6'
        };
      case "Recent":
        return {
          background: 'rgba(168, 85, 247, 0.15)',
          text: '#a855f7',
          border: '#a855f7'
        };
      case "Outdated":
        return {
          background: 'rgba(107, 114, 128, 0.15)',
          text: '#6b7280',
          border: '#6b7280'
        };
      default:
        return {
          background: 'rgba(156, 163, 175, 0.15)',
          text: '#9ca3af',
          border: '#9ca3af'
        };
    }
  };

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
    const isPdfLink = viewPaperLink && viewPaperLink.toLowerCase().includes('.pdf');
    
    if (isPdfLink && onViewPdf) {
      onViewPdf(viewPaperLink, title);
    } else if (viewPaperLink && onViewPaper) {
      onViewPaper(viewPaperLink);
    } else if (viewPaperLink) {
      window.open(viewPaperLink, '_blank');
    } else if (onViewPaper) {
      onViewPaper(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short'
    });
  };

  const formatCitations = (count) => {
    if (!count) return '0';
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toLocaleString();
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 relative group ${className}`}>
      {/* Bookmark Icon - Top Right */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={handleSavePaper}
          disabled={isLoading}
          className={`p-2.5 rounded-full transition-all duration-200 ${
            isSaved 
              ? 'text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 shadow-sm' 
              : 'text-gray-800 hover:text-gray-600 hover:bg-gray-50 opacity-70 group-hover:opacity-100'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          title={isSaved ? 'Remove from saved' : 'Save paper'}
        >
          <Bookmark 
            className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} 
          />
        </button>
      </div>

      {/* Header Section */}
      <div className="mb-4 pr-16">
        {/* Badges */}
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
                    borderColor: badgeStyle.border
                  }}
                >
                  {badge}
                </span>
              );
            })}
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-3 leading-tight line-clamp-2">
          {title}
        </h3>

        {/* Authors */}
        <div className="flex items-center text-gray-600 mb-2">
          <Users className="h-4 w-4 mr-2 flex-shrink-0" />
          <p className="text-sm font-medium line-clamp-1">
            {authors.length > 0 ? authors.join(', ') : 'Unknown Authors'}
          </p>
        </div>

        {/* Publication Info */}
        <div className="flex items-center gap-4 text-gray-500 text-sm mb-4">
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
        </div>
      </div>

      {/* Description */}
      <div className="mb-5">
        <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
          {description}
        </p>
      </div>

      {/* Footer Section */}
      <div className="flex items-center justify-between">
        {/* Citation Count */}
        <div className="flex items-center text-gray-500">
          {citationCount > 0 && (
            <div className="bg-gray-50 px-3 py-1.5 rounded-full">
              <span className="text-sm font-medium">
                {formatCitations(citationCount)} citations
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <Button
          onClick={handleViewPaper}
          className={`transition-all duration-200 font-medium ${
            viewPaperLink && viewPaperLink.toLowerCase().includes('.pdf')
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 hover:border-gray-400'
          }`}
          title={viewPaperLink || "No link available"}
        >
          {viewPaperLink && viewPaperLink.toLowerCase().includes('.pdf') ? (
            <>
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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
  );
};

export default PaperCard;