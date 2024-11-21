import React from "react";
import PartPreview from "./part-preview";
import PartSettings from "./part-settings";
import PartSubtotal from "./part-subtotal";
import { SvgDimensions } from "@/utils/get-svg-dimensions";
import { PartInfo } from "@/redux/slices/quote-parts-slice";

interface PartProps {
  file: PartInfo;
  dimensions: SvgDimensions | null;
  missingFields: string[];
  isOversized: boolean;
  onRemovePart: (id: string) => void;
  onQuantityChange: (id: string, quantity: number) => void;
  onValidityChange: (id: string, isValid: boolean) => void;
}

const Part: React.FC<PartProps> = ({
  file,
  dimensions,
  onRemovePart,
  isOversized,
  onQuantityChange,
  onValidityChange,
  missingFields,
}) => {
  // Conditional border style for error
  const partContainerStyle =
    missingFields.length || isOversized
      ? "mb-6 rounded-lg bg-gray-50 pt-4 shadow-md border border-red-500"
      : "mb-6 rounded-lg bg-gray-50 pt-4 shadow-md";

  return (
    <div className={partContainerStyle}>
      <div className="flex flex-row">
        <div className="mx-4 flex w-1/3 flex-col items-center">
          <PartPreview
            file={file.file}
            fileType={file.fileType}
            dimensions={dimensions}
            onRemovePart={() => onRemovePart(file.id)}
            fileName={file.name}
          />
        </div>
        <div className="flex w-2/3 flex-col">
          <PartSettings
            title={
              file.file?.name?.endsWith(".dxf")
                ? file.file.name?.replace(".dxf", "") || "DXF File"
                : file.file?.type === "image/svg+xml"
                  ? file.file.name.replace(".svg", "") || "SVG File"
                  : "Settings"
            }
            quantity={file.quantity}
            fileId={file.id}
            onQuantityChange={(newQuantity) =>
              onQuantityChange(file.id, newQuantity)
            }
            onValidityChange={(isValid) =>
              onValidityChange(file.id, Boolean(isValid))
            }
            partDimensions={dimensions}
          />
        </div>
      </div>
      <PartSubtotal
        partWidth={dimensions?.width || 0}
        partHeight={dimensions?.height || 0}
        file={file.file}
        part={file}
        fileID={file.id}
        quantity={file.quantity}
      />
    </div>
  );
};

export default Part;
