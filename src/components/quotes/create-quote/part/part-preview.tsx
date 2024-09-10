import React, { useState, useEffect } from "react";
import QuotePlaceholderImage from "@/assets/quotes/quote-preview-placeholder.png";
import DxfViewer from "../dxf-viewer";

interface FilePreviewProps {
  file: File;
  dimensions: { width: number; height: number } | null;
  onRemoveFile: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  dimensions,
  onRemoveFile,
}) => {
  const [fileUrl, setFileUrl] = useState<string>("");

  useEffect(() => {
    // Generate the object URL when the file is provided
    const url = URL.createObjectURL(file);
    setFileUrl(url);

    // Log file details to debug any issues
    console.log("File URL generated:", url);
    console.log("File type:", file.type);
    console.log("File name:", file.name);

    // Cleanup the object URL when the component unmounts
    return () => {
      console.log("Cleaning up file URL:", url);
      URL.revokeObjectURL(url); // Use the "url" reference from this effect
    };
  }, [file]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex h-[180px] w-[300px] items-center justify-center rounded-xl bg-gray-100 p-2 shadow-md">
        <div className="flex h-full w-full items-center justify-center rounded-lg bg-white">
          {file.type === "image/svg+xml" ? (
            <img
              src={fileUrl}
              alt="SVG Preview"
              className="h-full w-full object-contain"
            />
          ) : file.name.endsWith(".dxf") ? (
            <DxfViewer dxfUrl={fileUrl} />
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
          {dimensions.width}mm x {dimensions.height}mm
        </p>
      )}
      <button
        className="mt-2 text-sm font-semibold text-blue-600 hover:underline"
        onClick={onRemoveFile}
      >
        Remove Part
      </button>
    </div>
  );
};

export default FilePreview;
