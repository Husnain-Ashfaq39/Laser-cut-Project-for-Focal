import React, { useState, useEffect } from 'react';
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./_ui/dialog";
import { Button } from '@/components/_ui/button';

function EditModal2({ isOpen, onClose, rateTablesetting, onSave }) {
  const [name, setName] = useState(rateTablesetting?.name || '');
  const [baseHourlyRateMarkup, setBaseHourlyRateMarkup] = useState(rateTablesetting?.baseHourlyRateMarkup || 0);
  const [etchingFeedRate, setEtchingFeedRate] = useState(rateTablesetting?.etchingFeedRate || 0);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal is closed
      setName(rateTablesetting?.name || '');
      setBaseHourlyRateMarkup(rateTablesetting?.baseHourlyRateMarkup || 0);
      setEtchingFeedRate(rateTablesetting?.etchingFeedRate || 0);
    }
  }, [isOpen, rateTablesetting]);

  const handleSave = () => {
    const updatedRateTable = {
      ...rateTablesetting,
      name,
      baseHourlyRateMarkup,
      etchingFeedRate,
    };
    onSave(updatedRateTable);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full p-6 bg-white rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Edit RateTable Settings</DialogTitle>
          <DialogDescription className="text-sm text-gray-500"></DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Base Hourly Rate Markup</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={baseHourlyRateMarkup}
              onChange={(e) => setBaseHourlyRateMarkup(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Etching Feed Rate</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={etchingFeedRate}
              onChange={(e) => setEtchingFeedRate(e.target.value)}
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