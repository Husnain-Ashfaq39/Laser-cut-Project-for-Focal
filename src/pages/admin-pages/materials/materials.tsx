/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unsafe-optional-chaining */
import React, { useEffect, useState } from "react";
import FooterAdmin from "@/components/footer/footer-admin";
import NavbarAdmin from "@/components/nav/navbar-admin";
import { Search } from "@/components/_ui/search";
import { Button } from "@/components/_ui/button";
import Modal from "@/components/Modal";
import ConfirmationDialog from "@/components/_ui/confirmation"; 
import {
  deleteDocument,
  deleteDocumentsByMaterialId,
  fetchDocuments,
  handleDeleteSheet,
  updateItemInArrayField,
} from "@/services/db-services";
import PreLoader from "@/components/pre-loader";
import { useNavigate } from "react-router-dom";
import MaterialCard from "./material-card";
import MaterialPagination from "./materials-pagination";
import MaterialDetails from "./material-details";
import {
  initialMaterialState,
  inputFields,
  initialSheetState,
  inputFieldsSheet,
} from "./materials-config";

function Materials() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSheetModalOpen, setIsSheetModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cuttingTechs, setCuttingTechs] = useState([]);
  const [errorMaterials, setErrorMaterials] = useState(null);
  const [loading, setLoading] = useState(true);
  const [materialToDelete, setMaterialToDelete] = useState(null); // State for deletion

  // Filter materials based on search query
  const filteredMaterials = materials.filter((material) =>
    material?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const materialsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(filteredMaterials.length / materialsPerPage);

  // Function to paginate the materials
  const paginateMaterials = (materials, page, perPage) => {
    const startIndex = (page - 1) * perPage;
    return materials.slice(startIndex, startIndex + perPage);
  };

  const paginatedMaterials = paginateMaterials(
    filteredMaterials,
    currentPage,
    materialsPerPage
  );

  // Fetch Materials
  const getMaterials = async () => {
    try {
      const fetchedMaterials = await fetchDocuments("Materials");
      setMaterials(fetchedMaterials);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching Materials:", error);
      setErrorMaterials("Failed to fetch Materials");
      setLoading(false);
    }
  };

  useEffect(() => {
    getMaterials();

    const getCuttingTechs = async () => {
      try {
        const fetchedCuttingTechs = await fetchDocuments("CuttingTechs");
        setCuttingTechs(fetchedCuttingTechs);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching CuttingTechs:", error);
        setLoading(false);
      }
    };

    getCuttingTechs();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleOpenSheetModal = () => {
    setIsSheetModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsSheetModalOpen(false);
    setMaterialToDelete(null); // Ensure deletion dialog is closed
  };

  const handleAddMaterial = async () => {
    await getMaterials();
  };

  const handleAddSheet = (newSheet) => {
    setSelectedMaterial((prevSelectedMaterial) => ({
      ...prevSelectedMaterial,
      sheets: [...prevSelectedMaterial?.sheets, newSheet],
    }));

    setMaterials((prevMaterials) =>
      prevMaterials.map((material) =>
        material.id === selectedMaterial.id
          ? { ...material, sheets: [...material.sheets, newSheet] }
          : material
      )
    );
    setIsSheetModalOpen(false); // Close the modal after adding the sheet
  };

  const handleCardClick = (material) => {
    setSelectedMaterial(material);
  };

  // Updated delete handler to set the material to delete
  const handleDeleteMaterial = (material) => {
    setMaterialToDelete(material);
  };

  // Function to confirm deletion
  const confirmDeleteMaterial = async () => {
    if (!materialToDelete) return;

    // Optimistically update the UI
    setMaterials((prevMaterials) =>
      prevMaterials.filter((material) => material.id !== materialToDelete.id)
    );

    // If the deleted material was selected, clear the selection
    if (selectedMaterial?.id === materialToDelete.id) {
      setSelectedMaterial(null);
    }

    try {
      // Perform the delete operations
      await deleteDocument("Materials", materialToDelete.id);
      await deleteDocumentsByMaterialId("RateTable", materialToDelete.id);

      // Optionally, you can refetch the materials to ensure consistency
      // await getMaterials();
    } catch (error) {
      console.error("Error deleting Material:", error);

      // Notify the user about the failure (you can use a toast or alert)
      alert("Failed to delete the material. Please try again.");

      // Optionally, refetch materials to revert optimistic update
      await getMaterials();
    } finally {
      // Close the confirmation dialog
      setMaterialToDelete(null);
    }
  };

  const handleSaveSheetData = async (data, updatedSheetData) => {
    try {
      await updateItemInArrayField(
        "Materials",
        selectedMaterial.id,
        "sheets",
        data,
        updatedSheetData
      );
      const updatedMaterials = await fetchDocuments("Materials");
      setMaterials(updatedMaterials);
      const updatedMaterial = updatedMaterials.find(
        (material) => material.id === selectedMaterial.id
      );
      setSelectedMaterial(updatedMaterial);
    } catch (error) {
      console.error("Error updating sheet data:", error);
    }
  };

  const handleSheetDelete = async (sheetData) => {
    await handleDeleteSheet(sheetData.id, sheetData);
    const updatedMaterials = await fetchDocuments("Materials");
    setMaterials(updatedMaterials);
    const updatedMaterial = updatedMaterials.find(
      (material) => material.id === selectedMaterial.id
    );
    setSelectedMaterial(updatedMaterial);
  };

  if (loading) return <PreLoader />;
  return (
    <div className="w-full bg-slate-100 font-body">
      <NavbarAdmin />
      <main className="m-auto flex min-h-screen w-full flex-col items-center px-4 py-5 sm:px-6 lg:px-[5%]">
        <h1 className="mb-5 text-center font-primary text-2xl sm:text-3xl">
          Materials
        </h1>

        <div className="mt-6 flex w-full flex-col items-center justify-start space-y-5 rounded-lg border border-gray-300 bg-white p-4 sm:p-6 lg:flex-row lg:space-x-5 lg:space-y-0 lg:p-8">
          {/* Search Input */}
          <Search
            type="text"
            className="h-10 w-full rounded-lg font-medium lg:w-56"
            placeholder="Search Material"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Add New Material Button */}
          <Button
            variant="default"
            className="w-full rounded-full font-medium lg:w-auto"
            onClick={handleOpenModal}
          >
            + Add New Material
          </Button>
        </div>

        {/* Materials Grid */}
        <div className="my-16 grid w-full grid-cols-1 gap-5 font-body sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div>Loading Materials...</div>
          ) : errorMaterials ? (
            <div className="text-red-500">{errorMaterials}</div>
          ) : paginatedMaterials.length > 0 ? (
            paginatedMaterials.map((material) => (
              <MaterialCard
                key={material.id}
                material={material}
                isSelected={selectedMaterial?.id === material.id}
                onClick={() => handleCardClick(material)}
                onDelete={() => handleDeleteMaterial(material)} // Pass the material object
              />
            ))
          ) : (
            <div>No materials found.</div>
          )}
        </div>

        {/* Stepper to navigate between sets of materials */}
        <MaterialPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        {/* Selected Material Details */}
        {selectedMaterial && (
          <MaterialDetails
            selectedMaterial={selectedMaterial}
            cuttingTechs={cuttingTechs}
            navigate={navigate}
            onOpenSheetModal={handleOpenSheetModal}
            onSaveSheetData={handleSaveSheetData}
            onDeleteSheet={handleSheetDelete}
          />
        )}
      </main>
      <FooterAdmin />

      {/* Add Material Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAdd={handleAddMaterial}
        collectionName="Materials"
        inputFields={inputFields}
        initialValues={initialMaterialState}
      />

      {selectedMaterial && (
        <Modal
          isOpen={isSheetModalOpen}
          onClose={handleCloseModal}
          onAdd={handleAddSheet}
          collectionName="Materials"
          inputFields={inputFieldsSheet}
          initialValues={initialSheetState}
          updateDoc={true}
          docID={selectedMaterial.id}
          arrayFieldName="sheets"
          selectedMaterial={selectedMaterial}
        />
      )}

      {/* Confirmation Dialog for Deletion */}
      <ConfirmationDialog
        open={!!materialToDelete}
        onConfirm={confirmDeleteMaterial}
        onCancel={() => setMaterialToDelete(null)}
        title="Confirm Deletion"
        desc={`Are you sure you want to delete the material "${materialToDelete?.name}"? This action cannot be undone.`}
      />
    </div>
  );
}

export default Materials;
