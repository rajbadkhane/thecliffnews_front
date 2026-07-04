"use client";

import React, { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { Worker, Viewer } from '@react-pdf-viewer/core';

// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css';

interface PDFThumbnailGeneratorProps {
  pdfUrl: string;
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
}

const PDFThumbnailGenerator: React.FC<PDFThumbnailGeneratorProps> = ({
  pdfUrl,
  width = 280,
  height = 380,
  className = '',
  alt = 'PDF Thumbnail'
}) => {
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render on server
  if (!isClient) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded ${className}`}
        style={{ width, height }}
      >
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded ${className}`}
        style={{ width, height }}
      >
        <FileText className="h-6 w-6 text-gray-400" />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded border border-gray-200 dark:border-gray-700 ${className}`}
      style={{ width, height }}
    >
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <div
          style={{
            width: '100%',
            height: '100%',
            overflow: 'hidden'
          }}
        >
          <Viewer
            fileUrl={pdfUrl}
            defaultScale={width / 612} // 612 is default PDF page width in points
            renderPage={(props) => (
              <>
                {props.canvasLayer.children}
              </>
            )}
          />
        </div>
      </Worker>
    </div>
  );
};

export default PDFThumbnailGenerator;
