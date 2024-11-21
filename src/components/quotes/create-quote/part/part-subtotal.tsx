import React, { useState, useEffect } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { useDispatch } from "react-redux";
import { updateFileCalculations } from "@/redux/slices/quote-parts-slice";
import { getRateTableData, getMaterialSheetData } from "@/services/db-services";
import { calculateMaterialCost } from "@/utils/calculations";
import { calculateSvgCuttingDistance } from "@/utils/calculate-svg-cutting-distance";
import { calculateDxfCuttingDistance } from "@/utils/calculate-dxf-cutting-distance";
import { formatCuttingTime } from "@/utils/format-cutting-time";
import clocksvg from "@/assets/icons/clock.svg";
import dollarsvg from "@/assets/icons/dollar.svg";

interface PartSubtotalProps {
  partWidth: number;
  partHeight: number;
  file: File;
  part: any;
  fileID: string;
  quantity: number;
}

interface Sheet {
  width: number;
  height: number;
  price: number;
  markup: number;
}

const PartSubtotal: React.FC<PartSubtotalProps> = ({
  partWidth,
  partHeight,
  file,
  part,
  fileID,
  quantity,
}) => {
  const dispatch = useDispatch();
  const [showDetails, setShowDetails] = useState(false);
  const [sheet, setSheet] = useState<Sheet>({
    width: 0,
    height: 0,
    price: 0,
    markup: 0,
  });
  const [cuttingRate, setCuttingRate] = useState(0);
  const [materialCost, setMaterialCost] = useState({ unit: 0, total: 0 });
  const [cuttingSpeed, setCuttingSpeed] = useState(0);
  const [cuttingCost, setCuttingCost] = useState({
    distance: 0,
    time: 0,
    perUnit: 0,
    total: 0,
  });
  const [percentageUsed, setPercentageUsed] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (part.material?.id && part.cuttingTechnology?.id && part.thickness) {
        try {
          const { rate, speed } = await getRateTableData(
            part.material.id,
            part.cuttingTechnology.id,
            part.thickness,
          );

          const sheetData = await getMaterialSheetData(
            part.material.id,
            part.thickness,
            part.size,
          );

          setCuttingRate(rate);
          setCuttingSpeed(speed);
          setSheet({
            width: sheetData.width,
            height: sheetData.height,
            price: sheetData.sheetCost,
            markup: sheetData.appliedMarkup,
          });
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [
    part.material?.id,
    part.cuttingTechnology?.id,
    part.thickness,
    part.size,
  ]);

  // Update material cost based on the selected sheet
  useEffect(() => {
    const sheetArea = sheet.width * sheet.height;
    const partArea = partWidth * partHeight;
    const usedPercentage = (partArea / sheetArea) * 100;
    setPercentageUsed(usedPercentage);

    const unitCost = calculateMaterialCost(
      partArea,
      sheetArea,
      sheet.price,
      sheet.markup,
    );
    setMaterialCost({ unit: unitCost, total: unitCost * quantity });
  }, [sheet, partWidth, partHeight, quantity]);

  // Calculate cutting cost when the file content changes
  const calculateCuttingCost = async () => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const cuttingDistance =
        file.type === "image/svg+xml"
          ? calculateSvgCuttingDistance(content)
          : calculateDxfCuttingDistance(content);

      const timeInSeconds = (cuttingDistance / cuttingSpeed) * 3600;
      const perUnitCost = (timeInSeconds / 3600) * cuttingRate;
      setCuttingCost({
        distance: cuttingDistance,
        time: timeInSeconds,
        perUnit: perUnitCost,
        total: perUnitCost * quantity,
      });
    };
    reader.readAsText(file);
  };

  // Recalculate cutting cost whenever relevant data changes
  useEffect(() => {
    calculateCuttingCost();
  }, [file, cuttingRate, cuttingSpeed, quantity]);

  // Calculate total cost based on updated material and cutting costs
  useEffect(() => {
    const totalCostCalculated = materialCost.total + cuttingCost.total;
    setTotalCost(totalCostCalculated);

    // Dispatch updated data
    dispatch(
      updateFileCalculations({
        id: fileID,
        materialCostPerUnit: materialCost.unit,
        totalMaterialCost: materialCost.total,
        sheetUsedPerc: parseFloat(Number(percentageUsed || 0).toFixed(2)),
        cuttingTime: cuttingCost.time,
        cuttingCostPerUnit: cuttingCost.perUnit,
        totalCuttingCost: cuttingCost.total,
        totalCost: totalCostCalculated,
        appliedMarkup: sheet.markup,
      }),
    );
  }, [materialCost, cuttingCost, percentageUsed, dispatch, fileID]);

  return (
    <div className="pt-4">
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
          <div className="mb-4 grid grid-cols-2 gap-4">
            {/* Material Cost Column */}
            {!part.isCustomerSupplied && (
              <div className="space-y-2">
                <span className="font-bold">Material</span>
                <div>Full Sheet Cost: ${sheet.price.toFixed(2)}</div>
                <div>Markup: {sheet.markup.toFixed(2)}%</div>
                <div>Sheet Used: {percentageUsed.toFixed(2)}%</div>
                <div>
                  Material Cost per Unit: ${materialCost.unit.toFixed(2)}
                </div>
                <div>Total Material Cost: ${materialCost.total.toFixed(2)}</div>
              </div>
            )}
            {/* Cutting Cost Column */}
            <div className="space-y-2">
              <span className="font-bold">Cutting</span>
              <div>Cutting Rate: ${cuttingRate.toFixed(2)}/hr</div>
              <div>Cutting Speed: {cuttingSpeed} mm/hr</div>
              <div>
                Cutting Time per Unit: {formatCuttingTime(cuttingCost.time)}
              </div>
              <div>
                Cutting Cost per Unit: ${cuttingCost.perUnit.toFixed(2)}
              </div>
              <div>Total Cutting Cost: ${cuttingCost.total.toFixed(2)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Total Summary */}
      <div className="flex justify-end space-x-16 rounded-md bg-black p-4 text-white">
        <div className="flex items-center space-x-2">
          <img src={clocksvg} alt="Clock Icon" className="h-5 w-5" />
          <span>
            {cuttingCost.time != Infinity
              ? formatCuttingTime(cuttingCost.time * quantity)
              : "00:00"}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <img src={dollarsvg} alt="Dollar Icon" className="h-5 w-5" />
          <span>Total Cost: ${totalCost ? totalCost.toFixed(2) : 0}</span>
        </div>
      </div>
    </div>
  );
};

export default PartSubtotal;
