import { useCallback, useEffect, useState } from "react";
import FooterAdmin from "@/components/footer/footer-admin";
import NavbarAdmin from "@/components/nav/navbar-admin";
import { Search } from "@/components/_ui/search";
import { Button } from "@/components/_ui/button";
import Modal from "@/components/Modal";
import {
  fetchDocuments,
  addDocument,
  updateDocument,
  updateItemInArrayField,
} from "@/services/db-services";
import { DataTable } from "@/components/tables/data-table";
import { TableDataColumn } from "@/components/tables/rate-table-columns";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/_ui/select";
import editsvg from "@/assets/icons/edit.svg";
import PreLoader from "@/components/pre-loader";
import { useLocation } from "react-router-dom";
import EditModal2 from "@/components/edit-modal-2";
import leftsvg from "@/assets/icons/left.svg";
import rightsvg from "@/assets/icons/right.svg";

function RateTable() {
  const [isSheetModalOpen, setIsSheetModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [cuttingTechs, setCuttingTechs] = useState([]);
  const [selectedCuttingTech, setSelectedCuttingTech] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMaterials, setErrorMaterials] = useState(null);
  const [errorCuttingTechs, setErrorCuttingTechs] = useState(null);
  const [rateTablesetting, setRateTablesetting] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [rateTableExist, setrateTableExist] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Added for pagination
  const materialsPerPage = 3; // Show 3 materials at a time

  const initialSheetState = {
    thickness: "",
    cuttingFeedRate: "",
    pierceTime: "",
    appliedHourlyRate: "",
  };

  const inputFieldsSheet = [
    { name: "thickness", type: "number", placeholder: "Thickness" },
    {
      name: "cuttingFeedRate",
      type: "number",
      placeholder: "Cutting Feed Rate",
    },
    { name: "pierceTime", type: "number", placeholder: "Pierce Time" },
    {
      name: "appliedHourlyRate",
      type: "number",
      placeholder: "Applied Hourly Rate ($/hr)",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedMaterials, fetchedCuttingTechs] = await Promise.all([
          fetchDocuments("Materials"),
          fetchDocuments("CuttingTechs"),
        ]);

        setMaterials(fetchedMaterials);
        setCuttingTechs(fetchedCuttingTechs);
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorMaterials("Failed to fetch Materials");
        setErrorCuttingTechs("Failed to fetch Cutting Technologies");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchUpdatedDocs = useCallback(
    async (material) => {
      try {
        const existingDocuments = await fetchDocuments("RateTable", [
          { field: "materialID", operator: "==", value: material.id },
          {
            field: "cuttingTechID",
            operator: "==",
            value: selectedCuttingTech.id,
          },
        ]);

        if (existingDocuments.length > 0) {
          setRateTablesetting(existingDocuments[0]);
          setrateTableExist(true);
        } else {
          const rateTableDocument = {
            materialID: material.id,
            cuttingTechID: selectedCuttingTech.id,
            name: "Lorem",
            baseHourlyRateMarkup: 0,
            etchingFeedRate: 0,
            rateData: [],
          };
          const newDoc = await addDocument("RateTable", rateTableDocument);

          setRateTablesetting(newDoc);
          setrateTableExist(true);
          fetchUpdatedDocs(material);
        }
      } catch (error) {
        console.error("Error fetching or creating RateTable:", error);
      }
    },
    [selectedCuttingTech],
  );

  useEffect(() => {
    if (location.state) {
      const { cuttingTech, material } = location.state;
      setSelectedMaterial(material);
      setSelectedCuttingTech(cuttingTech);
      fetchUpdatedDocs(material);
    } else {
      setSelectedCuttingTech(cuttingTechs[0]);
    }
  }, []);

  useEffect(() => {
    if (!selectedCuttingTech) {
      const laserTech = cuttingTechs.find((tech) => tech.name === "Laser");
      if (laserTech) {
        setSelectedCuttingTech(laserTech);
      }
    }
  }, [cuttingTechs, selectedCuttingTech]);

  const handleCardClick = async (material) => {
    setSelectedMaterial(material);
    try {
      const existingDocuments = await fetchDocuments("RateTable", [
        { field: "materialID", operator: "==", value: material.id },
        {
          field: "cuttingTechID",
          operator: "==",
          value: selectedCuttingTech.id,
        },
      ]);

      if (existingDocuments.length > 0) {
        setRateTablesetting(existingDocuments[0]);
        setrateTableExist(true);
      } else {
        setrateTableExist(false);
      }
    } catch (error) {
      console.error("Error fetching RateTable:", error);
    }
  };

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveRateTable = async (updatedRateTable) => {
    try {
      await updateDocument("RateTable", updatedRateTable.id, updatedRateTable);
      setRateTablesetting(updatedRateTable);
      console.log("RateTable updated successfully.");
    } catch (error) {
      console.error("Error updating RateTable:", error);
    }
  };

  const handleAddNewData = async (newSheetData) => {
    try {
      const updatedRateData = [...rateTablesetting.rateData, newSheetData];

      await updateDocument("RateTable", rateTablesetting.id, {
        rateData: updatedRateData,
      });

      setRateTablesetting((prev) => ({
        ...prev,
        rateData: updatedRateData,
      }));

      console.log("New data added successfully.");
      setIsSheetModalOpen(false);
    } catch (error) {
      console.error("Error adding new data:", error);
    }
  };

  const filteredMaterials = materials.filter((material) =>
    material?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const paginatedMaterials = filteredMaterials.slice(
    (currentPage - 1) * materialsPerPage,
    currentPage * materialsPerPage,
  );

  const totalPages = Math.ceil(filteredMaterials.length / materialsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleSaveTableData = async (data, updatedData) => {
    try {
      // Update the rateData in the database
      await updateItemInArrayField(
        "RateTable",
        rateTablesetting.id,
        "rateData",
        data,
        updatedData,
      );

      // Create a new array reference by updating the specific item
      const updatedRateData = rateTablesetting.rateData.map((item) =>
        item.id === data.id ? updatedData : item,
      );

      // Update the state with the new rateData array
      setRateTablesetting((prev) => ({
        ...prev,
        rateData: updatedRateData, // This creates a new reference for rateData
      }));

      console.log("Rate table data updated successfully.");
    } catch (error) {
      console.error("Error updating table data:", error);
    }
  };
  useEffect(() => {
    console.log("RateTable setting updated:", rateTablesetting);
  }, [rateTablesetting]);

  if (loading) return <PreLoader />;

  return (
    <div className="w-full bg-slate-100 font-body">
      <NavbarAdmin />
      <main className="m-auto flex min-h-screen flex-col items-center px-4 py-5 sm:px-6 lg:px-[5%]">
        <h1 className="mb-5 text-center font-primary text-2xl sm:text-3xl">
          Rate Table
        </h1>

        <div className="mt-6 flex w-full flex-col items-center justify-start space-y-5 rounded-lg border border-gray-300 bg-white p-4 sm:p-6 lg:flex-row lg:space-x-5 lg:space-y-0 lg:p-8">
          <div className="w-full lg:w-56">
            {errorCuttingTechs ? (
              <div className="text-red-500">{errorCuttingTechs}</div>
            ) : (
              <Select
                value={selectedCuttingTech?.id}
                onValueChange={(value) => {
                  const selectedTech = cuttingTechs.find(
                    (tech) => tech.id === value,
                  );
                  setSelectedCuttingTech(selectedTech);
                }}
              >
                <SelectTrigger className="w-full font-medium">
                  <SelectValue placeholder="Cutting Technology" />
                </SelectTrigger>
                <SelectContent className="font-secondary font-medium">
                  <SelectGroup>
                    {cuttingTechs?.map((tech) => (
                      <SelectItem key={tech.id} value={tech.id}>
                        {tech.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </div>

          <Search
            type="text"
            className="h-10 w-full rounded-lg font-medium lg:w-56"
            placeholder="Search Material"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="my-16 grid w-full grid-cols-1 gap-5 font-body sm:grid-cols-2 lg:grid-cols-3">
          {errorMaterials ? (
            <div className="text-red-500">{errorMaterials}</div>
          ) : paginatedMaterials.length > 0 ? (
            paginatedMaterials.map((material) => (
              <div
                key={material.id}
                className={`transform cursor-pointer rounded-lg border bg-white p-6 shadow-md transition-transform hover:scale-105 ${
                  selectedMaterial?.id === material.id
                    ? "border-blue-500"
                    : "border-gray-200"
                }`}
                onClick={() => handleCardClick(material)}
              >
                <h2 className="mb-4 text-xl font-semibold">{material.name}</h2>

                <div className="text-gray-600">
                  <p>Sheets: {material.sheets ? material.sheets.length : 0}</p>
                </div>
              </div>
            ))
          ) : (
            <div>No materials found.</div>
          )}
        </div>

        <div className="my-4 flex justify-center space-x-4">
          <img
            src={leftsvg}
            className="cursor-pointer"
            onClick={handlePrevPage}
            alt=""
          />

          {Array.from({ length: totalPages }, (_, index) => (
            <Button
              className="rounded-full"
              key={index}
              variant={currentPage === index + 1 ? "destructive" : "default"}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </Button>
          ))}

          <img
            src={rightsvg}
            className="cursor-pointer"
            onClick={handleNextPage}
            alt=""
          />
        </div>

        {selectedMaterial &&
          (rateTableExist ? (
            <div className="mb-14 w-full">
              <h2 className="mb-6 text-2xl font-semibold">
                {selectedMaterial?.name} Details
              </h2>

              <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-lg border bg-white p-6 shadow-md">
                  <div className="mb-4 flex justify-between">
                    <h3 className="text-xl font-semibold">
                      RateTable Settings
                    </h3>
                    <img
                      src={editsvg}
                      alt="Edit"
                      className="cursor-pointer"
                      onClick={handleOpenEditModal}
                    />
                  </div>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex justify-between">
                      <span className="font-medium">Name</span>
                      <span>{rateTablesetting?.name}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full">
                <Button
                  variant="default"
                  className="mb-5 rounded-full font-secondary"
                  onClick={() => setIsSheetModalOpen(true)}
                >
                  +Add new Data
                </Button>
                <div className="mt-10 flex min-h-[150px] min-w-[500px] flex-col space-y-8 rounded-md border bg-white p-8 shadow-xl">
                  <DataTable
                    data={
                      rateTablesetting?.rateData?.map((data) => ({
                        ...data,
                        id: rateTablesetting?.id,
                        material: selectedMaterial,
                      })) || []
                    }
                    columns={TableDataColumn(handleSaveTableData)}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full rounded-lg border bg-white p-6 shadow-md">
              <h3 className="mb-4 text-xl font-semibold">
                No Rate Table Available
              </h3>
              <p className="mb-4 text-gray-600">
                No rate table exists for the selected material and cutting
                technology.
              </p>
              <Button
                variant="default"
                onClick={() => fetchUpdatedDocs(selectedMaterial)}
              >
                Create Rate Table
              </Button>
            </div>
          ))}
      </main>
      <FooterAdmin />

      <EditModal2
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        rateTablesetting={rateTablesetting}
        onSave={handleSaveRateTable}
      />

      {selectedMaterial && (
        <Modal
          isOpen={isSheetModalOpen}
          onClose={() => setIsSheetModalOpen(false)}
          onAdd={(newData) => handleAddNewData(newData)}
          collectionName="RateTable"
          inputFields={inputFieldsSheet}
          initialValues={initialSheetState}
          updateDoc={true}
          docID={rateTablesetting?.id}
          arrayFieldName="rateData"
          isTableData={true}
          selectedMaterial={selectedMaterial}
        />
      )}
    </div>
  );
}

export default RateTable;
