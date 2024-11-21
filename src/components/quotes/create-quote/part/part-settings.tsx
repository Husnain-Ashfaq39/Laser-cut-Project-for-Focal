// PartSettings.tsx
import React from "react";
import { Input } from "@/components/_ui/input";
import { Label } from "@/components/_ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/_ui/select";
import { usePartSettings } from "@/hooks/usePartSettings";
import FileUpload from "./file-upload";

interface PartSettingsProps {
  title: string;
  quantity: number;
  partDimensions: { width: number; height: number };
  fileId: string;
  onQuantityChange: (quantity: number) => void;
  onValidityChange: (id: string, isValid: boolean) => void;
  onExtraNoteChange?: (note: string) => void;
  onFileUpload?: (files: File[]) => void;
}

const PartSettings: React.FC<PartSettingsProps> = ({
  title,
  fileId,
  onQuantityChange,
  onValidityChange,
  onExtraNoteChange,
  onFileUpload, // This prop will no longer be used for FileUpload
}) => {
  const {
    selectedMaterial,
    setSelectedMaterial,
    selectedThickness,
    setSelectedThickness,
    selectedSize,
    setSelectedSize,
    thicknesses,
    sizes,
    materials,
    quantity,
    extraNote,
    setExtraNote,
    uploadedFiles,
    status,
    uploadedFilesInfo,
    handleRemoveExistingFile,
    handleFileUpload, // Destructure the new handler
  } = usePartSettings(
    fileId,
    onValidityChange,
    onExtraNoteChange,
    onFileUpload // This can be used if needed elsewhere
  );

  const isDisabled = status === "uneditable";

  return (
    <div className="space-y-6 mr-8">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-8">
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            value={quantity}
            type="number"
            min="1"
            onChange={(e) => onQuantityChange(Number(e.target.value))}
            disabled={isDisabled}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="material">Material</Label>
          <Select
            onValueChange={setSelectedMaterial}
            value={selectedMaterial?.name || ""}
            disabled={isDisabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Material" />
            </SelectTrigger>
            <SelectContent>
              {[...new Map(materials.map((mat) => [mat.name, mat])).values()].map((mat) => (
                <SelectItem key={mat.id} value={mat.name}>
                  {mat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="thickness">Thickness</Label>
          <Select
            onValueChange={setSelectedThickness}
            value={selectedThickness}
            disabled={isDisabled || !selectedMaterial}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Thickness" />
            </SelectTrigger>
            <SelectContent>
              {thicknesses.map((thickness) => (
                <SelectItem key={thickness} value={thickness}>
                  {thickness}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="size">Size (W x H)</Label>
          <Select
            onValueChange={setSelectedSize}
            value={selectedSize || ""}
            disabled={isDisabled || !selectedThickness}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Size" />
            </SelectTrigger>
            <SelectContent>
              {sizes.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-full space-y-2">
          <Label htmlFor="extra-note">Note</Label>
          <textarea
            id="extra-note"
            value={extraNote}
            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Leave note here..."
            onChange={(e) => setExtraNote(e.target.value)}
            disabled={isDisabled}
          />
        </div>

        <div className="col-span-full">
          <FileUpload
            fileId={fileId}
            uploadedFilesInfo={uploadedFilesInfo}
            uploadedFiles={uploadedFiles}
            onFileUpload={handleFileUpload} // Pass the new handler
            handleRemoveExistingFile={handleRemoveExistingFile}
            isDisabled={isDisabled}
          />
        </div>
      </div>
    </div>
  );
};

export default PartSettings;
