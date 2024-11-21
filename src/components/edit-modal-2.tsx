import { useState, useEffect } from "react";
import { Dialog } from "@radix-ui/react-dialog";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./_ui/dialog";
import { Button } from "@/components/_ui/button";

function EditModal2({ isOpen, onClose, rateTablesetting, onSave }) {
  const [name, setName] = useState(rateTablesetting?.name || "");

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal is closed
      setName(rateTablesetting?.name || "");
    }
  }, [isOpen, rateTablesetting]);

  const handleSave = () => {
    const updatedRateTable = {
      ...rateTablesetting,
      name,
    };
    onSave(updatedRateTable);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Edit RateTable Settings
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500"></DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              className="w-full rounded border p-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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

export default EditModal2;
