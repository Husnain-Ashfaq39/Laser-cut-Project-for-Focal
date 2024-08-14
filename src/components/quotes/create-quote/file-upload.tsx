import { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";
import FileImportImage from "@/assets/quotes/upload-dfx-file.png";

const FileUpload: FunctionComponent = () => {
  const navigate = useNavigate();
  return (
    <div className="m-auto w-[60%] pt-5">
      <h2 className="py-2 font-body text-md font-bold">Upload 2D parts</h2>
      <div className="m-auto mt-2 flex h-[400px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-100">
        <div>
          <img src={FileImportImage} className="h-[45px] w-[45px]" />
        </div>
        <h3 className="font-body font-bold p-2">Select file to upload</h3>
        <p className="text-gray-400 text-center">
          2D parts only, as DXF or DWG
          <br />
          Files should only contain the cut path of your parts (no borders, side
          views, fold lines, etc)
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
  );
};

export default FileUpload;
