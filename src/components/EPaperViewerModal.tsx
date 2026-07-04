"use client";

import React from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { thumbnailPlugin } from "@react-pdf-viewer/thumbnail";
import { zoomPlugin } from "@react-pdf-viewer/zoom";
import { X, Download, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

// Import styles
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/thumbnail/lib/styles/index.css";
import "@react-pdf-viewer/zoom/lib/styles/index.css";

interface EPaperViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  title: string;
}

const EPaperViewerModal: React.FC<EPaperViewerModalProps> = ({
  isOpen,
  onClose,
  pdfUrl,
  title,
}) => {
  const { theme } = useTheme();

  // Plugins
  const thumbnailPluginInstance = thumbnailPlugin();
  const { Thumbnails } = thumbnailPluginInstance;

  const zoomPluginInstance = zoomPlugin();
  const {
    ZoomIn: ZoomInButton,
    ZoomOut: ZoomOutButton,
    CurrentScale,
  } = zoomPluginInstance;

  if (!isOpen) return null;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = title + ".pdf";
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      {/* Modal Container */}
      <div className="relative w-full h-full max-w-[98vw] max-h-[98vh] bg-background rounded-lg shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
          <h2 className="text-lg font-semibold text-foreground truncate">
            {title}
          </h2>
          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 border border-border rounded-md px-2 py-1 bg-background">
              <ZoomOutButton>
                {(props) => (
                  <Button
                    onClick={props.onClick}
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    title="Zoom out"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                )}
              </ZoomOutButton>

              <CurrentScale>
                {(props) => (
                  <span className="text-sm text-muted-foreground px-2 min-w-[60px] text-center">
                    {`${Math.round(props.scale * 100)}%`}
                  </span>
                )}
              </CurrentScale>

              <ZoomInButton>
                {(props) => (
                  <Button
                    onClick={props.onClick}
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    title="Zoom in"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                )}
              </ZoomInButton>
            </div>

            <Button
              onClick={handleDownload}
              variant="ghost"
              size="sm"
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Download</span>
            </Button>
            <Button onClick={onClose} variant="ghost" size="sm">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Thumbnails */}
          <div className="hidden lg:block w-64 border-r border-border bg-muted/30 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Pages
              </h3>
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <Thumbnails />
              </Worker>
            </div>
          </div>

          {/* PDF Viewer */}
          <div className="flex-1 overflow-auto bg-muted/50 p-4">
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <Viewer
                fileUrl={pdfUrl}
                plugins={[thumbnailPluginInstance, zoomPluginInstance]}
                theme={theme === "dark" ? "dark" : "light"}
                defaultScale={0.6}
              />
            </Worker>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EPaperViewerModal;
