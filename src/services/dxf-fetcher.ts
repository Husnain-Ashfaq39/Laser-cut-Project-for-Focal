import { getDownloadURL, getStorage, ref } from "firebase/storage";

export const fetchPartFile = async (fileUrl: string): Promise<Blob | null> => {
    const storage = getStorage();
    
    // Ensure fileUrl is not empty or a root path
    if (!fileUrl || fileUrl === "/") {
      console.error("Invalid file URL. Please provide a valid path to the file.");
      return null;
    }
    
    const fileRef = ref(storage, fileUrl);
    
    try {
      const downloadURL = await getDownloadURL(fileRef);
      const response = await fetch(downloadURL);
      const fileBlob = await response.blob();
      console.log("This is the file blob:", fileBlob);
      return fileBlob;
    } catch (error) {
      console.error("Error fetching file from Firebase:", error);
      return null;
    }
};
