import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./_ui/dialog";
import { useState } from "react";
import { Button } from '@/components/_ui/button';

function EditModalCuttingTechs({ isOpen, onClose, onSave, tech }) {
    const [formData, setFormData] = useState({
        name: tech?.name || '',
        cuttingSpeed: tech?.cuttingSpeed || '',
        maxWidth: tech?.maxWidth || '',
        maxLength: tech?.maxLength || '',
        setupTime: tech?.setupTime || '',
        setupMode: tech?.setupMode || '',
        sheetChangeTime: tech?.sheetChangeTime || '',
        sheetChangeMode: tech?.sheetChangeMode || '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = () => {
        const updatedTech = { ...tech, ...formData };
        onSave(updatedTech); // Call the onSave function passed as prop
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
              bg-white
              rounded-lg
              shadow-lg
              p-4
              sm:p-6
              md:p-8
              lg:p-10
              overflow-auto
              max-h-[90vh]
              box-border
              focus:outline-none
              transition-transform
              duration-300
              ease-in-out
            "
          >
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl md:text-2xl font-semibold">
                Edit Cutting Technology
              </DialogTitle>
              <DialogDescription className="text-sm sm:text-base text-gray-500">
                Modify the cutting technology details below.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              {/* Technology Name */}
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700">
                  Technology Name
                </label>
                <input
                  type="text"
                  name="name"
                  className="
                    w-full
                    p-2
                    sm:p-3
                    md:p-4
                    border
                    rounded
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500
                  "
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
    
              {/* Cutting Speed */}
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700">
                  Cutting Speed (mm/hr)
                </label>
                <input
                  type="number"
                  name="cuttingSpeed"
                  className="
                    w-full
                    p-2
                    sm:p-3
                    md:p-4
                    border
                    rounded
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500
                  "
                  value={formData.cuttingSpeed}
                  onChange={handleInputChange}
                />
              </div>
    
              {/* Maximum Width */}
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700">
                  Maximum Width (mm)
                </label>
                <input
                  type="number"
                  name="maxWidth"
                  className="
                    w-full
                    p-2
                    sm:p-3
                    md:p-4
                    border
                    rounded
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500
                  "
                  value={formData.maxWidth}
                  onChange={handleInputChange}
                />
              </div>
    
              {/* Maximum Length */}
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700">
                  Maximum Length (mm)
                </label>
                <input
                  type="number"
                  name="maxLength"
                  className="
                    w-full
                    p-2
                    sm:p-3
                    md:p-4
                    border
                    rounded
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500
                  "
                  value={formData.maxLength}
                  onChange={handleInputChange}
                />
              </div>
    
              {/* Setup Time */}
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700">
                  Setup Time (s)
                </label>
                <input
                  type="number"
                  name="setupTime"
                  className="
                    w-full
                    p-2
                    sm:p-3
                    md:p-4
                    border
                    rounded
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500
                  "
                  value={formData.setupTime}
                  onChange={handleInputChange}
                />
              </div>
    
              {/* Setup Mode */}
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700">
                  Setup Mode
                </label>
                <input
                  type="text"
                  name="setupMode"
                  className="
                    w-full
                    p-2
                    sm:p-3
                    md:p-4
                    border
                    rounded
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500
                  "
                  value={formData.setupMode}
                  onChange={handleInputChange}
                />
              </div>
    
              {/* Sheet Change Time */}
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700">
                  Sheet Change Time (s)
                </label>
                <input
                  type="number"
                  name="sheetChangeTime"
                  className="
                    w-full
                    p-2
                    sm:p-3
                    md:p-4
                    border
                    rounded
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500
                  "
                  value={formData.sheetChangeTime}
                  onChange={handleInputChange}
                />
              </div>
    
              {/* Sheet Change Mode */}
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700">
                  Sheet Change Mode
                </label>
                <input
                  type="text"
                  name="sheetChangeMode"
                  className="
                    w-full
                    p-2
                    sm:p-3
                    md:p-4
                    border
                    rounded
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500
                  "
                  value={formData.sheetChangeMode}
                  onChange={handleInputChange}
                />
              </div>
    
              {/* Buttons */}
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

export default EditModalCuttingTechs;
