/* eslint-disable @typescript-eslint/no-explicit-any */
import { getFirestore, collection, getDocs, doc, updateDoc, addDoc, deleteDoc,arrayUnion,arrayRemove,  query, where, CollectionReference, DocumentData, Query } from "firebase/firestore";

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

export const fetchDocuments = async (collectionName: string, filters: Array<{ field: string, operator: any, value: any }> = []) => {
  try {
    const collectionRef: CollectionReference<DocumentData> = collection(db, collectionName);
    let queryRef: Query<DocumentData> = collectionRef; // Initially, it's just the collection reference.

    // Apply filters if provided
    if (filters.length > 0) {
      const conditions = filters.map(filter => {
        const { field, operator, value } = filter;
        return where(field, operator, value);
      });
      queryRef = query(collectionRef, ...conditions);
    }

    const querySnapshot = await getDocs(queryRef);
    const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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

// Function to delete a document from any Firestore collection
export const deleteDocument = async (collectionName: string, docId: string) => {
  try {
    if (!docId) {
      throw new Error("Document ID is required for deletion");
    }

    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    console.log(`Document with ID ${docId} successfully deleted from ${collectionName}`);
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error);
    throw new Error(`Failed to delete document from ${collectionName}`);
  }
};

// Function to update a document in any Firestore collection
export const updateDocument = async (collectionName: string, docId: string, updatedData: object) => {
  try {
    if (!docId) {
      throw new Error("Document ID is required for updating");
    }

    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, updatedData);
    console.log(`Document with ID ${docId} successfully updated in ${collectionName}`);
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error);
    throw new Error(`Failed to update document in ${collectionName}`);
  }
};

export const addItemToArrayField = async (
  collectionName: string,
  documentId: string,
  arrayFieldName: string,
  newItem: object
) => {
  try {
    console.log("collectionName"+collectionName);
    console.log("documentId"+documentId);
    console.log("arrayFieldName"+arrayFieldName);
    console.log("newItem"+newItem);
    
    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, {
      [arrayFieldName]: arrayUnion(newItem)
    });
    console.log(`New item added to ${arrayFieldName} in document with ID ${documentId}`);
  } catch (error) {
    console.error(`Error adding item to ${arrayFieldName}:`, error);
    throw new Error(`Failed to add item to ${arrayFieldName}`);
  }
};



export const handleDeleteSheet = async (materialId: string, sheetData: any) => {
  try {
    const materialDocRef = doc(db, 'Materials', materialId);

    // Create a copy of sheetData to modify it without affecting the original object
    const sheetDataCopy = { ...sheetData };
    
    // Remove the 'id' field from the sheet data, if it exists
    delete sheetDataCopy.id;

    console.log("Deleting sheet data:", sheetDataCopy);

    // Update the document by removing the specific sheet object
    await updateDoc(materialDocRef, {
      sheets: arrayRemove(sheetDataCopy),
    });

    console.log(`Sheet successfully deleted from material with ID ${materialId}`);
  } catch (error) {
    console.error("Error deleting sheet: ", error);
  }
};

export const handleDeleteTableData = async ( tableData: any) => {
  try {
    if (!tableData?.id) {
      throw new Error("rateTableDocId is undefined");
    }
    
    const rateTableDocRef = doc(db, 'RateTable', tableData.id);

    const tableDataCopy = { ...tableData };
    delete tableDataCopy.id;

    console.log("Deleting table data:", tableDataCopy);

    await updateDoc(rateTableDocRef, {
      rateData: arrayRemove(tableDataCopy),
    });

    console.log(`Table data successfully deleted from RateTable with material ID`);
  } catch (error) {
    console.error("Error deleting table data: ", error);
    throw new Error("Failed to delete table data");
  }
};


