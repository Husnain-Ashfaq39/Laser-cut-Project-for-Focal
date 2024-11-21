import editsvg from "@/assets/icons/edit.svg";
import savesvg from "@/assets/icons/save.svg";
import SheetsTable from "./sheets-table";
import { useState } from "react";
import {
  db,
  updateDocument,
} from "@/services/db-services";
import { doc, updateDoc } from "firebase/firestore";

function MaterialDetails({
  selectedMaterial,
  cuttingTechs,
  navigate,
  onOpenSheetModal,
  onSaveSheetData,
  onDeleteSheet,
}) {
  const [isEditingDensity, setIsEditingDensity] = useState(false);
  const [newDensity, setNewDensity] = useState(selectedMaterial?.density || "");

  const [isEditingMarkup, setIsEditingMarkup] = useState(false);
  const [newMarkup, setNewMarkup] = useState(
    selectedMaterial?.appliedMarkup || "",
  );

  const handleEditDensityClick = () => {
    setIsEditingDensity(true);
  };

  const handleSaveDensityClick = async () => {
    try {
      await updateDocument("Materials", selectedMaterial.id, {
        density: newDensity,
      });
      selectedMaterial.density = newDensity;
      setIsEditingDensity(false);
    } catch (error) {
      console.error("Error updating density:", error);
    }
  };

  const handleEditMarkupClick = () => {
    setIsEditingMarkup(true);
  };

  const handleSaveMarkupClick = async () => {
    try {
      // Update the material's appliedMarkup in the database
      await updateDocument("Materials", selectedMaterial.id, {
        appliedMarkup: newMarkup,
      });
      selectedMaterial.appliedMarkup = newMarkup;

      // Update appliedMarkup for all sheets in this material
      const updatedSheets = selectedMaterial.sheets.map((sheet) => ({
        ...sheet,
        appliedMarkup: newMarkup,
      }));

      // Update sheets in UI
      selectedMaterial.sheets = updatedSheets;

      // Update the sheets array in the database in a single operation
      await updateDoc(doc(db, "Materials", selectedMaterial.id), {
        sheets: updatedSheets,
      });

      setIsEditingMarkup(false);
      console.log("All sheets successfully updated with new appliedMarkup");
    } catch (error) {
      console.error("Error updating markup:", error);
    }
  };

  return (
    <div className="mb-14 w-full">
      <h2 className="mb-6 text-2xl font-semibold">
        {selectedMaterial.name} Details
      </h2>

      {/* Material Settings */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-white p-6 shadow-md">
          <div className="flex justify-between">
            <h3 className="mb-4 text-xl font-semibold">Material Settings</h3>
          </div>
          <div className="space-y-4 text-gray-600">
            {/* Density Field */}
            <div className="flex items-center justify-between">
              <span className="w-1/2 font-medium">Density (kg/m³):</span>
              <div className="flex w-1/2 items-center justify-end">
                {!isEditingDensity ? (
                  <>
                    <span>{selectedMaterial.density}</span>
                    <img
                      src={editsvg}
                      alt="Edit Density"
                      className="ml-2 cursor-pointer"
                      onClick={handleEditDensityClick}
                    />
                  </>
                ) : (
                  <>
                    <input
                      type="number"
                      value={newDensity}
                      onChange={(e) => setNewDensity(e.target.value)}
                      className="w-20 rounded border border-gray-300 p-2 text-right"
                    />
                    <img
                      src={savesvg}
                      alt="Save Density"
                      className="ml-2 cursor-pointer"
                      onClick={handleSaveDensityClick}
                    />
                  </>
                )}
              </div>
            </div>

            {/* Applied Markup Field */}
            <div className="flex items-center justify-between">
              <span className="w-1/2 font-medium">Applied Markup (%):</span>
              <div className="flex w-1/2 items-center justify-end">
                {!isEditingMarkup ? (
                  <>
                    <span>{selectedMaterial.appliedMarkup}</span>
                    <img
                      src={editsvg}
                      alt="Edit Markup"
                      className="ml-2 cursor-pointer"
                      onClick={handleEditMarkupClick}
                    />
                  </>
                ) : (
                  <>
                    <input
                      type="number"
                      value={newMarkup}
                      onChange={(e) => setNewMarkup(e.target.value)}
                      className="w-20 rounded border border-gray-300 p-2 text-right"
                    />
                    <img
                      src={savesvg}
                      alt="Save Markup"
                      className="ml-2 cursor-pointer"
                      onClick={handleSaveMarkupClick}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Rate Table */}
        <div className="rounded-lg border bg-white p-6 shadow-md">
          <h3 className="mb-4 text-xl font-semibold">
            Rate Table: {selectedMaterial.name}
          </h3>
          {cuttingTechs.map((tech) => (
            <div
              key={tech.id}
              className="flex cursor-pointer text-sm text-blue-500"
              onClick={() =>
                navigate("/admin/rate-table", {
                  state: { cuttingTech: tech, material: selectedMaterial },
                })
              }
            >
              {tech.name}: {selectedMaterial.name}
            </div>
          ))}
        </div>
      </div>

      {/* Sheets Table */}
      <SheetsTable
        sheets={selectedMaterial.sheets}
        selectedMaterialId={selectedMaterial.id}
        onSaveSheetData={onSaveSheetData}
        onDeleteSheet={onDeleteSheet}
        onOpenSheetModal={onOpenSheetModal}
      />
    </div>
  );
}

export default MaterialDetails;
