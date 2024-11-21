/* eslint-disable @typescript-eslint/no-explicit-any */
// usePartSettings.ts
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updatepartsettings,
  addUploadedFile,
  removeUploadedFile,
} from "@/redux/slices/quote-parts-slice";
import { RootState } from "@/redux/store";

export const usePartSettings = (
  fileId: string,
  onValidityChange: (id: string, isValid: boolean) => void,
  onExtraNoteChange?: (note: string) => void,
  onFileUpload?: (files: File[]) => void
) => {
  const dispatch = useDispatch();
  const { materials, cuttingTechnologies, parts, status } = useSelector(
    (state: RootState) => state.quoteParts
  );

  const partSettings = parts.find((part) => part.id === fileId);

  // Local state initialized from Redux state
  const [selectedMaterial, setSelectedMaterial] = useState(
    partSettings?.material || null
  );
  const [selectedThickness, setSelectedThickness] = useState(
    partSettings?.thickness || ""
  );
  const [selectedSize, setSelectedSize] = useState(
    partSettings?.size
      ? `${partSettings.size.width} X ${partSettings.size.height}`
      : ""
  );
  const [selectedCuttingTech, setSelectedCuttingTech] = useState(
    partSettings?.cuttingTechnology?.name || "Laser",
  );

  // Extra Note State
  const [extraNote, setExtraNote] = useState(partSettings?.extraNote || "");

  // File Upload State
  const [uploadedFiles, setUploadedFiles] = useState<File[]>(
    partSettings?.uploadedFiles || []
  );

  // Reference for file input
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Only show unique thicknesses for the selected material
  const thicknesses: string[] = useMemo(() => {
    if (!selectedMaterial?.sheets) return [];
    return Array.from(
      new Set(selectedMaterial.sheets.map((sheet: any) => sheet.thickness))
    );
  }, [selectedMaterial]);

  // Only show sizes available for the selected thickness
  const sizes: string[] = useMemo(() => {
    if (!selectedMaterial?.sheets) return [];
    return selectedMaterial.sheets
      .filter((sheet: any) => sheet.thickness === selectedThickness)
      .map((sheet: any) => `${sheet.size.width} X ${sheet.size.height}`);
  }, [selectedMaterial, selectedThickness]);

  const setPartField = useCallback(
    (field: string, value: any) => {
      dispatch(updatepartsettings({ id: fileId, [field]: value }));
    },
    [dispatch, fileId],
  );

  // Update the cutting technology in the part settings if it's set to the default "Laser"
  useEffect(() => {
    if (!partSettings?.cuttingTechnology) {
      const defaultCuttingTech = cuttingTechnologies.find(
        (tech) => tech.name === "Laser",
      );
      if (defaultCuttingTech) {
        setPartField("cuttingTechnology", defaultCuttingTech);
      }
    }
  }, [cuttingTechnologies, partSettings, setPartField]);

  // Automatically set the first size when thickness changes, but only if no size is already selected
  useEffect(() => {
    if (!selectedSize && sizes.length > 0) {
      setSelectedSize(sizes[0]); // Set the first size by default
      setPartField("size", {
        width: parseInt(sizes[0].split(" X ")[0], 10),
        height: parseInt(sizes[0].split(" X ")[1], 10),
      });
    }
  }, [sizes, selectedSize]); // Include `selectedSize` in dependencies to check if already selected

  const checkValidity = useCallback(() => {
    const isValid = !!(
      selectedMaterial &&
      selectedThickness &&
      selectedSize &&
      selectedCuttingTech
    );
    onValidityChange(fileId, isValid);
  }, [
    selectedMaterial,
    selectedThickness,
    selectedSize,
    selectedCuttingTech,
    onValidityChange,
    fileId,
  ]);

  useEffect(() => {
    checkValidity();
  }, [checkValidity]);

  // Effect to handle extraNote changes
  useEffect(() => {
    setPartField("extraNote", extraNote);
    if (onExtraNoteChange) {
      onExtraNoteChange(extraNote);
    }
  }, [extraNote, setPartField, onExtraNoteChange]);

  // Effect to handle uploadedFiles changes
  useEffect(() => {
    setPartField("uploadedFiles", uploadedFiles);
    if (onFileUpload) {
      onFileUpload(uploadedFiles);
    }
  }, [uploadedFiles, setPartField, onFileUpload]);

  useEffect(() => {
    if (uploadedFiles.length > 0 && fileInputRef.current) {
      // Note: It's not straightforward to set FileList programmatically
      // Consider managing files entirely through state
    }
  }, [uploadedFiles]);

  /**
   * Synchronize local state with Redux state when partSettings changes.
   */
  useEffect(() => {
    if (partSettings) {
      // Update selectedMaterial if it has changed in Redux
      if (partSettings.material?.name !== selectedMaterial?.name) {
        setSelectedMaterial(partSettings.material || null);
      }

      // Update selectedThickness if it has changed in Redux
      if (partSettings.thickness !== selectedThickness) {
        setSelectedThickness(partSettings.thickness || "");
      }

      // Update selectedSize if it has changed in Redux
      const newSize = partSettings.size
        ? `${partSettings.size.width} X ${partSettings.size.height}`
        : "";
      if (newSize !== selectedSize) {
        setSelectedSize(newSize);
      }

      // Update selectedCuttingTech if it has changed in Redux
      if (partSettings.cuttingTechnology?.name !== selectedCuttingTech) {
        setSelectedCuttingTech(partSettings.cuttingTechnology?.name || "");
      }

      // Update extraNote if it has changed in Redux
      if (partSettings.extraNote !== extraNote) {
        setExtraNote(partSettings.extraNote || "");
      }

      // Update uploadedFiles if it has changed in Redux
      if (partSettings.uploadedFiles !== uploadedFiles) {
        setUploadedFiles(partSettings.uploadedFiles || []);
      }

      // Optionally, synchronize uploadedFilesInfo if needed
    }
  }, [
    partSettings,
    selectedMaterial,
    selectedThickness,
    selectedSize,
    selectedCuttingTech,
  ]);

  // Fetch uploadedFilesInfo from Redux
  const uploadedFilesInfo = useSelector(
    (state: RootState) =>
      state.quoteParts.parts.find((part) => part.id === fileId)
        ?.uploadedFilesInfo || []
  );

  // Handler to remove existing uploaded files
  const handleRemoveExistingFile = (fileName: string) => {
    // Dispatch an action to remove the file from Firestore and Redux
    dispatch(removeUploadedFile({ id: fileId, fileName }));
    // Optionally, show a confirmation or toast notification
  };

  // **Add the handleFileUpload function here**
  const handleFileUpload = (files: File[]) => {
    files.forEach((file) => {
      dispatch(addUploadedFile({ id: fileId, file }));
    });
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  return {
    selectedMaterial,
    setSelectedMaterial: (materialName: string) => {
      const material = materials.find((mat) => mat.name === materialName);
      setSelectedMaterial(material || null);
      setSelectedThickness(""); // Reset thickness when material changes
      setSelectedSize(""); // Reset size when material changes
      setPartField("material", material || null);
    },
    selectedThickness,
    setSelectedThickness: (thickness: string) => {
      setSelectedThickness(thickness);
      setSelectedSize(""); // Reset size when thickness changes
      setPartField("thickness", thickness);
    },
    selectedSize,
    setSelectedSize: (size: string) => {
      const [width, height] = size.split(" X ").map(Number);
      setSelectedSize(size);
      setPartField("size", { width, height });
    },
    selectedCuttingTech,
    setSelectedCuttingTech: (tech: string) => {
      const cuttingTech = cuttingTechnologies.find((t) => t.name === tech);
      setSelectedCuttingTech(tech);
      if (cuttingTech) setPartField("cuttingTechnology", cuttingTech);
    },
    thicknesses,
    sizes,
    cuttingTechnologies,
    materials,
    quantity: partSettings?.quantity,
    // Extra Note
    extraNote,
    setExtraNote,
    // File Upload
    uploadedFiles,
    setUploadedFiles,
    // Functions to add/remove files
    addUploadedFile: (file: File) => {
      dispatch(addUploadedFile({ id: fileId, file }));
      setUploadedFiles((prev) => [...prev, file]);
    },
    removeUploadedFile: (fileName: string) => {
      dispatch(removeUploadedFile({ id: fileId, fileName }));
      setUploadedFiles((prev) => prev.filter((f) => f.name !== fileName));
    },
    fileInputRef,
    status, // Added status for potential UI disabling
    // Existing uploaded files info
    uploadedFilesInfo,
    handleRemoveExistingFile,
    // **Return the new handleFileUpload function**
    handleFileUpload,
  };
};
