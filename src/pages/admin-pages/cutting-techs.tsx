import { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import { Button } from "@/components/_ui/button";
import FooterAdmin from "@/components/footer/footer-admin";
import NavbarAdmin from "@/components/nav/navbar-admin";
import {
  fetchDocuments,
  deleteDocument,
  updateDocument,
} from "@/services/db-services"; // Import updateDocument
import PreLoader from "@/components/pre-loader";
import deletesvg from "@/assets/icons/delete.svg";
import editsvg from "@/assets/icons/edit.svg"; // Import edit icon
import ConfirmationDialog from "@/components/_ui/confirmation";
import EditModalCuttingTechs from "@/components/edit-modal-cuttingtechs"; // Import the EditModalCuttingTechs

function CuttingTechs() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cuttingTechs, setCuttingTechs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [techToDelete, setTechToDelete] = useState(null);
  const [techToEdit, setTechToEdit] = useState(null); // State for the tech to be edited
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State to manage the edit modal

  const initialTechState = {
    name: "",
    cuttingSpeed: "",
    maxWidth: "",
    maxLength: "",
    setupTime: "",
    setupMode: "",
    sheetChangeTime: "",
    sheetChangeMode: "",
  };

  const inputFields = [
    { name: "name", type: "text", placeholder: "Technology Name" },
    {
      name: "cuttingSpeed",
      type: "number",
      placeholder: "Cutting Speed (mm/hr)",
    },
    {
      name: "maxWidth",
      type: "number",
      placeholder: "Maximum sheet width (mm)",
    },
    {
      name: "maxLength",
      type: "number",
      placeholder: "Maximum sheet length (mm)",
    },
    { name: "setupTime", type: "number", placeholder: "Setup time (s)" },
    { name: "setupMode", type: "text", placeholder: "Setup mode" },
    {
      name: "sheetChangeTime",
      type: "number",
      placeholder: "Sheet change time (s)",
    },
    { name: "sheetChangeMode", type: "text", placeholder: "Sheet change mode" },
  ];

  const collectionName = "CuttingTechs";

  // Fetch cutting technologies from Firestore
  useEffect(() => {
    const getCuttingTechs = async () => {
      try {
        const techs = await fetchDocuments(collectionName);
        setCuttingTechs(techs);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cutting technologies:", error);
        setLoading(false);
      }
    };

    getCuttingTechs();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddCuttingTech = (newTech) => {
    setCuttingTechs([...cuttingTechs, newTech]);
  };

  const handleDeleteCuttingTech = async () => {
    if (!techToDelete?.id) return;
    try {
      await deleteDocument(collectionName, techToDelete.id);
      setCuttingTechs(
        cuttingTechs.filter((tech) => tech.id !== techToDelete.id),
      );
      setOpenConfirm(false);
    } catch (error) {
      console.error("Error deleting cutting technology:", error);
    }
  };

  const handleDeleteClick = (tech) => {
    setTechToDelete(tech);
    setOpenConfirm(true);
  };

  // Function to open the edit modal with the selected technology
  const handleEditClick = (tech) => {
    setTechToEdit(tech);
    setIsEditModalOpen(true);
  };

  // Function to handle saving the updated tech details
  const handleSaveEdit = async (updatedTech) => {
    try {
      // Update the document in Firestore
      await updateDocument(collectionName, updatedTech.id, updatedTech);
      // Update the local state
      setCuttingTechs(
        cuttingTechs.map((tech) =>
          tech.id === updatedTech.id ? updatedTech : tech,
        ),
      );
      setIsEditModalOpen(false); // Close the edit modal
    } catch (error) {
      console.error("Error updating cutting technology:", error);
    }
  };

  if (loading) return <PreLoader />;

  return (
    <div className="w-full bg-slate-100 font-body">
      <NavbarAdmin />

      <main className="m-auto flex min-h-screen w-full flex-col items-center px-[5%] py-5">
        <h1 className="mb-5 text-center font-primary text-3xl">
          Cutting Technologies
        </h1>
        <div className="mb-5 flex w-full flex-col items-center md:flex-row md:justify-between">
          <h1 className="mb-4 text-center font-primary text-xl md:mb-0">
            Cutting Technologies
          </h1>
          <Button
            variant="default"
            className="rounded-full font-secondary"
            onClick={handleOpenModal}
          >
            +Add Cutting Technologies
          </Button>
        </div>
        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cuttingTechs.map((tech) => (
            <div
              key={tech.id}
              className="flex min-h-72 flex-col rounded-lg border-[0.2px] border-[#585858] bg-[#EEEFF2] p-5"
            >
              <div className="flex justify-between">
                <h1 className="font-body text-xl">{tech.name}</h1>
                <div className="flex space-x-1">
                  <img
                    src={editsvg}
                    className="mr-2 cursor-pointer"
                    alt="Edit"
                    onClick={() => handleEditClick(tech)} // Open edit modal
                  />
                  <img
                    src={deletesvg}
                    className="cursor-pointer"
                    alt="Delete"
                    onClick={() => handleDeleteClick(tech)} // Open confirmation dialog
                  />
                </div>
              </div>
              <div className="mx-2 mt-6 text-[#535353]">
                <div className="mt-4 flex justify-between">
                  <div className="text-black">Cutting Speed (mm/hr)</div>
                  <div>{tech.cuttingSpeed}</div>
                </div>
                <div className="mt-4 flex justify-between">
                  <div className="text-black">Maximum sheet width (mm)</div>
                  <div>{tech.maxWidth}</div>
                </div>
                <div className="mt-4 flex justify-between">
                  <div className="text-black">Maximum sheet length (mm)</div>
                  <div>{tech.maxLength}</div>
                </div>
                <div className="mt-4 flex justify-between">
                  <div className="text-black">Setup time (s)</div>
                  <div>{tech.setupTime}</div>
                </div>
                <div className="mt-4 flex justify-between">
                  <div className="text-black">Setup mode</div>
                  <div>{tech.setupMode}</div>
                </div>
                <div className="mt-4 flex justify-between">
                  <div className="text-black">Sheet change time (s)</div>
                  <div>{tech.sheetChangeTime}</div>
                </div>
                <div className="mt-4 flex justify-between">
                  <div className="text-black">Sheet change mode</div>
                  <div>{tech.sheetChangeMode}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <FooterAdmin />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAdd={handleAddCuttingTech}
        collectionName={collectionName}
        inputFields={inputFields}
        initialValues={initialTechState}
      />

      <ConfirmationDialog
        open={openConfirm}
        onConfirm={handleDeleteCuttingTech}
        onCancel={() => setOpenConfirm(false)}
      />

      {/* Edit Modal Component */}
      {techToEdit && (
        <EditModalCuttingTechs
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveEdit}
          tech={techToEdit}
        />
      )}
    </div>
  );
}

export default CuttingTechs;
