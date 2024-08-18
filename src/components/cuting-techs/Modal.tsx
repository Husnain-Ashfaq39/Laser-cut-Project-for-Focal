import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../_ui/dialog";
import { useState, useEffect } from 'react';
import { Button } from '@/components/_ui/button';
import { addDocument } from '@/services/db-services';

const initialTechState = {
  name: '',
  maxWidth: '',
  maxLength: '', 
  setupTime: '',
  setupMode: '',
  sheetChangeTime: '',
  sheetChangeMode: '',
};

function Modal({ isOpen, onClose, onAdd, collectionName }) {
  const [newTech, setNewTech] = useState(initialTechState);

  useEffect(() => {
    if (!isOpen) setNewTech(initialTechState);
  }, [isOpen]);

  const handleChange = ({ target: { name, value } }) => setNewTech(prev => ({ ...prev, [name]: value }));

  const handleSubmit = async () => {
    try {
      await addDocument(collectionName, newTech);
      onAdd(newTech);
      setNewTech(initialTechState);
      onClose();
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  if (!isOpen) return null;

  const inputFields = [
    { name: 'name', type: 'text', placeholder: 'Technology Name' },
    { name: 'maxWidth', type: 'number', placeholder: 'Maximum sheet width (mm)' },
    { name: 'maxLength', type: 'number', placeholder: 'Maximum sheet length (mm)' },
    { name: 'setupTime', type: 'number', placeholder: 'Setup time (s)' },
    { name: 'setupMode', type: 'text', placeholder: 'Setup mode' },
    { name: 'sheetChangeTime', type: 'number', placeholder: 'Sheet change time (s)' },
    { name: 'sheetChangeMode', type: 'text', placeholder: 'Sheet change mode' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full p-6 bg-white rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Add Cutting Technology</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">Enter details for the new cutting technology.</DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          {inputFields.map(({ name, type, placeholder }) => (
            <input
              key={name}
              type={type}
              name={name}
              placeholder={placeholder}
              value={newTech[name]}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          ))}
          <div className="flex justify-end mt-4">
            <Button variant="default" onClick={handleSubmit}>Add Technology</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default Modal;
