import React from "react";
import { Input } from "@/components/_ui/input";
import { Label } from "@/components/_ui/label";
import { Switch } from "@/components/_ui/switch";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/_ui/select";

interface PartSettingsProps {
  title: string; // Title passed from parent
  quantity: number; // Current quantity for this part
  onQuantityChange: (quantity: number) => void; // Callback for quantity change
}

const PartSettings: React.FC<PartSettingsProps> = ({
  title,
  quantity,
  onQuantityChange,
}) => {
  return (
    <div>
      <h1 className="mb-4 text-lg font-semibold">{title}</h1>
      <div className="grid grid-cols-2 gap-4">
        {/* Quantity Input */}
        <div className="grid gap-2">
          <Label htmlFor="quantity" className="text-sm font-medium">
            Quantity
          </Label>
          <Input
            id="quantity"
            value={quantity}
            className="w-[90%]"
            required
            type="number"
            min="1"
            onChange={(e) => onQuantityChange(Number(e.target.value))}
          />
        </div>

        {/* Cutting Technology Dropdown */}
        <div className="grid gap-2">
          <Label htmlFor="cutting-technology" className="text-sm font-medium">
            Cutting Technology
          </Label>
          <Select>
            <SelectTrigger className="w-[90%]">
              <SelectValue placeholder="Select Cutting Technology" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="laser">Laser</SelectItem>
              <SelectItem value="water-jet">Water Jet</SelectItem>
              <SelectItem value="plasma">Plasma</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Material Dropdown */}
        <div className="grid gap-2">
          <Label htmlFor="material" className="text-sm font-medium">
            Material
          </Label>
          <Select>
            <SelectTrigger className="w-[90%]">
              <SelectValue placeholder="Select Material" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="aluminum">Aluminum</SelectItem>
              <SelectItem value="steel">Steel</SelectItem>
              <SelectItem value="silk">Silk</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Consumption Mode Dropdown */}
        <div className="grid gap-2">
          <Label htmlFor="consumption-mode" className="text-sm font-medium">
            Consumption Mode
          </Label>
          <Select>
            <SelectTrigger className="w-[90%]">
              <SelectValue placeholder="Select Consumption Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mode1">Mode 1</SelectItem>
              <SelectItem value="mode2">Mode 2</SelectItem>
              <SelectItem value="mode3">Mode 3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Thickness Dropdown */}
        <div className="grid gap-2">
          <Label htmlFor="thickness" className="text-sm font-medium">
            Thickness
          </Label>
          <Select>
            <SelectTrigger className="w-[90%]">
              <SelectValue placeholder="Select Thickness" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1mm">1 mm</SelectItem>
              <SelectItem value="2mm">2 mm</SelectItem>
              <SelectItem value="3mm">3 mm</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Size Dropdown */}
        <div className="grid gap-2">
          <Label htmlFor="size" className="text-sm font-medium">
            Size
          </Label>
          <Select>
            <SelectTrigger className="w-[90%]">
              <SelectValue placeholder="Select Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-4 flex items-center space-x-2">
        <h1 className="text-sm font-medium">Customer Supplied Material</h1>
        <Switch />
      </div>
    </div>
  );
};

export default PartSettings;
