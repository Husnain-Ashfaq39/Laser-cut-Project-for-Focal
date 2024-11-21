import React, { useState, useEffect } from "react";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogHeader, DialogTitle } from "./_ui/dialog";
import { Button } from "@/components/_ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/_ui/select";

function EditModal({
  isOpen,
  onClose,
  data,
  onSave,
  fieldsToShow = null,
  isRateTable = false,
  material = null,
}) {
  const [formValues, setFormValues] = useState({});
  const [Thickness, setThickness] = useState("");
  const [allThicknesses, setAllThicknesses] = useState([]);

  useEffect(() => {
    if (material) {
      const thicknesses = material?.sheets?.map((sheet) => sheet?.thickness);
      setAllThicknesses(thicknesses);
    }
  }, [material]);

  useEffect(() => {
    if (isOpen) {
      console.log("Data before modification:", data); // Check initial data

      // Destructure width and height from size, if size exists
      const { size, ...restData } = data || {};
      const width = size?.width || "";
      const height = size?.height || "";

      // Create new data object with width and height as separate attributes
      const newData = { ...restData, width, height };

      console.log("Data after modification:", newData); // Check if the fields are correctly updated
      setFormValues(newData);

      if (isRateTable && newData?.thickness) {
        setThickness(newData.thickness);
      } else {
        setThickness(""); // Reset thickness if not provided
      }
    }
  }, [isOpen, data, isRateTable]);

  const handleInputChange = (key, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
  };

  const handleSave = () => {
    const updatedData = fieldsToShow.reduce((acc, key) => {
      // Exclude thickness if isRateTable is true, as it's handled by dropdown
      if (key === "thickness" && isRateTable) return acc;
      acc[key] = formValues[key] || ""; // Ensure the field is included even if empty
      return acc;
    }, {});

    // If it's a rate table, include thickness
    if (isRateTable) {
      updatedData.thickness = Thickness;
    }

    // If it's NOT a rate table, destruct width and height and reconstruct the size object
    if (!isRateTable) {
      const { width, height } = updatedData;
      if (width || height) {
        updatedData.size = {
          width: width || "", // Use empty string if width or height is not provided
          height: height || "",
        };
        // Remove width and height from the data object since they are now in the size object
        delete updatedData.width;
        delete updatedData.height;
      }
    }

    // Call onSave with the original data and the updated data
    onSave(data, updatedData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="
          fixed
          top-1/2
          left-1/2
          transform
          -translate-x-1/2
          -translate-y-1/2
          w-11/12
          max-w-full
          sm:max-w-md
          md:max-w-lg
          lg:max-w-xl
          xl:max-w-2xl
          rounded-lg
          bg-white
          p-4
          sm:p-6
          md:p-8
          lg:p-10
          shadow-lg
          overflow-auto
          max-h-[90vh]
          box-border
          focus:outline-none
        "
      >
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl md:text-2xl font-semibold">
          {isRateTable ? "Edit RateTable" : "Edit Sheet"}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          {isRateTable && (
            <Select
              value={Thickness}
              onValueChange={(value) => setThickness(value)}
            >
              <SelectTrigger className="w-full font-medium">
                <SelectValue placeholder="Select Thickness" />
              </SelectTrigger>
              <SelectContent className="font-secondary font-medium">
                <SelectGroup>
                  {allThicknesses?.map((thickness, index) => (
                    <SelectItem key={index} value={thickness}>
                      {thickness}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
          {fieldsToShow
            .filter((key) => !(isRateTable && key === "thickness")) // Skip rendering thickness as input if isRateTable is true
            .map((key) => (
              <div key={key}>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                  {key
                    .replace(/([A-Z])/g, ' $1') // Insert space before uppercase letters
                    .trim()                      // Remove any leading/trailing spaces
                    .replace(/^./, (str) => str.toUpperCase())} 
                </label>

                <input
                  type={typeof formValues[key] === "number" ? "number" : "text"}
                  className="
                    w-full
                    rounded
                    border
                    p-2
                    sm:p-3
                    md:p-4
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500
                  "
                  value={formValues[key] || ""} // Use empty string if value is undefined
                  onChange={(e) => handleInputChange(key, e.target.value)}
                />
              </div>
            ))}

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-6">
            <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button variant="default" onClick={handleSave} className="w-full sm:w-auto">
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default EditModal;
