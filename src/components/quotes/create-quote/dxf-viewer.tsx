import { useDxfViewer } from "@/hooks/useDxfViewer";
import React, { useEffect, useState } from "react";

interface DxfViewerComponentProps {
  dxfUrl: string;
  fonts?: string[];
  options?: any;
  width: number;
  height: number;
}

const DxfViewerComponent: React.FC<DxfViewerComponentProps> = ({
  dxfUrl,
  fonts = [],
  options = {},
  width,
  height,
}) => {
  const { loadDxf, renderToCanvas, isLoaded, containerRef, initializeViewer } =
    useDxfViewer(options);

  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize the viewer only once
  useEffect(() => {
    if (!isInitialized) {
      initializeViewer();
      setIsInitialized(true);
    }
  }, [initializeViewer, isInitialized]);

  // Load the DXF file whenever the URL changes
  useEffect(() => {
    if (dxfUrl && isInitialized) {
      loadDxf(dxfUrl, fonts)
        .then(() => {
          setError(null); // Clear any previous errors
        })
        .catch((err) => {
          console.error("Failed to load DXF:", err);
          setError(`Error loading DXF: ${err.message || err}`);
        });
    }
  }, [dxfUrl, fonts, loadDxf, isInitialized]);

  // Render the DXF to canvas once it's loaded
  useEffect(() => {
    if (isLoaded) {
      renderToCanvas();
    }
  }, [isLoaded, renderToCanvas]);

  return (
    <div ref={containerRef} className="flex h-full w-full flex-col">
      {!isLoaded && !error && (
        <div className="mt-5 items-center justify-center text-center">
          Loading...
        </div>
      )}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default DxfViewerComponent;
