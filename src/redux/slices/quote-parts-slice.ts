import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface QuoteFile {
  id: string;
  file: File;
  fileType: "dxf" | "svg";
  name: string;
  quantity: number;
  materialCostPerUnit?: number;
  totalMaterialCost?: number;
  cuttingTime?: number; 
  cuttingCostPerUnit?: number;
  totalCuttingCost?: number;
  totalCost?: number; 
}

export interface QuotePartsState {
  files: QuoteFile[];
}

const initialState: QuotePartsState = {
  files: [],
};
const quotePartsSlice = createSlice({
  name: "quoteParts",
  initialState,
  reducers: {
    addFile: (state, action: PayloadAction<Omit<QuoteFile, "quantity">>) => {
      state.files.push({ ...action.payload, quantity: 1 });
    },
    updateFileCalculations: (
      state,
      action: PayloadAction<{
        id: string;
        materialCostPerUnit: number;
        totalMaterialCost: number;
        cuttingTime: number;
        cuttingCostPerUnit: number;
        totalCuttingCost: number;
        totalCost: number;
      }>
    ) => {
      const file = state.files.find((file) => file.id === action.payload.id);
      if (file) {
        file.materialCostPerUnit = action.payload.materialCostPerUnit;
        file.totalMaterialCost = action.payload.totalMaterialCost;
        file.cuttingTime = action.payload.cuttingTime;
        file.cuttingCostPerUnit = action.payload.cuttingCostPerUnit;
        file.totalCuttingCost = action.payload.totalCuttingCost;
        file.totalCost = action.payload.totalCost;
      }
    },
    removeFile: (state, action: PayloadAction<string>) => {
      state.files = state.files.filter((file) => file.id !== action.payload);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const file = state.files.find((file) => file.id === action.payload.id);
      if (file) {
        file.quantity = action.payload.quantity;
      }
    },
    clearFiles: (state) => {
      state.files = [];
    },
  },
});

export const {
  addFile,
  updateFileCalculations,
  removeFile,
  updateQuantity,
  clearFiles,
} = quotePartsSlice.actions;

export default quotePartsSlice.reducer;