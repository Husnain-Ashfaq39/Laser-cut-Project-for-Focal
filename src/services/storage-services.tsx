import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

// Initialize Firebase storage instance
const storage = getStorage();

// Upload a profile image
export const uploadProfileImage = async (userId: string, file: File) => {
    const imageRef = ref(storage, `profile_images/${userId}`);
    await uploadBytes(imageRef, file);
    return await getDownloadURL(imageRef);
};

// Delete existing profile image
export const deleteProfileImage = async (userId: string) => {
    const imageRef = ref(storage, `profile_images/${userId}`);
    await deleteObject(imageRef);
};
