// "use client";

// import React, { useState, useCallback, useEffect } from "react";
// import dynamic from "next/dynamic";
// import {
//   ChevronLeft,
//   ChevronRight,
//   ZoomIn,
//   ZoomOut,
//   Download,
//   Home,
//   RotateCw,
//   Menu,
//   X,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";

// // Dynamically import react-pdf to avoid SSR issues
// const Document = dynamic(
//   () => import("react-pdf").then((mod) => mod.Document),
//   { ssr: false }
// );

// const Page = dynamic(() => import("react-pdf").then((mod) => mod.Page), {
//   ssr: false,
// });

// interface EnhancedPDFViewerProps {
//   pdfUrl: string;
//   title: string;
//   onClose?: () => void;
// }

// const EnhancedPDFViewer: React.FC<EnhancedPDFViewerProps> = ({
//   pdfUrl,
//   title,
//   onClose,
// }) => {
//   const [numPages, setNumPages] = useState<number>(0);
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [scale, setScale] = useState<number>(1);
//   const [rotation, setRotation] = useState<number>(0);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>("");
//   const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
//   const [isMobile, setIsMobile] = useState<boolean>(false);
//   const [isClient, setIsClient] = useState<boolean>(false);

//   // Check if mobile/tablet on mount
//   useEffect(() => {
//     setIsClient(true);
//     const checkMobile = () => {
//       const width = window.innerWidth;
//       setIsMobile(width < 1024); // Close sidebar by default on screens < 1024px
//       setIsSidebarOpen(width >= 1024); // Open by default on desktop
//     };

//     checkMobile();
//     window.addEventListener("resize", checkMobile);

//     // Set up PDF.js worker on client side only
//     import("react-pdf").then((pdfjs) => {
//       pdfjs.pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.pdfjs.version}/build/pdf.worker.min.mjs`;
//     });

//     return () => window.removeEventListener("resize", checkMobile);
//   }, []);

//   const onDocumentLoadSuccess = useCallback(
//     ({ numPages }: { numPages: number }) => {
//       setNumPages(numPages);
//       setIsLoading(false);
//       setError("");
//     },
//     []
//   );

//   const onDocumentLoadError = useCallback((error: Error) => {
//     console.error("Error loading PDF:", error);
//     setError("Failed to load PDF document");
//     setIsLoading(false);
//   }, []);

//   const goToPage = useCallback(
//     (pageNum: number) => {
//       if (pageNum >= 1 && pageNum <= numPages) {
//         setCurrentPage(pageNum);
//         // Close sidebar on mobile after page selection
//         if (isMobile) {
//           setIsSidebarOpen(false);
//         }
//       }
//     },
//     [numPages, isMobile]
//   );

//   const nextPage = useCallback(() => {
//     goToPage(currentPage + 1);
//   }, [currentPage, goToPage]);

//   const prevPage = useCallback(() => {
//     goToPage(currentPage - 1);
//   }, [currentPage, goToPage]);

//   const zoomIn = useCallback(() => {
//     setScale((prev) => Math.min(prev + 0.2, 3));
//   }, []);

//   const zoomOut = useCallback(() => {
//     setScale((prev) => Math.max(prev - 0.2, 0.5));
//   }, []);

//   const rotate = useCallback(() => {
//     setRotation((prev) => (prev + 90) % 360);
//   }, []);

//   const toggleSidebar = useCallback(() => {
//     setIsSidebarOpen((prev) => !prev);
//   }, []);

//   const handleKeyDown = useCallback(
//     (e: KeyboardEvent) => {
//       switch (e.key) {
//         case "ArrowLeft":
//           e.preventDefault();
//           prevPage();
//           break;
//         case "ArrowRight":
//           e.preventDefault();
//           nextPage();
//           break;
//         case "+":
//         case "=":
//           e.preventDefault();
//           zoomIn();
//           break;
//         case "-":
//           e.preventDefault();
//           zoomOut();
//           break;
//       }
//     },
//     [nextPage, prevPage, zoomIn, zoomOut]
//   );

//   useEffect(() => {
//     document.addEventListener("keydown", handleKeyDown);
//     return () => document.removeEventListener("keydown", handleKeyDown);
//   }, [handleKeyDown]);

//   // Don't render on server
//   if (!isClient) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-900 flex items-center justify-center">
//         <div className="text-center text-white">
//           <h2 className="text-xl font-bold mb-4">Error Loading PDF</h2>
//           <p className="text-gray-300 mb-6">{error}</p>
//           <Button onClick={onClose} variant="outline">
//             <Home className="h-4 w-4 mr-2" />
//             Back to Home
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col">
//       {/* Header */}
//       <div className="bg-white shadow-sm p-4 flex items-center justify-between border-b z-10">
//         <div className="flex items-center space-x-2 md:space-x-4">
//           <Button
//             onClick={toggleSidebar}
//             variant="ghost"
//             size="sm"
//             className="lg:hidden"
//           >
//             {isSidebarOpen ? (
//               <X className="h-4 w-4" />
//             ) : (
//               <Menu className="h-4 w-4" />
//             )}
//           </Button>
//           <Button
//             onClick={toggleSidebar}
//             variant="ghost"
//             size="sm"
//             className="hidden lg:flex"
//           >
//             <Menu className="h-4 w-4 mr-2" />
//             Pages
//           </Button>
//           <Button onClick={onClose} variant="ghost" size="sm">
//             <Home className="h-4 w-4 mr-2" />
//             Home
//           </Button>
//           <div className="hidden sm:block">
//             <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
//             <p className="text-sm text-gray-600">
//               Page {currentPage} of {numPages}
//             </p>
//           </div>
//         </div>

//         <div className="flex items-center space-x-1 md:space-x-2">
//           <Button
//             onClick={zoomOut}
//             variant="ghost"
//             size="sm"
//             disabled={scale <= 0.5}
//             title="Zoom Out"
//           >
//             <ZoomOut className="h-4 w-4" />
//           </Button>
//           <span className="text-xs md:text-sm px-1 md:px-2 min-w-[50px] md:min-w-[60px] text-center">
//             {Math.round(scale * 100)}%
//           </span>
//           <Button
//             onClick={zoomIn}
//             variant="ghost"
//             size="sm"
//             disabled={scale >= 3}
//             title="Zoom In"
//           >
//             <ZoomIn className="h-4 w-4" />
//           </Button>
//           <Button onClick={rotate} variant="ghost" size="sm" title="Rotate">
//             <RotateCw className="h-4 w-4" />
//           </Button>
//           <Button variant="ghost" size="sm" className="hidden sm:flex">
//             <Download className="h-4 w-4 mr-2" />
//             Download
//           </Button>
//         </div>
//       </div>

//       <div className="flex flex-1 overflow-hidden">
//         {/* Sidebar with thumbnails */}
//         <div
//           className={`${
//             isSidebarOpen ? "translate-x-0" : "-translate-x-full"
//           } fixed lg:relative inset-y-0 left-0 z-20 w-64 bg-white border-r shadow-lg lg:shadow-none transition-transform duration-300 ease-in-out flex flex-col`}
//           style={{ top: "73px" }} // Adjust based on header height
//         >
//           <div className="p-4 border-b">
//             <div className="flex items-center justify-between">
//               <h2 className="font-semibold text-gray-900">Pages</h2>
//               <Button
//                 onClick={toggleSidebar}
//                 variant="ghost"
//                 size="sm"
//                 className="lg:hidden"
//               >
//                 <X className="h-4 w-4" />
//               </Button>
//             </div>
//             <p className="text-xs text-gray-500 mt-1">
//               {numPages} {numPages === 1 ? "page" : "pages"}
//             </p>
//           </div>

//           <div className="flex-1 overflow-y-auto p-4 space-y-4">
//             {isLoading ? (
//               <div className="text-center py-8">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
//                 <p className="text-sm text-gray-500 mt-2">Loading pages...</p>
//               </div>
//             ) : (
//               Array.from({ length: numPages }, (_, index) => (
//                 <div
//                   key={index}
//                   onClick={() => goToPage(index + 1)}
//                   className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
//                     currentPage === index + 1
//                       ? "border-primary shadow-lg ring-2 ring-primary/20"
//                       : "border-gray-200 hover:border-gray-300 hover:shadow-md"
//                   }`}
//                 >
//                   <div className="bg-white">
//                     <Document
//                       file={pdfUrl}
//                       loading=""
//                       error=""
//                     >
//                       <Page
//                         pageNumber={index + 1}
//                         width={200}
//                         renderTextLayer={false}
//                         renderAnnotationLayer={false}
//                         loading=""
//                         error=""
//                       />
//                     </Document>
//                   </div>
//                   <div
//                     className={`p-2 text-center text-sm font-medium ${
//                       currentPage === index + 1
//                         ? "bg-primary text-primary-foreground"
//                         : "bg-gray-50 text-gray-700"
//                     }`}
//                   >
//                     Page {index + 1}
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>

//         {/* Overlay for mobile */}
//         {isSidebarOpen && isMobile && (
//           <div
//             className="fixed inset-0 bg-black/50 z-10 lg:hidden"
//             onClick={toggleSidebar}
//             style={{ top: "73px" }}
//           />
//         )}

//         {/* PDF Viewer */}
//         <div className="flex-1 overflow-auto bg-gray-200 p-4">
//           <div className="flex justify-center">
//             <div className="bg-white shadow-lg">
//               {isLoading && (
//                 <div className="w-[600px] h-[800px] flex items-center justify-center">
//                   <div className="text-center">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
//                     <p className="text-gray-600">Loading PDF...</p>
//                   </div>
//                 </div>
//               )}

//               <Document
//                 file={pdfUrl}
//                 onLoadSuccess={onDocumentLoadSuccess}
//                 onLoadError={onDocumentLoadError}
//                 loading=""
//                 error=""
//               >
//                 <Page
//                   pageNumber={currentPage}
//                   scale={scale}
//                   rotate={rotation}
//                   loading=""
//                   error=""
//                   renderTextLayer={false}
//                   renderAnnotationLayer={false}
//                 />
//               </Document>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Navigation Controls */}
//       <div className="bg-white border-t p-4 flex items-center justify-center space-x-4">
//         <Button
//           onClick={prevPage}
//           variant="outline"
//           size="sm"
//           disabled={currentPage <= 1}
//         >
//           <ChevronLeft className="h-4 w-4 mr-2" />
//           <span className="hidden sm:inline">Previous</span>
//         </Button>

//         <div className="flex items-center space-x-2">
//           <input
//             type="number"
//             value={currentPage}
//             onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
//             min={1}
//             max={numPages}
//             className="w-12 md:w-16 px-2 py-1 border rounded text-center text-sm"
//           />
//           <span className="text-sm text-gray-600">of {numPages}</span>
//         </div>

//         <Button
//           onClick={nextPage}
//           variant="outline"
//           size="sm"
//           disabled={currentPage >= numPages}
//         >
//           <span className="hidden sm:inline">Next</span>
//           <ChevronRight className="h-4 w-4 ml-2" />
//         </Button>
//       </div>

//       {/* Instructions */}
//       <div className="bg-gray-50 border-t px-4 py-2 text-center hidden sm:block">
//         <p className="text-xs text-gray-500">
//           Use arrow keys to navigate • + / - to zoom • Click thumbnails to jump
//           to page
//         </p>
//       </div>
//     </div>
//   );
// };

// export default EnhancedPDFViewer;
