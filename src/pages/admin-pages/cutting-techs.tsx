import { useState, useEffect } from 'react';
import Modal from '@/components/Modal';
import { Button } from '@/components/_ui/button';
import FooterAdmin from '@/components/footer/fouter-admin';
import NavbarAdmin from '@/components/nav/navbar-admin';
import { fetchDocuments, deleteDocument } from '@/services/db-services';
import PreLoader from '@/components/pre-loader';
import deletesvg from '@/assets/icons/delete.svg';
import ConfirmationDialog from '@/components/_ui/confirmation'; // Import ConfirmationDialog

function CuttingTechs() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cuttingTechs, setCuttingTechs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openConfirm, setOpenConfirm] = useState(false); // For confirmation dialog
    const [techToDelete, setTechToDelete] = useState(null); // Store the technology to be deleted

    const initialTechState = {
        name: '',
        maxWidth: '',
        maxLength: '', 
        setupTime: '',
        setupMode: '',
        sheetChangeTime: '',
        sheetChangeMode: '',
    };

    const inputFields = [
        { name: 'name', type: 'text', placeholder: 'Technology Name' },
        { name: 'maxWidth', type: 'number', placeholder: 'Maximum sheet width (mm)' },
        { name: 'maxLength', type: 'number', placeholder: 'Maximum sheet length (mm)' },
        { name: 'setupTime', type: 'number', placeholder: 'Setup time (s)' },
        { name: 'setupMode', type: 'text', placeholder: 'Setup mode' },
        { name: 'sheetChangeTime', type: 'number', placeholder: 'Sheet change time (s)' },
        { name: 'sheetChangeMode', type: 'text', placeholder: 'Sheet change mode' },
    ];

    // Collection name for cutting technologies
    const collectionName = 'CuttingTechs';

    // Fetch cutting technologies from Firestore
    useEffect(() => {
        const getCuttingTechs = async () => {
            try {
                const techs = await fetchDocuments(collectionName);
                setCuttingTechs(techs);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching cutting technologies:', error);
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
        if (!techToDelete?.id) {
            console.error('Tech ID is undefined');
            return;
        }
      
        try {
            // Delete the document from Firestore
            await deleteDocument(collectionName, techToDelete.id);
      
            // Remove the tech from local state for real-time UI update
            setCuttingTechs(cuttingTechs.filter(tech => tech.id !== techToDelete.id));
            setOpenConfirm(false); // Close the confirmation dialog
        } catch (error) {
            console.error('Error deleting cutting technology:', error);
        }
    };

    const handleDeleteClick = (tech) => {
        setTechToDelete(tech); // Store the technology to be deleted
        setOpenConfirm(true);  // Open the confirmation dialog
    };

    if (loading) return <PreLoader />;

    return (
        <div className="w-full bg-slate-100 font-body ">
            <NavbarAdmin />
            
            <main className="m-auto flex min-h-screen flex-col px-[5%] py-5 items-center w-full">

                <h1 className="text-center font-primary text-3xl mb-5">
                    Cutting Technologies
                </h1>
                <div className='flex flex-col md:flex-row md:justify-between items-center w-full mb-5'>
                    <h1 className="text-center font-primary text-xl mb-4 md:mb-0">
                        Cutting Technologies
                    </h1>
                    <Button variant="default" className="rounded-full font-secondary" onClick={handleOpenModal}>
                        +Add Cutting Technologies
                    </Button>
                </div>
                {/* Technologies card rendering dynamically */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full'>
                    {cuttingTechs.map((tech) => (
                        <div key={tech.id} className='min-h-72 bg-[#EEEFF2] rounded-lg border-[0.2px] border-[#585858] flex flex-col p-5'>
                            <div className='flex justify-between'>
                                <h1 className="font-body text-xl">
                                    {tech.name}
                                </h1>
                                
                                <img 
                                    src={deletesvg} 
                                    className=' cursor-pointer' 
                                    alt="Delete" 
                                    onClick={() => handleDeleteClick(tech)} // Open confirmation dialog
                                />
                            </div>
                            <div className="mx-2 mt-6 text-[#535353]">
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

            {/* Modal Component */}
            <Modal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal}
                onAdd={handleAddCuttingTech} 
                collectionName={collectionName}
                inputFields={inputFields}
                initialValues={initialTechState}
            />

            {/* Confirmation Dialog */}
            <ConfirmationDialog
                open={openConfirm}
                onConfirm={handleDeleteCuttingTech} // Perform delete after confirmation
                onCancel={() => setOpenConfirm(false)} // Close dialog on cancel
            />
        </div>
    );
}

export default CuttingTechs;
