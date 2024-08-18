import { useState, useEffect } from 'react';
import Modal from '@/components/cuting-techs/Modal';
import { Button } from '@/components/_ui/button';
import FooterAdmin from '@/components/footer/fouter-admin';
import NavbarAdmin from '@/components/nav/navbar-admin';
import { fetchDocuments } from '@/services/db-services'; // Import generic fetch function

function CuttingTechs() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cuttingTechs, setCuttingTechs] = useState([]);

    // Collection name for cutting technologies
    const collectionName = 'CuttingTechs';

    // Fetch cutting technologies from Firestore
    useEffect(() => {
        const getCuttingTechs = async () => {
            try {
                const techs = await fetchDocuments(collectionName);
                setCuttingTechs(techs);
            } catch (error) {
                console.error('Error fetching cutting technologies:', error);
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
        // Add new tech to the local state for real-time UI update
        setCuttingTechs([...cuttingTechs, newTech]);
    };

    return (
        <div className="w-full bg-slate-100 font-body">
            <NavbarAdmin />
            <main className="m-auto flex min-h-screen flex-col px-[5%] py-5 items-center">
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
                    {cuttingTechs.map((tech, index) => (
                        <div key={index} className='min-h-72 bg-[#EEEFF2] rounded-lg border-[0.2px] border-[#585858] flex flex-col p-5'>
                            <h1 className="font-body text-xl">
                                {tech.name}
                            </h1>
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
                collectionName={collectionName}  // Pass collection name to modal
            />
        </div>
    );
}

export default CuttingTechs;
