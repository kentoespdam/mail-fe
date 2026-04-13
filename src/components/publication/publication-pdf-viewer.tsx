"use client";

import {
    IconChevronLeft,
    IconChevronRight,
    IconLoader2,
    IconZoomIn,
    IconZoomOut,
    IconRotateClockwise,
} from "@tabler/icons-react";
import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "@/components/ui/button";

// Import CSS for react-pdf
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Setup worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PublicationPdfViewerProps {
    downloadUrl: string;
}

const PublicationPdfViewer = ({ downloadUrl }: PublicationPdfViewerProps) => {
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [isLoading, setIsLoading] = useState(true);
    const [scale, setScale] = useState(1);
    const [rotation, setRotation] = useState(0);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setIsLoading(false);
    };

    const changePage = (offset: number) => {
        setPageNumber((prevPageNumber) => prevPageNumber + offset);
    };

    const handleZoomIn = () => setScale((s) => s + 0.25);
    const handleZoomOut = () => setScale((s) => Math.max(0.25, s - 0.25));
    const handleRotate = () => setRotation((r) => (r + 90) % 360);

    return (
        <div className="relative flex flex-col items-center gap-4 w-full">
            {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 z-10 w-full h-full min-h-[50vh]">
                    <IconLoader2 className="size-8 animate-spin text-primary mb-4" />
                    <p className="text-sm text-muted-foreground">Memuat PDF...</p>
                </div>
            )}

            {/* Advance Toolbar */}
            {!isLoading && numPages > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-2 py-2 bg-background/95 backdrop-blur-sm rounded-lg px-4 border shadow-sm sticky top-0 z-50 transition-all">
                    <div className="flex items-center gap-1 border-r pr-2 mr-1">
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            disabled={pageNumber <= 1}
                            onClick={() => changePage(-1)}
                            className="h-8 w-8"
                            title="Halaman Sebelumnya"
                        >
                            <IconChevronLeft className="size-4" />
                        </Button>
                        <p className="text-sm font-medium min-w-[80px] text-center">
                            {pageNumber} / {numPages}
                        </p>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            disabled={pageNumber >= numPages}
                            onClick={() => changePage(1)}
                            className="h-8 w-8"
                            title="Halaman Selanjutnya"
                        >
                            <IconChevronRight className="size-4" />
                        </Button>
                    </div>

                    <div className="flex items-center gap-1 border-r pr-2 mr-1">
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={handleZoomOut}
                            disabled={scale <= 0.25}
                            className="h-8 w-8"
                            title="Perkecil"
                        >
                            <IconZoomOut className="size-4" />
                        </Button>
                        <p className="text-sm font-medium min-w-[50px] text-center">
                            {Math.round(scale * 100)}%
                        </p>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={handleZoomIn}
                            disabled={scale >= 3}
                            className="h-8 w-8"
                            title="Perbesar"
                        >
                            <IconZoomIn className="size-4" />
                        </Button>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={handleRotate}
                        className="h-8 w-8"
                        title="Putar"
                    >
                        <IconRotateClockwise className="size-4" />
                    </Button>
                </div>
            )}

            <div className="flex-1 w-full flex flex-col items-center overflow-auto min-h-0">
                <div className="shadow-lg border bg-white ring-1 ring-black/5 m-auto">
                    <Document
                        file={downloadUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading={null}
                        error={
                            <div className="p-8 text-center text-destructive">
                                Gagal memuat dokumen PDF.
                            </div>
                        }
                    >
                        <Page
                            pageNumber={pageNumber}
                            scale={scale}
                            rotate={rotation}
                            renderTextLayer={true}
                            renderAnnotationLayer={true}
                            width={typeof window !== "undefined" && window.innerWidth > 800 ? 700 : 350}
                            className="transition-transform duration-200"
                        />
                    </Document>
                </div>
            </div>
        </div>
    );
};

export default PublicationPdfViewer;
