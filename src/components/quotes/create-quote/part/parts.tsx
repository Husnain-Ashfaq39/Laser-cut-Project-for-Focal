/* eslint-disable @typescript-eslint/no-unused-vars */
// Parts.tsx

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  removeFile,
  updateQuantity,
  updateValidity,
  setCuttingTechnologies,
  setMaterials,
  PartInfo,
  applySettingsToAll, // <-- Import the new action
} from "@/redux/slices/quote-parts-slice";
import { getSVGDimensions, SvgDimensions } from "@/utils/get-svg-dimensions";
import { getDXFDimensions } from "@/utils/get-dxf-dimensions";
import { fetchDocuments } from "@/services/db-services";
import Part from "./part";
import { Button } from "@/components/_ui/button";

interface PartsProps {
  invalidParts: { id: string; missingFields: string[] }[];
  oversizedParts: string[];
  fileDimensions: Record<string, SvgDimensions>;
  setFileDimensions: React.Dispatch<
    React.SetStateAction<Record<string, SvgDimensions>>
  >;
}

const Parts: React.FC<PartsProps> = ({
  invalidParts,
  oversizedParts,
  fileDimensions,
  setFileDimensions,
}) => {
  const dispatch = useDispatch();
  const Quote = useSelector((state: RootState) => state.quoteParts);
  const parts = useSelector((state: RootState) => state.quoteParts.parts);
  const cuttingTechFetched = useSelector(
    (state: RootState) => state.quoteParts.cuttingTechnologies,
  );

  // Fetch materials and cutting technologies if not already fetched
  useEffect(() => {
    if (cuttingTechFetched.length === 0) {
      const DataFetch = async () => {
        try {
          const cuttingTechnologies = await fetchDocuments("CuttingTechs");
          const materials = await fetchDocuments("Materials");
          dispatch(setCuttingTechnologies(cuttingTechnologies));
          dispatch(setMaterials(materials));
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      DataFetch();
    }
  }, [cuttingTechFetched, dispatch]);

  const handleRemovePart = (fileId: string) => {
    dispatch(removeFile(fileId));
    setFileDimensions((prev) => {
      const updated = { ...prev };
      delete updated[fileId];
      return updated;
    });
  };

  const handleFileDimensions = (file: PartInfo) => {
    if (file.file && file.file.type === "image/svg+xml") {
      getSVGDimensions(file.file, (dimensions: SvgDimensions) => {
        setFileDimensions((prev) => ({
          ...prev,
          [file.id]: dimensions,
        }));
      });
    } else {
      getDXFDimensions(file.file, (dimensions: SvgDimensions) => {
        setFileDimensions((prev) => ({
          ...prev,
          [file.id]: dimensions,
        }));
      });
    }
  };

  const handleQuantityChange = (fileId: string, newQuantity: number) => {
    dispatch(updateQuantity({ id: fileId, quantity: newQuantity }));
  };

  const handlePartValidityChange = (fileId: string, newIsValid: boolean) => {
    dispatch(updateValidity({ id: fileId, isValid: newIsValid }));
  };

  useEffect(() => {
    parts.forEach((file: PartInfo) => handleFileDimensions(file));
  }, [parts]);

  // **New Logic Starts Here**

  // Find all valid parts
  const validParts = parts.filter((part) => part.isValid);
  // Determine if the button should be enabled
  const canApplyToAll =
    validParts.length > 0 && parts.length > validParts.length;

  // Select the first valid part as the source
  const sourcePart = validParts[0];

  const handleApplyToAll = () => {
    if (sourcePart) {
      dispatch(applySettingsToAll({ sourceId: sourcePart.id }));
    }
  };

  // **New Logic Ends Here**

  return (
    <div className="m-auto w-[90%] py-5">
      {parts.length ? (
  <>
    <section className="py-2 flex items-center justify-between">
      <h1 className="text-lg font-semibold text-black">Quote Parts</h1>
      
      {Quote.status === "draft" && Quote.parts.length !== 0 && (
        <Button
          onClick={handleApplyToAll}
          variant="default"
          className="rounded-full bg-black px-6 py-2 text-white hover:bg-gray-900"
        >
          Apply to All Parts
        </Button>
      )}
    </section>
  </>
) : null}


    
      

      <section className="my-4">
        {parts.map((file) => {
          const partValidation = invalidParts.find((p) => p.id === file.id);
          const isOversized = oversizedParts.includes(file.id);
          return (
            <Part
              key={file.id}
              file={file}
              dimensions={fileDimensions[file.id]}
              missingFields={partValidation?.missingFields || []}
              isOversized={isOversized}
              onRemovePart={handleRemovePart}
              onQuantityChange={handleQuantityChange}
              onValidityChange={handlePartValidityChange}
            />
          );
        })}
      </section>
    </div>
  );
};

export default Parts;
