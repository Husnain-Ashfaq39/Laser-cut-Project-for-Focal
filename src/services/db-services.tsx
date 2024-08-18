/* eslint-disable @typescript-eslint/no-explicit-any */
import { getFirestore, collection, getDocs, doc, updateDoc, addDoc } from "firebase/firestore";

// Initialize Firestore
const db = getFirestore();


export const fetchAllUsers = async () => {
  try {
    // Reference to the 'Users' collection
    const usersCollection = collection(db, "Users");

    // Get all documents from the collection
    const querySnapshot = await getDocs(usersCollection);

    // Map through the documents and extract data
    const usersList = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id, // Document ID
        name: `${data.firstName} ${data.lastName}`, // Combine firstName and lastName
        email: data.email, // Assuming email is also part of the document data
        ...data, // Spread the rest of the data if needed
      };
    });

    return usersList; // Return the list of users
  } catch (error) {
    console.error("Error fetching users: ", error);
    throw new Error("Failed to fetch users");
  }
};
export const updateUserProfileImage = async (userId: string, downloadURL: string) => {
  const userDocRef = doc(db, 'Users', userId);
  await updateDoc(userDocRef, { profileImage: downloadURL });
};


// Function to fetch documents from any Firestore collection
export const fetchDocuments = async (collectionName: string) => {
  try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const docs = querySnapshot.docs.map(doc => doc.data());
      return docs;
  } catch (error) {
      console.error(`Error fetching documents from ${collectionName}:`, error);
      throw new Error(`Failed to fetch documents from ${collectionName}`);
  }
};

// Function to add a new document to any Firestore collection
export const addDocument = async (collectionName: string, newDoc: object) => {
  try {
      const docRef = await addDoc(collection(db, collectionName), newDoc);
      console.log('Document written with ID: ', docRef.id);
      return docRef.id;
  } catch (error) {
      console.error(`Error adding new document to ${collectionName}:`, error);
      throw new Error(`Failed to add document to ${collectionName}`);
  }
};