import React, { useState, useEffect } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import clocksvg from "@/assets/clock.svg";
import dollarsvg from "@/assets/dollar.svg";
import { calculateMaterialCost } from "@/utils/calculations";
import { calculateSvgCuttingDistance } from "@/utils/calculate-svg-cutting-distance";
import { calculateDxfCuttingDistance } from "@/utils/calculate-dxf-cutting-distance";
import { formatCuttingTime } from "@/utils/format-cutting-time";
import { useDispatch } from "react-redux";
import { updateFileCalculations } from "@/redux/slices/quote-parts-slice";

interface PartSubtotalProps {
  sheet: {
    price: number;
    width: number;
    height: number;
    markup: number;
  };
  partWidth: number;
  partHeight: number;
  file: File;
  fileID: string;
  quantity: number;
  cuttingRate: number; // Cutting rate in $/hour
  cuttingSpeed: number; // Cutting speed in mm/min
}

const PartSubtotal: React.FC<PartSubtotalProps> = ({
  sheet,
  partWidth,
  partHeight,
  file,
  fileID,
  quantity,
  cuttingRate,
  cuttingSpeed,
}) => {
  const dispatch = useDispatch();

  const [showDetails, setShowDetails] = useState(false);
  const [materialCostPerUnit, setMaterialCostPerUnit] = useState(0);
  const [totalMaterialCost, setTotalMaterialCost] = useState(0);
  const [percentageOfSheetUsed, setPercentageOfSheetUsed] = useState(0);
  const [cuttingDistance, setCuttingDistance] = useState(0);
  const [cuttingTime, setCuttingTime] = useState(0); // Time in seconds
  const [cuttingCostPerUnit, setCuttingCostPerUnit] = useState(0);
  const [totalCuttingCost, setTotalCuttingCost] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    const sheetArea = sheet.width * sheet.height;
    const partArea = partWidth * partHeight;

    // Calculate percentage of sheet used
    const percentageUsed = (partArea / sheetArea) * 100;
    setPercentageOfSheetUsed(percentageUsed);

    // Calculate material cost
    const materialCost = calculateMaterialCost(
      partArea,
      sheetArea,
      sheet.price,
      sheet.markup,
    );
    setMaterialCostPerUnit(materialCost);
    setTotalMaterialCost(materialCost * quantity);

    // Read file and calculate cutting distance
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;

      let distance = 0;
      if (file.type === "image/svg+xml") {
        distance = calculateSvgCuttingDistance(content); // in mm
      } else if (file.name.endsWith(".dxf")) {
        distance = calculateDxfCuttingDistance(content); // in mm
      }

      setCuttingDistance(distance);

      // Cutting time in seconds (distance/speed in mm/s)
      const cuttingTimeInSeconds = (distance / cuttingSpeed) * 60;
      setCuttingTime(cuttingTimeInSeconds);

      // Cutting cost per unit: (cutting time in hours) * rate
      const cuttingCost = (cuttingTimeInSeconds / 3600) * cuttingRate * 10;
      const totalCuttingCost = cuttingCost * quantity;
      setCuttingCostPerUnit(cuttingCost);
      setTotalCuttingCost(cuttingCost * quantity);

      setTotalCost(totalMaterialCost + totalCuttingCost);

      // Correctly dispatch using file.id, not file.name
      dispatch(
        updateFileCalculations({
          id: fileID, // Use the unique file ID
          materialCostPerUnit: materialCost,
          totalMaterialCost,
          cuttingTime: cuttingTimeInSeconds,
          cuttingCostPerUnit: cuttingCost,
          totalCuttingCost,
          totalCost,
        }),
      );
    };

    reader.readAsText(file);
  }, [sheet, partWidth, partHeight, file, quantity, cuttingRate, cuttingSpeed]);

  return (
    <div className="pt-4">
      {/* Toggle Icon for Details */}
      <div className="mb-2 flex justify-end pr-5">
        <button
          className="text-blue-500 hover:text-blue-700"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? (
            <ChevronUpIcon className="h-5 w-5" />
          ) : (
            <ChevronDownIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      {showDetails && (
        <div className="px-10 pb-4">
          <hr className="mx-5 my-4 border-t border-gray-300" />

          {/* Material Column */}
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="font-bold">Material</span>
              <div>
                <span className="font-semibold">Full Sheet Cost:</span> $
                {sheet.price.toFixed(2)}
              </div>
              <div>
                <span className="font-semibold">Markup:</span> {sheet.markup}%
              </div>
              <div>
                <span className="font-semibold">Percentage of Sheet Used:</span>{" "}
                {percentageOfSheetUsed.toFixed(2)}%
              </div>
              <div>
                <span className="font-semibold">Material Cost per Unit:</span> $
                {materialCostPerUnit.toFixed(2)}
              </div>
              <div>
                <span className="font-semibold">Total Material Price:</span> $
                {totalMaterialCost.toFixed(2)}
              </div>
            </div>

            {/* Cutting Column */}
            <div className="space-y-2">
              <span className="font-bold">Cutting</span>
              <div>
                <span className="font-semibold">Cutting Rate:</span> $
                {cuttingRate.toFixed(2)}/hour
              </div>
              <div>
                <span className="font-semibold">Cutting Speed:</span>{" "}
                {cuttingSpeed.toFixed(2)} mm/min
              </div>
              <div>
                <span className="font-semibold">Cutting Time per Unit:</span>{" "}
                {cuttingTime.toFixed(2)} seconds
              </div>
              <div>
                <span className="font-semibold">Cutting Cost per Unit:</span> $
                {cuttingCostPerUnit.toFixed(2)}
              </div>
              <div>
                <span className="font-semibold">Total Cutting Cost:</span> $
                {totalCuttingCost.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Total Cost and Cutting Time */}
      <div className="flex justify-end space-x-16 rounded-md bg-black p-4 text-white">
        {/* Total Cutting Time */}
        <div className="flex items-center space-x-2">
          <img src={clocksvg} alt="Clock Icon" className="h-5 w-5" />
          <span className="font-semibold">
            {formatCuttingTime(cuttingTime * quantity)}
          </span>
        </div>

        {/* Total Cost */}
        <div className="flex items-center space-x-2">
          <img src={dollarsvg} alt="Dollar Icon" className="h-5 w-5" />
          <span className="font-semibold">
            Total Cost: ${totalCost.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PartSubtotal;
