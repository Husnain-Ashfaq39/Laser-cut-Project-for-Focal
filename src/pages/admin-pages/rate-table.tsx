import { useEffect, useState } from 'react';
import FooterAdmin from '@/components/footer/fouter-admin';
import NavbarAdmin from '@/components/nav/navbar-admin';
import { Search } from '@/components/_ui/search';
import { Button } from '@/components/_ui/button';
import Modal from '@/components/Modal';
import { deleteDocument, fetchDocuments, addDocument, updateDocument } from '@/services/db-services';
import { DataTable } from '@/components/tables/data-table';
import { TableDataColumn } from '@/components/tables/table-data-column';
import { Select, SelectContent, SelectGroup, SelectTrigger, SelectValue, SelectItem } from '@/components/_ui/select';
import EditModal from '@/components/edit-modal';

function RateTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSheetModalOpen, setIsSheetModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [cuttingTechs, setCuttingTechs] = useState([]);
  const [selectedCuttingTech, setSelectedCuttingTech] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingMaterials, setLoadingMaterials] = useState(true);
  const [loadingCuttingTechs, setLoadingCuttingTechs] = useState(true);
  const [errorMaterials, setErrorMaterials] = useState(null);
  const [errorCuttingTechs, setErrorCuttingTechs] = useState(null);
  const [rateTablesetting, setRateTablesetting] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const initialMaterialState = {
    name: '',
    density: '',
    standardMarkup: '',
    customerSuppliedFee: '',
  };

  const inputFields = [
    { name: 'name', type: 'text', placeholder: 'Material Name' },
    { name: 'density', type: 'number', placeholder: 'Density (kg/m³)' },
    { name: 'standardMarkup', type: 'number', placeholder: 'Standard Markup (%)' },
    { name: 'customerSuppliedFee', type: 'number', placeholder: 'Customer Supplied Fee' },
  ];

  const initialSheetState = {
    thickness: '',
    web: '',
    cuttingFeedRate: '',
    pierceTime: '',
    appliedHourlyRate: '',
  };


  const inputFieldsSheet = [
    { name: 'thickness', type: 'number', placeholder: 'Thickness' },
    { name: 'web', type: 'text', placeholder: 'Web' },
    { name: 'cuttingFeedRate', type: 'number', placeholder: 'Cutting Feed Rate' },
    { name: 'pierceTime', type: 'number', placeholder: 'Pierce Time' },
    { name: 'appliedHourlyRate', type: 'number', placeholder: 'Applied Hourly Rate' },
  ];


  useEffect(() => {
    // Fetch Materials
    const getMaterials = async () => {
      try {
        const fetchedMaterials = await fetchDocuments('Materials');
        setMaterials(fetchedMaterials);
        setLoadingMaterials(false);
      } catch (error) {
        console.error('Error fetching Materials:', error);
        setErrorMaterials('Failed to fetch Materials');
        setLoadingMaterials(false);
      }
    };

    // Fetch CuttingTechs
    const getCuttingTechs = async () => {
      try {
        const fetchedCuttingTechs = await fetchDocuments('CuttingTechs');
        setCuttingTechs(fetchedCuttingTechs);
        setSelectedCuttingTech(fetchedCuttingTechs[0]); // Set the first item as default
        setLoadingCuttingTechs(false);
      } catch (error) {
        console.error('Error fetching CuttingTechs:', error);
        setErrorCuttingTechs('Failed to fetch Cutting Technologies');
        setLoadingCuttingTechs(false);
      }
    };

    getMaterials();
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
  };

  const handleAddMaterial = (newMaterial) => {
    setMaterials((prevMaterials) => [...prevMaterials, newMaterial]);
  };

  const handleCardClick = async (material) => {
    setSelectedMaterial(material);

    if (!selectedCuttingTech) {
      console.error('Error: No Cutting Technology selected.');
      return;
    }
    else {
      console.log('selected cutting tech ' + selectedCuttingTech.name);

    }

    try {
      // Use the updated fetchDocuments with filters
      const existingDocuments = await fetchDocuments('RateTable', [
        { field: 'materialID', operator: '==', value: material.id },
        { field: 'cuttingTechID', operator: '==', value: selectedCuttingTech.id }
      ]);


      if (existingDocuments.length > 0) {
        setRateTablesetting(existingDocuments[0]);
        console.log(rateTablesetting);
        console.log('RateTable document with the same materialID and cuttingTechID already exists.');
        return;
      }
      else {
        const rateTableDocument = {
          materialID: material.id,
          cuttingTechID: selectedCuttingTech.id,
          name: 'Lorem',
          baseHourlyRateMarkup: 0,
          etchingFeedRate: 0,
          rateData: [],
        };

        await addDocument('RateTable', rateTableDocument);
        console.log('RateTable document created successfully.');
      }
    } catch (error) {
      console.error('Error creating RateTable document:', error);
    }
  };




  const handleDeleteMaterial = async (materialId) => {
    try {
      await deleteDocument('Materials', materialId);
      setMaterials((prevMaterials) =>
        prevMaterials.filter((material) => material.id !== materialId)
      );
      setSelectedMaterial(null);
    } catch (error) {
      console.error('Error deleting Material:', error);
    }
  };

   // Function to open the edit modal
   const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };

  // Function to save the updated rate table settings
  const handleSaveRateTable = async (updatedRateTable) => {
    try {
      await updateDocument('RateTable', updatedRateTable.id, updatedRateTable);
      setRateTablesetting(updatedRateTable);
      console.log('RateTable updated successfully.');
    } catch (error) {
      console.error('Error updating RateTable:', error);
    }
  };

  // Filter materials based on search query
  const filteredMaterials = materials.filter((material) =>
    material.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full bg-slate-100 font-body">
      <NavbarAdmin />
      <main className="m-auto flex min-h-screen flex-col px-4 sm:px-6 lg:px-[5%] py-5 items-center">
        <h1 className="text-center font-primary text-2xl sm:text-3xl mb-5">Rate Table</h1>

        <div className="mt-6 w-full space-y-5 rounded-lg border border-gray-300 bg-white p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row justify-start items-center lg:space-y-0 lg:space-x-5">
          <div className='w-full lg:w-56'>
            {loadingCuttingTechs ? (
              <div>Loading Cutting Technologies...</div>
            ) : errorCuttingTechs ? (
              <div className="text-red-500">{errorCuttingTechs}</div>
            ) : (
              <Select
                value={selectedCuttingTech?.id}
                onValueChange={(value) => {
                  const selectedTech = cuttingTechs.find(tech => tech.id === value);
                  setSelectedCuttingTech(selectedTech);
                }}>
                <SelectTrigger className="w-full font-medium">
                  <SelectValue placeholder="Cutting Technology" />
                </SelectTrigger>
                <SelectContent className="font-secondary font-medium">
                  <SelectGroup>
                    {cuttingTechs.map((tech) => (
                      <SelectItem key={tech.id} value={tech.id}>
                        {tech.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

            )}
          </div>

          {/* Search Input */}
          <Search
            type="text"
            className="font-medium w-full lg:w-56 rounded-lg h-10"
            placeholder="Search Material"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Add New Material Button */}
          <Button
            variant="default"
            className="rounded-full font-medium w-full lg:w-auto"
            onClick={handleOpenModal}
          >
            + Add New Material
          </Button>
        </div>

        {/* Materials Grid */}
        <div className="my-16 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 font-body">
          {loadingMaterials ? (
            <div>Loading Materials...</div>
          ) : errorMaterials ? (
            <div className="text-red-500">{errorMaterials}</div>
          ) : filteredMaterials.length > 0 ? (
            filteredMaterials.map((material) => (
              <div
                key={material.id}
                className={`bg-white shadow-md rounded-lg border p-6 cursor-pointer transition-transform transform hover:scale-105 ${selectedMaterial?.id === material.id ? 'border-blue-500' : 'border-gray-200'
                  }`}
                onClick={() => handleCardClick(material)}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">{material.name}</h2>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteMaterial(material.id);
                    }}
                  >
                    Delete
                  </Button>
                </div>
                <div className="text-gray-600">
                  <p>Sheets: {material.sheets ? material.sheets.length : 0}</p>
                </div>
              </div>
            ))
          ) : (
            <div>No materials found.</div>
          )}
        </div>

        {/* Selected Material Details */}
        {selectedMaterial && (
          <div className="w-full mb-14">
            <h2 className="text-2xl font-semibold mb-6">
              {selectedMaterial.name} Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
              <div className="bg-white shadow-md rounded-lg border p-6">
                <div className='flex justify-between'>

                <h3 className="text-xl font-semibold mb-4">RateTable Settings</h3>
                <Button
                    variant="destructive"
                    className="font-secondary"
                    onClick={handleOpenEditModal} // Open edit modal on click
                  >
                    Edit
                  </Button>
                  </div>
                <div className="text-gray-600 space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Name</span>
                    <span>{rateTablesetting?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Base hourly rate markup</span>
                    <span>{rateTablesetting?.baseHourlyRateMarkup}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">
                      Etching feed rate
                    </span>
                    <span>{rateTablesetting?.etchingFeedRate}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className='w-full'>
              {selectedMaterial && (
                <>
                  <Button
                    variant="default"
                    className="rounded-full font-secondary"
                    onClick={handleOpenSheetModal} // Open sheet modal on click
                  >
                    +Add new Data
                  </Button>
                  <DataTable
                    data={rateTablesetting?.rateData?.map(data => ({ ...data, id:rateTablesetting?.id })) || []}
                    columns={TableDataColumn}
                  />

                </>
              )}
            </div>

          </div>
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

       {/* Edit RateTable Modal */}
       <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        rateTablesetting={rateTablesetting}
        onSave={handleSaveRateTable}
      />

      {selectedMaterial && (
        <Modal
          isOpen={isSheetModalOpen}
          onClose={handleCloseModal}
          onAdd={() => { }} // Function to handle adding a new sheet
          collectionName="RateTable" // This is not actually used since we're updating an existing document
          inputFields={inputFieldsSheet} // Fields to be displayed in the modal for adding a sheet
          initialValues={initialSheetState} // Initial values for the sheet form
          updateDoc={true} // Indicate that this is an update operation
          docID={rateTablesetting?.id} // Pass the selected material ID
          arrayFieldName="rateData"
        />
      )}
    </div>
  );
}

export default RateTable;
