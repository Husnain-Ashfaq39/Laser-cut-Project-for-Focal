import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFile, updateQuantity } from "@/redux/slices/quote-parts-slice";
import { RootState } from "@/redux/store";
import PartSubtotal from "./part-subtotal";
import { getSVGDimensions, SvgDimensions } from "@/utils/get-svg-dimensions";
import { getDXFDimensions } from "@/utils/get-dxf-dimensions";
import PartSettings from "./part-settings";
import FilePreview from "./part-preview";

interface FileInfo {
  id: string;
  file: File;
  quantity: number;
}

interface SheetInfo {
  width: number;
  height: number;
  price: number;
  markup: number;
}

const Part: React.FC = () => {
  const dispatch = useDispatch();
  const files = useSelector((state: RootState) => state.quoteParts.files);

  // Sheet information (dummy data)
  const sheetInfo: SheetInfo = {
    width: 1500,
    height: 3000,
    price: 70.47,
    markup: 25,
  };
  const cuttingInfo = {
    cuttingSpeed: 48000, // mm/min
    cuttingRate: 350, // $/hr
  };

  // States for each file
  const [fileDimensions, setFileDimensions] = useState<
    Record<string, SvgDimensions | null>
  >({});

  const handleRemoveFile = (fileId: string) => {
    dispatch(removeFile(fileId));
    setFileDimensions((prev) => {
      const updated = { ...prev };
      delete updated[fileId]; // Remove dimensions when file is removed
      return updated;
    });
  };

  const handleFileDimensions = (file: FileInfo) => {
    if (file.file.type === "image/svg+xml") {
      getSVGDimensions(file.file, (dimensions: SvgDimensions) => {
        setFileDimensions((prev) => ({
          ...prev,
          [file.id]: dimensions,
        }));
      });
    } else if (file.file.name.endsWith(".dxf")) {
      getDXFDimensions(file.file, (dimensions: SvgDimensions) => {
        setFileDimensions((prev) => ({
          ...prev,
          [file.id]: dimensions,
        }));
      });
    }
  };

  // Handle quantity changes and store in Redux
  const handleQuantityChange = (fileId: string, newQuantity: number) => {
    dispatch(updateQuantity({ id: fileId, quantity: newQuantity }));
  };

  useEffect(() => {
    files.forEach((file: FileInfo) => {
      handleFileDimensions(file);
    });
  }, [files]);

  return files.length > 0 ? (
    <div className="m-auto w-[90%] py-5">
      <section className="py-2">
        <h1 className="text-lg font-semibold text-black">Quote Parts</h1>
      </section>

      <section className="my-4">
        {files.map((file: FileInfo) => (
          <div
            key={file.id}
            className="mb-6 rounded-lg bg-gray-50 pt-4 shadow-md"
          >
            <div className="flex flex-row">
              <div className="mx-4 flex w-1/3 flex-col items-center">
                <FilePreview
                  file={file.file}
                  dimensions={fileDimensions[file.id]}
                  onRemoveFile={() => handleRemoveFile(file.id)}
                />
              </div>

              <div className="flex w-2/3 flex-col">
                <PartSettings
                  title={
                    file.file.name.endsWith(".dxf")
                      ? file.file.name.replace(".dxf", "")
                      : file.file.name.replace(".svg", "") || "Settings"
                  }
                  quantity={file.quantity} // Get quantity from Redux store
                  onQuantityChange={(newQuantity) =>
                    handleQuantityChange(file.id, newQuantity)
                  }
                />
              </div>
            </div>

            {fileDimensions[file.id] && (
              <PartSubtotal
                cuttingSpeed={cuttingInfo.cuttingSpeed}
                cuttingRate={cuttingInfo.cuttingRate}
                sheet={sheetInfo}
                partWidth={fileDimensions[file.id]?.width || 0}
                partHeight={fileDimensions[file.id]?.height || 0}
                file={file.file}
                fileID={file.id}
                quantity={file.quantity} // Use quantity from Redux
              />
            )}
          </div>
        ))}
      </section>
    </div>
  ) : null;
};

export default Part;
