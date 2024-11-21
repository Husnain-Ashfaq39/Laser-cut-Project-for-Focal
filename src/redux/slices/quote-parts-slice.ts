// quote-parts-slice.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "@/components/_ui/toast/use-toast";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UploadedFileInfo {
  url: string;
  name: string;
}

export interface PartInfo {
  isValid: boolean;
  id: string;
  file: File | any;
  fileType: "dxf" | "svg";
  name: string;
  quantity: number;
  material: Record<string, any> | null;
  cuttingTechnology: Record<string, any>;
  thickness?: string;
  size?: {
    height: number;
    width: number;
  };
  sheetUsedPerc?: number;
  materialCostPerUnit?: number;
  totalMaterialCost?: number;
  cuttingTime?: number;
  cuttingCostPerUnit?: number;
  totalCuttingCost?: number;
  totalCost?: number;
  appliedMarkup?: number;
  extraNote?: string; // For additional notes
  uploadedFiles?: File[]; // Local uploaded File objects
  uploadedFilesInfo?: UploadedFileInfo[];
}

export interface QuotePartsState {
  id?: string;
  status?: string;
  parts: PartInfo[];
  cuttingTechnologies: any[];
  materials: any[];
  shippingOption: "pickup" | "delivery";
  shippingAddress: string;
  customQuoteID?: string;
}

const initialState: QuotePartsState = {
  id: "",
  status: "draft",
  parts: [],
  cuttingTechnologies: [],
  materials: [],
  shippingOption: "pickup", // Default to "pickup"
  shippingAddress: "",
  customQuoteID: "",
};

const quotePartsSlice = createSlice({
  name: "quoteParts",
  initialState,
  reducers: {
    addFile: (state, action: PayloadAction<PartInfo>) => {
      state.parts.push({
        ...action.payload,
        quantity: action.payload.quantity || 1, // Use provided quantity or default to 1
        extraNote: action.payload.extraNote || "",
        uploadedFiles: action.payload.uploadedFiles || [], // Initialize as an empty array
        uploadedFilesInfo: action.payload.uploadedFilesInfo || [], // Initialize as an empty array
        isValid: false, // Initialize as invalid until settings are complete
      });
    },

    updatepartsettings: (
      state,
      action: PayloadAction<{
        id: string;
        material?: Record<string, any> | null;
        cuttingTechnology?: Record<string, any>;
        thickness?: string;
        size?: {
          height: number;
          width: number;
        };
        extraNote?: string; // New field
        uploadedFiles?: File[]; // Updated to handle multiple files
      }>
    ) => {
      const file = state.parts.find((file) => file.id === action.payload.id);
      if (file) {
        if (action.payload.cuttingTechnology) {
          file.cuttingTechnology = action.payload.cuttingTechnology;
        }
        if (action.payload.material) {
          file.material = action.payload.material;
        }
        if (action.payload.thickness) {
          file.thickness = action.payload.thickness;
        }
        if (action.payload.size) {
          file.size = action.payload.size;
        }
        // Handle new fields
        if (action.payload.extraNote !== undefined) {
          file.extraNote = action.payload.extraNote;
        }
        if (action.payload.uploadedFiles !== undefined) {
          file.uploadedFiles = action.payload.uploadedFiles;
        }

        // Recalculate validity
        file.isValid =
          !!file.material &&
          !!file.thickness &&
          !!file.size &&
          !!file.cuttingTechnology;
      }
    },

    updateFileCalculations: (
      state,
      action: PayloadAction<{
        sheetUsedPerc: number;
        id: string;
        materialCostPerUnit: number;
        totalMaterialCost: number;
        cuttingTime: number;
        cuttingCostPerUnit: number;
        totalCuttingCost: number;
        totalCost: number;
        appliedMarkup: number;
      }>
    ) => {
      const file = state.parts.find((file) => file.id === action.payload.id);
      if (file) {
        file.materialCostPerUnit = action.payload.materialCostPerUnit;
        file.totalMaterialCost = action.payload.totalMaterialCost;
        file.cuttingTime = action.payload.cuttingTime;
        file.cuttingCostPerUnit = action.payload.cuttingCostPerUnit;
        file.totalCuttingCost = action.payload.totalCuttingCost;
        file.totalCost = action.payload.totalCost;
        file.sheetUsedPerc = action.payload.sheetUsedPerc;
        file.appliedMarkup = action.payload.appliedMarkup;
      }
    },

    setCuttingTechnologies: (state, action: PayloadAction<any[]>) => {
      state.cuttingTechnologies = action.payload;
    },
    setMaterials: (state, action: PayloadAction<any[]>) => {
      state.materials = action.payload;
    },

    removeFile: (state, action: PayloadAction<string>) => {
      state.parts = state.parts.filter((file) => file.id !== action.payload);
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const file = state.parts.find((file) => file.id === action.payload.id);
      if (file) {
        file.quantity = action.payload.quantity;
      }
    },

    updateValidity: (
      state,
      action: PayloadAction<{ id: string; isValid: boolean }>
    ) => {
      const file = state.parts.find((file) => file.id === action.payload.id);
      if (file) {
        file.isValid = action.payload.isValid;
      }
    },

    applySettingsToAll: (
      state,
      action: PayloadAction<{ sourceId: string }>
    ) => {
      const sourcePart = state.parts.find(
        (part) => part.id === action.payload.sourceId
      );
      if (sourcePart) {
        state.parts.forEach((part) => {
          if (part.id !== sourcePart.id) {
            part.material = sourcePart.material;
            part.thickness = sourcePart.thickness;
            part.size = sourcePart.size;
            part.cuttingTechnology = sourcePart.cuttingTechnology;
            part.extraNote = sourcePart.extraNote;
      
            // Recalculate validity based on the copied settings
            part.isValid =
              !!part.material &&
              !!part.thickness &&
              !!part.size &&
              !!part.cuttingTechnology;
          }
        });
      }
      toast({
        title: "Settings Applied",
        description: "Settings Applied to all the remaining parts",
        duration: 2500,
      });
    },

    clearparts: (state) => {
      state.parts = [];
      state.status = "draft";
      state.id = "";
      state.shippingOption = "pickup";
      state.shippingAddress = "";
    },

    updateQuoteId: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },

    updateStatus: (state, action: PayloadAction<string>) => {
      state.status = action.payload;
    },

    setShippingOption: (
      state,
      action: PayloadAction<"pickup" | "delivery">
    ) => {
      state.shippingOption = action.payload;
    },

    setShippingAddress: (state, action: PayloadAction<string>) => {
      state.shippingAddress = action.payload;
    },

    setCustomQuoteID: (state, action: PayloadAction<string>) => {
      state.customQuoteID = action.payload; // Ensure this line exists
    },

    // New actions for handling multiple files
    addUploadedFile: (
      state,
      action: PayloadAction<{ id: string; file: File }>
    ) => {
      const part = state.parts.find((p) => p.id === action.payload.id);
      if (part) {
        part.uploadedFiles = part.uploadedFiles || [];
        part.uploadedFiles.push(action.payload.file);
      }
    },

    removeUploadedFile: (
      state,
      action: PayloadAction<{ id: string; fileName: string }>
    ) => {
      const part = state.parts.find((p) => p.id === action.payload.id);
      if (part && part.uploadedFiles) {
        part.uploadedFiles = part.uploadedFiles.filter(
          (file) => file.name !== action.payload.fileName
        );
      }
      // Also remove from uploadedFilesInfo if necessary
      if (part && part.uploadedFilesInfo) {
        part.uploadedFilesInfo = part.uploadedFilesInfo.filter(
          (fileInfo) => fileInfo.name !== action.payload.fileName
        );
      }
    },
    setUploadedFilesInfo: (
      state,
      action: PayloadAction<{ id: string; filesInfo: UploadedFileInfo[] }>
    ) => {
      const part = state.parts.find((p) => p.id === action.payload.id);
      if (part) {
        part.uploadedFilesInfo = action.payload.filesInfo;
      }
    },
  },
  
});

export const {
  addFile,
  updatepartsettings,
  updateFileCalculations,
  setCuttingTechnologies,
  setMaterials,
  removeFile,
  updateQuantity,
  updateValidity,
  applySettingsToAll,
  clearparts,
  updateQuoteId,
  updateStatus,
  setShippingOption,
  setShippingAddress,
  setCustomQuoteID,
  addUploadedFile, // Exported new action
  removeUploadedFile, // Exported new action
  setUploadedFilesInfo, // Exported new action
} = quotePartsSlice.actions;

export default quotePartsSlice.reducer;
