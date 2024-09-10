import React, { useState, useEffect } from 'react';
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogHeader, DialogTitle } from "./_ui/dialog";
import { Button } from '@/components/_ui/button';
import { Select, SelectContent, SelectGroup, SelectTrigger, SelectValue, SelectItem } from '@/components/_ui/select';

function EditModal({ isOpen, onClose, data, onSave, fieldsToShow = null, isRateTable = false, material = null }) {
  const [formValues, setFormValues] = useState({});
  const [Thickness, setThickness] = useState("");
  const [allThicknesses, setAllThicknesses] = useState([]);

  useEffect(() => {
    if (material) {
      const thicknesses = material?.sheets?.map(sheet => sheet?.thickness);
      setAllThicknesses(thicknesses);
    }
  }, [material]);

  useEffect(() => {
    if (isOpen) {
      console.log("Data:", data); // Check if the expected fields exist
      setFormValues(data);
      if (isRateTable && data?.thickness) {
        setThickness(data.thickness);
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
      acc[key] = formValues[key] || ''; // Make sure the field is included even if empty
      return acc;
    }, {});
    if (isRateTable) {
      updatedData.thickness = Thickness; // Include thickness if rate table
    }
    onSave(data, updatedData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full p-6 bg-white rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Edit RateTable Settings</DialogTitle>
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
          {fieldsToShow.map((key) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>

              <input
                type={typeof formValues[key] === 'number' ? 'number' : 'text'}
                className="w-full p-2 border rounded"
                value={formValues[key] || "null"}  // Use empty string if value is undefined
                onChange={(e) => handleInputChange(key, e.target.value)}
              />
            </div>
          ))}

          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="default" onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


export default EditModal;
