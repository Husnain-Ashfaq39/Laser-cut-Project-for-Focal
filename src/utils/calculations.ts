// Function to calculate material cost based on part dimensions and sheet info
export const calculateMaterialCost = (
  partArea: number,
  sheetArea: number,
  sheetPrice: number,
  sheetMarkup: number,
): number => {
  const percentageUsed = partArea / sheetArea;
  const baseMaterialCost = percentageUsed * sheetPrice;
  const materialCostWithMarkup = baseMaterialCost * (1 + sheetMarkup / 100);
  return parseFloat(materialCostWithMarkup.toFixed(2));
};
