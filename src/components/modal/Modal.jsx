import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const PdfModal = ({ isOpen, onClose, pdfUrl, title = "View Paper" }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="relative w-[98vw] h-[98vh] bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900 truncate pr-4">
            {title}
          </h2>
          <div className="flex items-center space-x-3">
            {/* Open in New Tab Button */}
            <button
              onClick={() => window.open(pdfUrl, '_blank')}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
              title="Open in new tab"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
              title="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* PDF Viewer Container */}
        <div className="flex-1 min-h-0 overflow-hidden bg-gray-50">
          {pdfUrl ? (
            <iframe
              src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1&view=FitH&zoom=page-width`}
              className="w-full h-full border-0 block"
              title="PDF Viewer"
              loading="lazy"
              style={{ minHeight: '0' }}
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-white">
              <div className="text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">PDF not available</h3>
                <p className="text-gray-500 text-lg">The PDF could not be loaded.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfModal;