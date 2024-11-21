/* eslint-disable @typescript-eslint/no-unused-vars */
// FileUpload.tsx
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/_ui/button";
import { Input } from "@/components/_ui/input";
import { Label } from "@/components/_ui/label";
import { X, Upload, File as FileIcon } from 'lucide-react';
import { removeUploadedFile } from "@/redux/slices/quote-parts-slice";
import { Document, Page } from 'react-pdf';
import { RootState } from "@/redux/store";

interface FileUploadProps {
    fileId: string;
    uploadedFilesInfo: { name: string; url: string }[];
    uploadedFiles: File[];
    onFileUpload: (files: File[]) => void; // Updated to accept multiple files
    handleRemoveExistingFile: (fileName: string) => void;
    isDisabled: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
    fileId,
    uploadedFilesInfo,
    uploadedFiles,
    onFileUpload,
    handleRemoveExistingFile,
    isDisabled
}) => {
    const dispatch = useDispatch();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = useState(false);
    const Quote = useSelector((state: RootState) => state.quoteParts);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files);
        }
    };

    const handleFiles = (files: FileList) => {
        onFileUpload(Array.from(files)); // Pass multiple files
    };

    const removeFile = (fileName: string, isExisting: boolean) => {
        if (isExisting) {
            handleRemoveExistingFile(fileName);
        } else {
            dispatch(removeUploadedFile({ id: fileId, fileName }));
            // Ensure the Redux state updates `uploadedFiles` appropriately
        }
    };

    const allFiles = [
        ...uploadedFilesInfo.map(file => ({ ...file, isExisting: true })),
        ...uploadedFiles.map(file => ({ name: file.name, url: URL.createObjectURL(file), isExisting: false }))
    ];

    return (
        <div className="grid gap-2">
            {Quote.status == 'draft' && (<><Label htmlFor="file-upload" className="text-sm font-medium">
                Upload Files (PDF, Images)
            </Label>
                <div
                    className={`flex ml-[-0px] flex-col items-center justify-center w-full max-w-md mx-auto h-24 border-2 border-dashed rounded-lg transition-colors ${dragActive ? "border-primary" : "border-gray-300"
                        } ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Upload className="w-10 h-10 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">Drag and drop or click to upload files</p>
                    <Input
                        ref={fileInputRef}
                        id="file-upload"
                        type="file"
                        multiple
                        accept=".pdf,image/*"
                        className="hidden"
                        onChange={handleChange}
                        disabled={isDisabled}
                    />
                </div>
            </>)}
            <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                {allFiles.map((file, index) => (
                    <div key={`${file.isExisting ? 'existing' : 'new'}-${index}`} className="relative group">
                        <div
                            className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden cursor-pointer"
                            onClick={() => window.open(file.url, "_blank")}
                        >
                            {file.name.toLowerCase().endsWith('.pdf') ? (
                                <iframe
                                    src={file.url}
                                    title={file.name}
                                    className="w-full h-full pointer-events-none" // Added pointer-events-none
                                    frameBorder="0"
                                />
                            ) : (
                                <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                            )}
                        </div>
                        <Button
                            variant="destructive"
                            size="icon"
                            className="absolute w-8 h-8 top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeFile(file.name, file.isExisting as boolean)}
                            disabled={isDisabled}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                        <p className="mt-1 text-[10px] text-gray-500 truncate">{file.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FileUpload;
