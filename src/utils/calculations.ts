interface SheetInfo {
  width: number;
  height: number;
  price: number;
  markup: number;
}

// Function to calculate material cost based on part dimensions and sheet info
export const calculateMaterialCost = (
  partArea: number,
  sheetArea: number,
  sheetPrice: number,
  sheetMarkup: number,
): number => {
  // Calculate the cost of the material based on the area of the part and the markup
  const percentageUsed = partArea / sheetArea;
  const baseMaterialCost = percentageUsed * sheetPrice;
  const materialCostWithMarkup = baseMaterialCost * (1 + sheetMarkup / 100);
  return parseFloat(materialCostWithMarkup.toFixed(2));
};
