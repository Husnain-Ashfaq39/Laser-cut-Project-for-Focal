/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/_ui/dialog";
import { fetchPartFile } from "@/services/dxf-fetcher";
import DxfViewerComponent from "@/components/quotes/create-quote/dxf-viewer";
import * as THREE from "three";

const ImagePreview: React.FC<{ fileUrl: string }> = ({ fileUrl }) => {
  const [fileURL, setFileURL] = useState<string>();
  const [fileType, setFileType] = useState<string>("");

  const handleDialogOpen = async () => {
    const file = await fetchPartFile(fileUrl);
    const fileType = file.type;

    setFileType(fileType); // Set the file type (e.g., "image/svg+xml", "application/dxf")

    const localFileURL = URL.createObjectURL(file);
    setFileURL(localFileURL);
    return;
  };

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

  const fonts = useMemo(() => [], []);

  return (
    <Dialog onOpenChange={handleDialogOpen}>
      <DialogTrigger asChild>
        <span className="cursor-pointer font-semibold text-slate-600 underline">
          Preview
        </span>
      </DialogTrigger>
      <DialogContent className="flex h-[400px] w-[400px] items-center justify-center p-10">
        <div className="flex h-[300px] w-[300px] items-center justify-center">
          {fileType === "image/svg+xml" ? (
            <img
              src={fileURL}
              alt="SVG Preview"
              className="h-full w-full object-contain"
            />
          ) : (
            <DxfViewerComponent
              dxfUrl={fileUrl}
              options={options}
              fonts={fonts}
              width={250}
              height={150}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImagePreview;
