import { Dialog } from "@radix-ui/react-dialog";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./_ui/dialog";
import { useState, useEffect } from "react";
import { Button } from "@/components/_ui/button";
import { addDocument, addItemToArrayField } from "@/services/db-services";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/_ui/select";

function Modal({
  isOpen,
  onClose,
  onAdd,
  collectionName,
  inputFields,
  initialValues,
  updateDoc = false,
  docID = null,
  arrayFieldName = null,
  isTableData = false,
  selectedMaterial = null,
}) {
  const [newItem, setNewItem] = useState({
    ...initialValues,
    appliedMarkup: selectedMaterial?.appliedMarkup || 0, // Default to material's appliedMarkup
  });
  const [Thickness, setThickness] = useState("");
  const [allThicknesses, setAllThicknesses] = useState([]);

  useEffect(() => {
    if (selectedMaterial) {
      const thicknesses = selectedMaterial?.sheets?.map(
        (sheet) => sheet.thickness,
      );
      setAllThicknesses(thicknesses);
    }
  }, [selectedMaterial]);

  useEffect(() => {
    if (!isOpen) {
      setNewItem({
        ...initialValues,
        appliedMarkup: selectedMaterial?.appliedMarkup || 0, // Reset appliedMarkup on close
      });
      setThickness(""); // Reset thickness on close
    }
    if (isTableData) {
      delete initialValues.thickness;
    }
  }, [isOpen]);

  const handleChange = ({ target: { name, value } }) => {
    setNewItem((prev) => {
      const updatedItem = { ...prev, [name]: value };

      // Automatically calculate sheetRate if sheetCost or appliedMarkup changes
      if (name === "sheetCost" || name === "appliedMarkup") {
        const sheetCost = name === "sheetCost" ? value : updatedItem.sheetCost;
        const appliedMarkup =
          name === "appliedMarkup" ? value : updatedItem.appliedMarkup;
        updatedItem.sheetRate = sheetCost * (1 + appliedMarkup / 100);
      }

      return updatedItem;
    });
  };

  const handleSubmit = async () => {
    try {
      let itemWithThickness = { ...newItem };

      // Combine width and height into size object if they exist
      const { width, height } = itemWithThickness;
      if (width && height) {
        itemWithThickness = {
          ...itemWithThickness,
          size: { width, height },
        };
        delete itemWithThickness.width;
        delete itemWithThickness.height;
      }

      // If isTableData, add thickness attribute
      if (isTableData) {
        itemWithThickness = { ...itemWithThickness, thickness: Thickness };
      }

      // Add or update document in the collection
      if (updateDoc && docID) {
        await addItemToArrayField(
          collectionName,
          docID,
          arrayFieldName,
          itemWithThickness,
        );
      } else {
        await addDocument(collectionName, itemWithThickness);
      }

      // Call callback and reset form
      onAdd(itemWithThickness);
      setNewItem({
        ...initialValues,
        appliedMarkup: selectedMaterial?.appliedMarkup || 0, // Reset appliedMarkup after submit
      });
      setThickness(""); // Reset after submit
      onClose();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {updateDoc ? "Enter Data" : "Add Material"}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500"></DialogDescription>
        </DialogHeader>

        {isTableData && (
          <Select
            value={Thickness}
            onValueChange={(value) => {
              setThickness(value);
            }}
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

        <div className="mt-4 space-y-4">
          {inputFields.map(
            ({ name, type, placeholder }) =>
              (name !== "thickness" || !isTableData) && (
                <input
                  key={name}
                  type={type}
                  name={name}
                  placeholder={placeholder}
                  value={newItem[name] || ""}
                  onChange={handleChange}
                  className="w-full rounded border p-2"
                  readOnly={name === "sheetRate"} // Make sheetRate read-only as it's calculated
                />
              ),
          )}
          <div className="mt-4 flex justify-end font-secondary">
            <Button variant="default" onClick={handleSubmit}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default Modal;
