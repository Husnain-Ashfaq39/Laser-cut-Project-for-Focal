import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../_ui/dialog";
import { useState } from 'react';
import { Button } from '@/components/_ui/button';

function Modal({ isOpen, onClose, onAdd }) {
    const [newTech, setNewTech] = useState({
        name: '',
        maxWidth: '',
        maxLength: '', 
        setupTime: '',
        setupMode: '',
        sheetChangeTime: '',
        sheetChangeMode: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewTech({ ...newTech, [name]: value });
    };

    const handleSubmit = () => {
        // Validate input if necessary
        onAdd(newTech);
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-lg w-full p-6 bg-white rounded-lg shadow-lg transform transition-all sm:w-full sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">Add Cutting Technology</DialogTitle>
                    <DialogDescription className="text-sm text-gray-500">
                        Enter details for the new cutting technology.
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-4 space-y-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Technology Name"
                        value={newTech.name}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                    <input
                        type="number"
                        name="maxWidth"
                        placeholder="Maximum sheet width (mm)"
                        value={newTech.maxWidth}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                    <input
                        type="number"
                        name="maxLength"
                        placeholder="Maximum sheet length (mm)"
                        value={newTech.maxLength}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                    <input
                        type="number"
                        name="setupTime"
                        placeholder="Setup time (s)"
                        value={newTech.setupTime}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                    <input
                        type="text"
                        name="setupMode"
                        placeholder="Setup mode"
                        value={newTech.setupMode}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                    <input
                        type="number"
                        name="sheetChangeTime"
                        placeholder="Sheet change time (s)"
                        value={newTech.sheetChangeTime}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                    <input
                        type="text"
                        name="sheetChangeMode"
                        placeholder="Sheet change mode"
                        value={newTech.sheetChangeMode}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                    <div className="flex justify-end mt-4 space-x-2">
                        <Button variant="default" onClick={handleSubmit}>
                            Add Technology
                        </Button>
                        
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default Modal;
