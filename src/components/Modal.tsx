import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./_ui/dialog";
import { useState, useEffect } from 'react';
import { Button } from '@/components/_ui/button';
import { addDocument, addItemToArrayField } from '@/services/db-services';
import { Select, SelectContent, SelectGroup, SelectTrigger, SelectValue, SelectItem } from '@/components/_ui/select';

function Modal({ isOpen, onClose, onAdd, collectionName, inputFields, initialValues, updateDoc = false, docID = null, arrayFieldName = null, isTableData = false,selectedMaterial = null } ) {
  const [newItem, setNewItem] = useState(initialValues);
  const [Thickness, setThickness] = useState("");
  const [allThicknesses, setAllThicknesses] = useState([]);

  useEffect(() => {
    if (selectedMaterial) {
      // Extract all thicknesses from the selectedMaterial's sheets array
      const thicknesses = selectedMaterial?.sheets?.map(sheet => sheet.thickness);
      setAllThicknesses(thicknesses);
    }
  }, [selectedMaterial]);

  useEffect(() => {
    if (!isOpen) {
      setNewItem(initialValues);
      setThickness(""); // Reset thickness on close
    }
    if (isTableData) {
      delete initialValues.thickness;
     
    }
  }, [isOpen]);

  const handleChange = ({ target: { name, value } }) => setNewItem(prev => ({ ...prev, [name]: value }));

  const handleSubmit = async () => {
    try {
      let itemWithThickness = { ...newItem };
      
      if (isTableData) {
        itemWithThickness = { ...itemWithThickness, thickness: Thickness };
      }
      
      if (updateDoc && docID) {
        await addItemToArrayField(collectionName, docID, arrayFieldName, itemWithThickness);
      } else {
        await addDocument(collectionName, itemWithThickness);
      }

      onAdd(itemWithThickness);
      setNewItem(initialValues);
      setThickness(""); // Reset after submit
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
          <DialogTitle className="text-lg font-semibold">{updateDoc ? "Enter Data" : "Add Material"}</DialogTitle>
          <DialogDescription className="text-sm text-gray-500"></DialogDescription>
        </DialogHeader>

        {isTableData && <Select
          value={Thickness}
          onValueChange={(value) => {
            setThickness(value);
          }}>
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
        </Select>}

        <div className="mt-4 space-y-4">
          {inputFields.map(({ name, type, placeholder }) => (
            (name!="thickness" || !isTableData)&& 
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
