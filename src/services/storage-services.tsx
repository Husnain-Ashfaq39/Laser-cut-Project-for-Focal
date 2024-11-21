/* eslint-disable @typescript-eslint/no-explicit-any */
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

// Initialize Firebase storage instance
const storage = getStorage();

// Upload a profile image with robust error handling
export const uploadProfileImage = async (userId: string, file: File) => {
    try {
        if (!userId || !file) {
            throw new Error('Invalid input: userId or file is missing.');
        }

        const imageRef = ref(storage, `profile_images/${userId}`);
        await uploadBytes(imageRef, file);
        const downloadURL = await getDownloadURL(imageRef);

        if (!downloadURL) {
            throw new Error('Failed to retrieve download URL.');
        }

        return downloadURL;
    } catch (error) {
        console.error('Error uploading profile image:', error);
        throw new Error(`Profile image upload failed: ${error.message}`);
    }
};

export const uploadPartImage = async (partid: string, file: File) => {
    try {
        if (!partid || !file) {
            throw new Error('Invalid input: partid or file is missing.');
        }

        const imageRef = ref(storage, `part_images/${partid}`);
        await uploadBytes(imageRef, file);
        const downloadURL = await getDownloadURL(imageRef);

        if (!downloadURL) {
            throw new Error('Failed to retrieve download URL.');
        }

        return downloadURL;
    } catch (error) {
        console.error('Error uploading Part image:', error);
        throw new Error(`Part image upload failed: ${error.message}`);
    }
};

// Delete existing profile image with robust error handling and no error for non-existent images
export const deleteProfileImage = async (userId: string) => {
    try {
        if (!userId) {
            throw new Error('Invalid input: userId is missing.');
        }

        const imageRef = ref(storage, `profile_images/${userId}`);
        await deleteObject(imageRef);

        return { success: true, message: 'Profile image deleted successfully.' };
    } catch (error) {
        if (error.code === 'storage/object-not-found') {
            // If the image does not exist, return success with a message
            return { success: true, message: 'Profile image does not exist, nothing to delete.' };
        } else {
            console.error('Error deleting profile image:', error);
            throw new Error(`Profile image deletion failed: ${error.message}`);
        }
    }
};

export const uploadFile = async (
    folder: string,
    file: File,
    fileName?: string
): Promise<string> => {
    try {
        if (!folder || !file) {
            throw new Error('Invalid input: folder path or file is missing.');
        }

        // Generate a unique file name if not provided
        const name = fileName || `${Date.now()}_${file.name}`;
        const fileRef = ref(storage, `${folder}/${name}`);

        // Upload the file to the specified folder
        await uploadBytes(fileRef, file);

        // Retrieve the download URL
        const downloadURL = await getDownloadURL(fileRef);

        if (!downloadURL) {
            throw new Error('Failed to retrieve download URL.');
        }

        return downloadURL;
    } catch (error: any) {
        console.error(`Error uploading file to ${folder}:`, error);
        throw new Error(`File upload failed: ${error.message}`);
    }
};
