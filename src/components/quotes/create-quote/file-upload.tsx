import { useState } from "react";
import { useDispatch } from "react-redux";
import FileImportImage from "@/assets/quotes/upload-dfx-file.png";
import { FileUploader } from "react-drag-drop-files";
import { addFile } from "@/redux/slices/quote-parts-slice";
import { useToast } from "@/components/_ui/toast/use-toast";
import { v4 as uuidv4 } from "uuid";

const fileTypes = ["DWG", "DXF"];

const FileUpload = () => {
  const [files, setFiles] = useState<string[]>([]);
  const dispatch = useDispatch();
  const { toast } = useToast();
  screenLeft;

  const handleChange = (uploadedFiles: File | File[] | FileList) => {
    // Convert FileList to an array if necessary
    const fileArray =
      uploadedFiles instanceof File
        ? [uploadedFiles] // Single file wrapped in an array
        : Array.from(uploadedFiles); // Multiple files converted to an array

    fileArray.forEach((file) => {
      if (file instanceof File) {
        const url = URL.createObjectURL(file);
        setFiles((prevFiles) => [...prevFiles, url]);

        const fileData = {
          id: uuidv4(), // Generate a unique string ID
          name: file.name.replace(".dxf", ""),
          file,
          fileType: "dxf" as const,
          isValid: true,
          material: null,
          cuttingTechnology: null,
          quantity: 1,
        };

        dispatch(addFile(fileData)); // Attempt to add file to Redux

        // Show toast notification for each file
        toast({
          variant: "default",
          title: `${fileData.name} Added Successfully!`,
          description: "You have successfully added your part.",
          duration: 5000,
        });
      }
    });
  };

  return (
    <div className="m-auto mb-2 mt-10 w-[60%] pt-3">
      <h2 className="text-md py-2 font-body font-bold">Upload 2D parts</h2>
      <FileUploader
        handleChange={handleChange}
        name="file"
        types={fileTypes}
        multiple
      >
        <div className="m-auto mt-2 flex h-[350px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-100">
          <div className="flex flex-col items-center">
            <div>
              <img src={FileImportImage} className="h-[45px] w-[45px]" />
            </div>
            <h3 className="p-2 font-body font-bold">Select files to upload</h3>
            <p className="text-center text-gray-400">
              2D parts only, as DXF
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
