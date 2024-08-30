import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./_ui/dialog";
import { useState, useEffect } from 'react';
import { Button } from '@/components/_ui/button';
import { addDocument, addItemToArrayField } from '@/services/db-services';

function Modal({ isOpen, onClose, onAdd, collectionName, inputFields, initialValues, updateDoc=false, docID=null ,arrayFieldName=null}) {
  const [newItem, setNewItem] = useState(initialValues);

  useEffect(() => {
    if (!isOpen) setNewItem(initialValues);
  }, [isOpen]);

  const handleChange = ({ target: { name, value } }) => setNewItem(prev => ({ ...prev, [name]: value }));

  const handleSubmit = async () => {
    try {
      if (updateDoc && docID) {
        // Add the new sheet to the selected material's sheets array
        await addItemToArrayField(collectionName,docID,arrayFieldName,newItem)
      } else {
        // Add a new material document
        await addDocument(collectionName, newItem);
      }
      onAdd(newItem);
      setNewItem(initialValues);
      onClose();
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full p-6 bg-white rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{updateDoc ? "Add Sheet" : "Add Material"}</DialogTitle>
          <DialogDescription className="text-sm text-gray-500"></DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          {inputFields.map(({ name, type, placeholder }) => (
            <input
              key={name}
              type={type}
              name={name}
              placeholder={placeholder}
              value={newItem[name]}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          ))}
          <div className="flex justify-end mt-4 font-secondary">
            <Button variant="default" onClick={handleSubmit}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default Modal;
