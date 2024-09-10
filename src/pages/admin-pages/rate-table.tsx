import { useCallback, useEffect, useState } from 'react';
import FooterAdmin from '@/components/footer/fouter-admin';
import NavbarAdmin from '@/components/nav/navbar-admin';
import { Search } from '@/components/_ui/search';
import { Button } from '@/components/_ui/button';
import Modal from '@/components/Modal';
import { fetchDocuments, addDocument, updateDocument } from '@/services/db-services';
import { DataTable } from '@/components/tables/data-table';
import { TableDataColumn } from '@/components/tables/table-data-column';
import { Select, SelectContent, SelectGroup, SelectTrigger, SelectValue, SelectItem } from '@/components/_ui/select';
import editsvg from '@/assets/icons/edit.svg';
import PreLoader from '@/components/pre-loader';
import { useLocation } from 'react-router-dom';
import EditModal2 from '@/components/edit-modal-2';
import leftsvg from '@/assets/icons/left.svg'
import rightsvg from '@/assets/icons/right.svg'

function RateTable() {
  const [isSheetModalOpen, setIsSheetModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [cuttingTechs, setCuttingTechs] = useState([]);
  const [selectedCuttingTech, setSelectedCuttingTech] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
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
    const fetchData = async () => {
      try {
        const [fetchedMaterials, fetchedCuttingTechs] = await Promise.all([
          fetchDocuments('Materials'),
          fetchDocuments('CuttingTechs'),
        ]);

        setMaterials(fetchedMaterials);
        setCuttingTechs(fetchedCuttingTechs);
        setSelectedCuttingTech(fetchedCuttingTechs[0]);
      } catch (error) {
        console.error('Error fetching data:', error);
        setErrorMaterials('Failed to fetch Materials');
        setErrorCuttingTechs('Failed to fetch Cutting Technologies');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchUpdatedDocs = useCallback(async (material) => {
    try {
      const existingDocuments = await fetchDocuments('RateTable', [
        { field: 'materialID', operator: '==', value: material.id },
        { field: 'cuttingTechID', operator: '==', value: selectedCuttingTech.id },
      ]);
  
      if (existingDocuments.length > 0) {
        setRateTablesetting(existingDocuments[0]);
        setrateTableExist(true);
      } else {
        const rateTableDocument = {
          materialID: material.id,
          cuttingTechID: selectedCuttingTech.id,
          name: 'Lorem',
          baseHourlyRateMarkup: 0,
          etchingFeedRate: 0,
          rateData: [],
        };
        const newDoc = await addDocument('RateTable', rateTableDocument);
  
        setRateTablesetting(newDoc);
        setrateTableExist(true);
        fetchUpdatedDocs(material);
      }
    } catch (error) {
      console.error('Error fetching or creating RateTable:', error);
    }
  }, [selectedCuttingTech]);

  useEffect(() => {
    if (location.state) {
      const { cuttingTech, material } = location.state;
      setSelectedMaterial(material);
      setSelectedCuttingTech(cuttingTech);
      fetchUpdatedDocs(material);
    }
  }, [location.state, fetchUpdatedDocs]);

  const handleCardClick = async (material) => {
    setSelectedMaterial(material);
    try {
      const existingDocuments = await fetchDocuments('RateTable', [
        { field: 'materialID', operator: '==', value: material.id },
        { field: 'cuttingTechID', operator: '==', value: selectedCuttingTech.id },
      ]);
  
      if (existingDocuments.length > 0) {
        setRateTablesetting(existingDocuments[0]);
        setrateTableExist(true);
      } else {
        setrateTableExist(false);
      }
    } catch (error) {
      console.error('Error fetching RateTable:', error);
    }
  };

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveRateTable = async (updatedRateTable) => {
    try {
      await updateDocument('RateTable', updatedRateTable.id, updatedRateTable);
      setRateTablesetting(updatedRateTable);
      console.log('RateTable updated successfully.');
    } catch (error) {
      console.error('Error updating RateTable:', error);
    }
  };

  const handleAddNewData = async (newSheetData) => {
    try {
      const updatedRateData = [...rateTablesetting.rateData, newSheetData];
  
      await updateDocument('RateTable', rateTablesetting.id, { rateData: updatedRateData });
  
      setRateTablesetting((prev) => ({
        ...prev,
        rateData: updatedRateData,
      }));
  
      console.log('New data added successfully.');
      setIsSheetModalOpen(false);
    } catch (error) {
      console.error('Error adding new data:', error);
    }
  };

  const filteredMaterials = materials.filter((material) =>
    material?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedMaterials = filteredMaterials.slice(
    (currentPage - 1) * materialsPerPage,
    currentPage * materialsPerPage
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

  if (loading) return <PreLoader />;

  return (
    <div className="w-full bg-slate-100 font-body">
      <NavbarAdmin />
      <main className="m-auto flex min-h-screen flex-col px-4 sm:px-6 lg:px-[5%] py-5 items-center">
        <h1 className="text-center font-primary text-2xl sm:text-3xl mb-5">Rate Table</h1>

        <div className="mt-6 w-full space-y-5 rounded-lg border border-gray-300 bg-white p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row justify-start items-center lg:space-y-0 lg:space-x-5">
          <div className='w-full lg:w-56'>
            {errorCuttingTechs ? (
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
            className="font-medium w-full lg:w-56 rounded-lg h-10"
            placeholder="Search Material"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="my-16 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 font-body">
          {errorMaterials ? (
            <div className="text-red-500">{errorMaterials}</div>
          ) : paginatedMaterials.length > 0 ? (
            paginatedMaterials.map((material) => (
              <div
                key={material.id}
                className={`bg-white shadow-md rounded-lg border p-6 cursor-pointer transition-transform transform hover:scale-105 ${selectedMaterial?.id === material.id ? 'border-blue-500' : 'border-gray-200'
                  }`}
                onClick={() => handleCardClick(material)}
              >

                <h2 className="text-xl font-semibold mb-4">{material.name}</h2>

                <div className="text-gray-600">
                  <p>Sheets: {material.sheets ? material.sheets.length : 0}</p>
                </div>
              </div>
            ))
          ) : (
            <div>No materials found.</div>
          )}
        </div>

       
       
         <div className="flex justify-center space-x-4 my-4">
          <img src={leftsvg} className=' cursor-pointer' onClick={handlePrevPage}  alt="" />
          
          {Array.from({ length: totalPages }, (_, index) => (
            <Button
            className='rounded-full'
              key={index}
              variant={currentPage === index + 1 ? "destructive" : "default"}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </Button>
          ))}
         
          <img src={rightsvg} className=' cursor-pointer'  onClick={handleNextPage}  alt="" />
        </div>

        {selectedMaterial && (
          rateTableExist ? (
            <div className="w-full mb-14">
              <h2 className="text-2xl font-semibold mb-6">
                {selectedMaterial?.name} Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                <div className="bg-white shadow-md rounded-lg border p-6">
                  <div className="flex justify-between mb-4">
                    <h3 className="text-xl font-semibold">RateTable Settings</h3>
                    <img
                      src={editsvg}
                      alt="Edit"
                      className="cursor-pointer"
                      onClick={handleOpenEditModal}
                    />
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
                      <span className="font-medium">Etching feed rate</span>
                      <span>{rateTablesetting?.etchingFeedRate}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full">
                <Button
                  variant="default"
                  className="rounded-full font-secondary"
                  onClick={() => setIsSheetModalOpen(true)}
                >
                  +Add new Data
                </Button>
                <DataTable
                  data={
                    rateTablesetting?.rateData?.map(data => ({
                      ...data,
                      id: rateTablesetting?.id,
                      material: selectedMaterial,
                    })) || []
                  }
                  columns={TableDataColumn}
                />
              </div>
            </div>
          ) : (
            <div className="w-full bg-white shadow-md rounded-lg border p-6">
              <h3 className="text-xl font-semibold mb-4">No Rate Table Available</h3>
              <p className="mb-4 text-gray-600">
                No rate table exists for the selected material and cutting technology.
              </p>
              <Button variant="default" onClick={() => fetchUpdatedDocs(selectedMaterial)}>
                Create Rate Table
              </Button>
            </div>
          )
        )}
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
