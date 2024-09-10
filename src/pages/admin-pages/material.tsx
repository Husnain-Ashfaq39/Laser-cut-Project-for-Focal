import FooterAdmin from '@/components/footer/fouter-admin';
import NavbarAdmin from '@/components/nav/navbar-admin';
import { Search } from '@/components/_ui/search';
import { Button } from '@/components/_ui/button';
import { useEffect, useState } from 'react';
import Modal from '@/components/Modal';
import { deleteDocument, deleteDocumentsByMaterialId, fetchDocuments } from '@/services/db-services';
import { DataTable } from '@/components/tables/data-table';
import { SheetsColumn } from '@/components/tables/sheets-column';
import deletesvg from '@/assets/icons/delete.svg'
import PreLoader from '@/components/pre-loader';
import { useNavigate } from 'react-router-dom';

function Materials() {
  const navigate=useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSheetModalOpen, setIsSheetModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [cuttingTechs, setCuttingTechs] = useState([]);

  const [errorMaterials, setErrorMaterials] = useState(null);
  const [loading, setLoading] = useState(true);

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
    size: '',
    sheetCost: '',
    sheetRate: '',
    appliedMarkup: '',
  };

  const inputFieldsSheet = [
    { name: 'thickness', type: 'number', placeholder: 'Thickness' },
    { name: 'size', type: 'text', placeholder: 'Size' },
    { name: 'sheetCost', type: 'number', placeholder: 'Sheet Cost' },
    { name: 'sheetRate', type: 'number', placeholder: 'Sheet Rate' },
    { name: 'appliedMarkup', type: 'number', placeholder: 'Applied Markup' },
  ];

  // Fetch Materials
  const getMaterials = async () => {
    try {
      const fetchedMaterials = await fetchDocuments('Materials');
      setMaterials(fetchedMaterials);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching Materials:', error);
      setErrorMaterials('Failed to fetch Materials');
    }
  };

  useEffect(() => {
    getMaterials();

    const getCuttingTechs = async () => {
      try {
        const fetchedCuttingTechs = await fetchDocuments('CuttingTechs');
        setCuttingTechs(fetchedCuttingTechs);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching CuttingTechs:', error);
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
  };

  const handleAddMaterial = async() => {
    await getMaterials();
    
  };

  const handleCardClick = (material) => {
    setSelectedMaterial(material);
  };

  const handleDeleteMaterial = async (materialId) => {
    try {
      await deleteDocument('Materials', materialId);
      await deleteDocumentsByMaterialId('RateTable', materialId);
      setMaterials((prevMaterials) =>
        prevMaterials.filter((material) => material.id !== materialId)
      );
      setSelectedMaterial(null);
    } catch (error) {
      console.error('Error deleting Material:', error);
    }
  };

  // Filter materials based on search query
  const filteredMaterials = materials.filter((material) =>
    material?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading)
    return <PreLoader />
  return (
    <div className="w-full bg-slate-100 font-body">
      <NavbarAdmin />
      <main className="m-auto w-full flex min-h-screen flex-col px-4 sm:px-6 lg:px-[5%] py-5 items-center">
        <h1 className="text-center font-primary text-2xl sm:text-3xl mb-5">Materials</h1>

        <div className="mt-6 w-full space-y-5 rounded-lg border border-gray-300 bg-white p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row justify-start items-center lg:space-y-0 lg:space-x-5">
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
          {loading ? (
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

                  <img src={deletesvg} alt="" onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteMaterial(material.id);
                  }} />
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
                <h3 className="text-xl font-semibold mb-4">Material Settings</h3>
                <div className="text-gray-600 space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Density (kg/m³):</span>
                    <span>{selectedMaterial.density}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Standard Markup (%):</span>
                    <span>{selectedMaterial.standardMarkup}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">
                      Customer Supplied Fee (%):
                    </span>
                    <span>{selectedMaterial.customerSuppliedFee}</span>
                  </div>
                </div>
              </div>
              <div className="bg-white shadow-md rounded-lg border p-6">
                <h3 className="text-xl font-semibold mb-4">Rate Table:{selectedMaterial.name} </h3>
               
                {
                  cuttingTechs.map(cuttingtech => (
                      <div  key={cuttingtech.id} className="flex  cursor-pointer text-sm  text-blue-500" onClick={() => {
                        navigate('/admin/rate-table', {
                          state: {
                            cuttingTech: cuttingtech,
                            material: selectedMaterial,
                          },
                        });
                      }}>
                        {cuttingtech.name} : {selectedMaterial.name}
                      </div>
                  ))
                }
              </div>
            </div>
            {/* Sheets Table */}
            <div className='w-full'>
              {selectedMaterial && (
                <>
                  <Button
                    variant="default"
                    className="rounded-full font-secondary"
                    onClick={handleOpenSheetModal} // Open sheet modal on click
                  >
                    +Add new Sheet
                  </Button>
                  <DataTable
                    data={selectedMaterial?.sheets?.map(sheet => ({ ...sheet, id: selectedMaterial.id })) || []}
                    columns={SheetsColumn}
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

      {selectedMaterial && (
        <Modal
          isOpen={isSheetModalOpen}
          onClose={handleCloseModal}
          onAdd={() => { }} // Function to handle adding a new sheet
          collectionName="Materials" // This is not actually used since we're updating an existing document
          inputFields={inputFieldsSheet} // Fields to be displayed in the modal for adding a sheet
          initialValues={initialSheetState} // Initial values for the sheet form
          updateDoc={true} // Indicate that this is an update operation
          docID={selectedMaterial.id} // Pass the selected material ID
          arrayFieldName="sheets"
        />
      )}
    </div>
  );
}

export default Materials;


