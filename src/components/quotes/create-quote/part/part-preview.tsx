import React, { useState, useEffect, useMemo } from "react";
import QuotePlaceholderImage from "@/assets/quotes/quote-preview-placeholder.png";
import DxfViewerComponent from "../dxf-viewer"; // Your updated DxfViewer component
import * as THREE from "three";
import downloadsvg from "@/assets/icons/downlaod.svg"; // Corrected import spelling
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

interface FilePreviewProps {
  file: Blob | File | string;
  fileType: string; // Explicitly defining fileType as string
  dimensions: { width: number; height: number } | null;
  onRemovePart: () => void;
  fileName: string; // Add a prop to handle the original file name
}

const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  fileType,
  dimensions,
  onRemovePart,
  fileName, // Use the original file name
}) => {
  const [fileUrl, setFileUrl] = useState<string>("");
  const Quote = useSelector((state: RootState) => state.quoteParts);

  useEffect(() => {
    if (file instanceof File || file instanceof Blob) {
      const url = URL.createObjectURL(file);
      setFileUrl(url);

      return () => {
        URL.revokeObjectURL(url); // Revoke URL when no longer needed
      };
    } else if (typeof file === "string") {
      setFileUrl(file);
    }
  }, [file]);

  const options = useMemo(
    () => ({
      clearColor: new THREE.Color("#ffffff"),
      autoResize: true,
      sceneOptions: {
        wireframeMesh: false,
        showEdges: true,
        boundingBox: false,
        debug: true,
      },
    }),
    [],
  );

  // Memoize the rendering of DxfViewerComponent to avoid re-renders
  const DxfViewer = useMemo(() => {
    if (fileType === "dxf" || file instanceof Blob) {
      return (
        <DxfViewerComponent
          dxfUrl={fileUrl}
          options={options}
          fonts={[]}
          width={250}
          height={150}
        />
      );
    }
    return null;
  }, [fileUrl, fileType, options]);

  // Function to handle file download
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = fileUrl;
    if (fileType === "dxf") {
      link.download = `${fileName}`; // Set the download name with the correct extension
    } else {
      link.download = `${fileName}.${fileType}`; // Set the download name with the correct extension
    }
    link.click();
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex h-[180px] w-[300px] items-center justify-center rounded-xl bg-gray-100 p-2 shadow-md">
        <div className="flex h-full w-full items-center justify-center rounded-lg bg-white">
          {file instanceof File && file.type === "image/svg+xml" ? (
            <img
              src={fileUrl}
              alt="Image Preview"
              className="h-full w-full object-contain"
            />
          ) : DxfViewer ? (
            DxfViewer
          ) : (
            <img
              src={QuotePlaceholderImage}
              alt="Unsupported File"
              className="max-h-full max-w-full"
            />
          )}
        </div>
      </div>

      {dimensions && (
        <p className="mt-2 text-sm font-medium text-gray-600">
          {dimensions?.width}mm x {dimensions?.height}mm
        </p>
      )}

     
     
        <button
          className="mt-2 flex items-center text-sm font-semibold text-blue-600 hover:underline"
          onClick={handleDownload}
        >
          <img src={downloadsvg} alt="Download Icon" className="mr-2 h-4 w-4" />
          Download
        </button>
     

      {Quote.status === 'draft' && (<button
        className="mt-2 text-sm font-semibold text-red-600 hover:underline"
        onClick={onRemovePart}
      >
        Remove Part
      </button>)}

    </div>
  );
};

export default FilePreview;
