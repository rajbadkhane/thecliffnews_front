"use client";

import React, { useState } from "react";
import { Worker, Viewer, Plugin, RenderViewer } from "@react-pdf-viewer/core";
import { thumbnailPlugin } from "@react-pdf-viewer/thumbnail";
import { FileText } from "lucide-react";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/thumbnail/lib/styles/index.css";

interface EPaperThumbnailProps {
  pdfUrl: string;
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
}

// Custom plugin to show only thumbnail
interface PageThumbnailPluginProps {
  PageThumbnail: React.ReactElement;
}

const pageThumbnailPlugin = (props: PageThumbnailPluginProps): Plugin => {
  const { PageThumbnail } = props;

  return {
    renderViewer: (renderProps: RenderViewer) => {
      const { slot } = renderProps;

      slot.children = PageThumbnail;

      // Reset the sub slot if it exists
      if (slot.subSlot) {
        slot.subSlot.attrs = {};
        slot.subSlot.children = <></>;
      }

      return slot;
    },
  };
};

const EPaperThumbnail: React.FC<EPaperThumbnailProps> = ({
  pdfUrl,
  width = 280,
  height = 380,
  className = "",
}) => {
  const [error, setError] = useState(false);

  const thumbnailPluginInstance = thumbnailPlugin();
  const { Cover } = thumbnailPluginInstance;

  const pageThumbnailPluginInstance = pageThumbnailPlugin({
    PageThumbnail: <Cover getPageIndex={() => 0} width={width} />,
  });

  const handleLoadError = (e: any) => {
    console.error("Error loading PDF thumbnail:", pdfUrl, e);
    setError(true);
  };

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-muted/30 ${className}`}
        style={{ width, height }}
      >
        <FileText className="h-12 w-12 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <div
          style={{
            width: "100%",
            minWidth: `280px`,
            height: `${height}px`,
            backgroundColor: "transparent",
          }}
          className="overflow-hidden"
        >
          <Viewer
            fileUrl={pdfUrl}
            plugins={[pageThumbnailPluginInstance, thumbnailPluginInstance]}
            onDocumentLoad={(e) => {
              console.log("PDF loaded:", e.doc.numPages, "pages");
            }}
            // renderError={handleLoadError}
            renderLoader={(percentages: number) => (
              <div className="flex items-center justify-center bg-muted/30">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-10 max-w-fit w-full border-b-2 border-primary mx-0 mb-2"></div>
                  <p className="text-xs text-muted-foreground font-medium">
                    {Math.round(percentages)}%
                  </p>
                </div>
              </div>
            )}
          />
        </div>
      </Worker>
    </div>
  );
};

export default EPaperThumbnail;
