/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "@/components/_ui/toast/use-toast";
import { getFirestore, collection, getDocs, doc, updateDoc, addDoc, deleteDoc,arrayUnion,arrayRemove,  query, where, CollectionReference, DocumentData, Query, getDoc } from "firebase/firestore";

// Initialize Firestore
const db = getFirestore();

// Function to delete documents from "RateTable" where materialID matches
export const deleteDocumentsByMaterialId = async (collectionName: string, materialId: string) => {
  try {
    // Reference to the collection
    const collectionRef = collection(db, collectionName);

    // Create a query to find documents with the matching materialID
    const queryRef = query(collectionRef, where("materialID", "==", materialId));

    // Get all documents matching the query
    const querySnapshot = await getDocs(queryRef);

    // Check if there are any matching documents
    if (querySnapshot.empty) {
      throw new Error(`No Ratetable found for materialID: ${materialId}`);
    }

    // Iterate over each document and delete it
    const deletePromises = querySnapshot.docs.map(async (docSnapshot) => {
      const docRef = doc(db, collectionName, docSnapshot.id);
      await deleteDoc(docRef);
      console.log(`RateTable with ID ${docSnapshot.id} successfully deleted`);
    });

    // Wait for all delete operations to complete
    await Promise.all(deletePromises);
  } catch (error) {
    console.error(`Error deleting documents by materialID ${materialId}:`, error);
    toast({
      variant: "destructive",
      title: "Error",
      description: `Failed to delete documents with materialID: ${materialId}`,
      duration: 3000,
    });
    throw new Error(`Failed to delete documents with materialID: ${materialId}`);
  }
};

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
export const fetchDocumentById = async (collectionName, documentId) => {
  try {
    // Reference to the specific document by collection name and document ID
    const docRef = doc(db, collectionName, documentId);

    // Get the document
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Extract the data and return it
      const data = docSnap.data();
      return {
        id: docSnap.id, // Document ID
        ...data, // Spread the rest of the data
      };
    } else {
      throw new Error("Document not found");
    }
  } catch (error) {
    console.error(`Error fetching document from ${collectionName}: `, error);
    throw new Error("Failed to fetch document");
  }
};

export const updateUserProfileImage = async (userId: string, downloadURL: string) => {
  const userDocRef = doc(db, 'Users', userId);
  await updateDoc(userDocRef, { profileImage: downloadURL });
};

export const updateUserProfileField = async (userId: string, fieldName: string, fieldValue: any) => {
  const userDocRef = doc(db, 'Users', userId);
  await updateDoc(userDocRef, { [fieldName]: fieldValue });
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
      toast({
        title: "Added",
        description: `${collectionName} Added Successfully`,
        duration: 3000,
      });
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
    toast({
      variant: "destructive",
      title: "Deleted",
      description: "Document Deleted Successfuly",
      duration: 3000,
    });
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
    toast({
      title: "Updated",
      description: "Data Updated Successfully",
      duration: 3000,
    });
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
    toast({
      title: "New item Added",
      description: "New Item is added successfully reload to see changes!",
      duration: 3000,
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
    toast({
      variant: "destructive",
      title: "Deleted",
      description: "Sheet successfully deleted Reload to see changes",
      duration: 3000,
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
    toast({
      variant: "destructive",
      title: "Deleted",
      description: "Table data successfully deleted Reload to see changes!",
      duration: 3000,
    });
    console.log(`Table data successfully deleted from RateTable with material ID`);
  } catch (error) {
    console.error("Error deleting table data: ", error);
    throw new Error("Failed to delete table data");
  }
};

export const updateItemInArrayField = async (
  collectionName: string,
  documentId: string,
  arrayFieldName: string,
  currentObject: object,
  updatedItem: object
) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnapshot = await getDoc(docRef);

    if (!docSnapshot.exists()) {
      throw new Error(`Document with ID ${documentId} does not exist in ${collectionName}`);
    }

    const docData = docSnapshot.data();
    const currentArray = docData[arrayFieldName] || [];

    const sortAndRemoveId = (obj: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...rest } = obj; // Destructure to remove 'id'
      return Object.keys(rest)
        .sort()
        .reduce((sortedObj: any, key: string) => {
          sortedObj[key] = rest[key];
          return sortedObj;
        }, {});
    };
    
    const sortedCurrentObject = sortAndRemoveId(currentObject);
    
    const itemIndex = currentArray.findIndex((item: any) => {
      const sortedItem = sortAndRemoveId(item);
      
      console.log("Current Object (Sorted, id removed):", JSON.stringify(sortedCurrentObject));
      console.log("Array Item (Sorted, id removed):", JSON.stringify(sortedItem));
      
      return JSON.stringify(sortedItem) === JSON.stringify(sortedCurrentObject);
    });
    
    if (itemIndex === -1) {
      throw new Error(`Matching item not found in ${arrayFieldName}`);
    }
    

    const updatedArray = [
      ...currentArray.slice(0, itemIndex),
      updatedItem,
      ...currentArray.slice(itemIndex + 1)
    ];

    await updateDoc(docRef, {
      [arrayFieldName]: updatedArray
    });

    console.log(`Item matching currentObject updated in ${arrayFieldName} in document with ID ${documentId}`);
    toast({
      title: "Sheet Data Saved",
      description: `Sheet Data has been Saved Successfuly Reload to see Changes!`,
      duration: 3000,
    });
  } catch (error) {
    console.error(`Error updating item in ${arrayFieldName}:`, error);
    toast({
      variant: "destructive",
      title: "Sheet not Saved",
      description: "Error: Sheet could not save",
      duration: 3000,
    });
    throw new Error(`Failed to update item in ${arrayFieldName}`);
  }
};




