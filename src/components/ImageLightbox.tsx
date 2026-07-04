"use client";

import React, { useState, useEffect } from 'react';
import { X, Download, Share2, ZoomIn, ZoomOut, RotateCw, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  imageAlt: string;
  title?: string;
  allowDownload?: boolean;
  allowSharing?: boolean;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({
  isOpen,
  onClose,
  imageSrc,
  imageAlt,
  title,
  allowDownload = true,
  allowSharing = true,
}) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Reset zoom and position when opening
      setZoom(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleDownload = async () => {
    try {
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = title || 'image';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: title || 'Image from The Cliff News',
      text: `Check out this image: ${title || 'Image from The Cliff News'}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback to copying URL to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={onClose}
      />

      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        {allowDownload && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleDownload}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20"
          >
            <Download className="h-4 w-4" />
          </Button>
        )}
        {allowSharing && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleShare}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="secondary"
          size="sm"
          onClick={onClose}
          className="bg-white/10 hover:bg-white/20 text-white border-white/20"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex gap-2 bg-white/10 rounded-lg p-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleZoomOut}
          disabled={zoom <= 0.5}
          className="bg-white/10 hover:bg-white/20 text-white border-white/20"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="text-white px-2 py-1 text-sm min-w-[60px] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleZoomIn}
          disabled={zoom >= 3}
          className="bg-white/10 hover:bg-white/20 text-white border-white/20"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleRotate}
          className="bg-white/10 hover:bg-white/20 text-white border-white/20"
        >
          <RotateCw className="h-4 w-4" />
        </Button>
        {zoom > 1 && (
          <div className="flex items-center text-white text-xs px-2">
            <Move className="h-3 w-3 mr-1" />
            Drag to pan
          </div>
        )}
      </div>

      {/* Image Container */}
      <div className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center">
        <img
          src={imageSrc}
          alt={imageAlt}
          className={`max-w-full max-h-full object-contain transition-transform duration-200 ${
            zoom > 1 ? 'cursor-move' : 'cursor-zoom-in'
          }`}
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
            transformOrigin: 'center center',
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={zoom === 1 ? handleZoomIn : undefined}
          draggable={false}
        />
      </div>

      {/* Title */}
      {title && (
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-10 bg-black/50 text-white px-4 py-2 rounded-lg text-center max-w-[80vw]">
          <h3 className="font-semibold">{title}</h3>
        </div>
      )}
    </div>
  );
};

export default ImageLightbox;