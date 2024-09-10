import React, { useState } from "react";
import { useDispatch } from "react-redux";
import FileImportImage from "@/assets/quotes/upload-dfx-file.png";
import { FileUploader } from "react-drag-drop-files";
import { addFile } from "@/redux/slices/quote-parts-slice";
import { useToast } from "@/components/_ui/toast/use-toast";
import { v4 as uuidv4 } from "uuid";

const fileTypes = ["DWG", "DXF"];

const FileUpload = () => {
  const [file, setFile] = useState<string | null>(null);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const handleChange = (file: File) => {
    const url = URL.createObjectURL(file);
    setFile(url);

    const fileData = {
      id: uuidv4(), // Generate a unique string ID
      name: file.name,
      file,
      fileType: "dxf" as const,
    };

    dispatch(addFile(fileData));

    // Show the toast notification
    toast({
      variant: "default",
      title: `${fileData.name} Added Successfully!`,
      description: "You have successfully added your part.",
      duration: 5000,
    });
  };

  return (
    <div className="m-auto w-[60%] pt-5">
      <h2 className="text-md py-2 font-body font-bold">Upload 2D parts</h2>
      <FileUploader handleChange={handleChange} name="file" types={fileTypes}>
        <div className="m-auto mt-2 flex h-[400px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-100">
          <div className="flex flex-col items-center">
            <div>
              <img src={FileImportImage} className="h-[45px] w-[45px]" />
            </div>
            <h3 className="p-2 font-body font-bold">Select file to upload</h3>
            <p className="text-center text-gray-400">
              2D parts only, as DXF or DWG
              <br />
              Files should only contain the cut path of your parts (no borders,
              side views, fold lines, etc)
              <br />
              Parts should be scaled to their true size, 1:1
              <br />
              Files should not contain any Z-coordinates
              <br />
              Parts should be enclosed without open outers
              <br />
              Convert all text to shapes/outlines
              <br />
              Shapes and text should be connected with bridges
            </p>
          </div>
        </div>
      </FileUploader>
    </div>
  );
};

export default FileUpload;
