/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "@/components/_ui/toast/use-toast";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  query,
  where,
  CollectionReference,
  DocumentData,
  Query,
  getDoc,
  setDoc,
  Timestamp,
  orderBy,
  limit,
} from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { uploadFile, uploadPartImage } from "./storage-services";
import { clearparts, updateQuoteId } from "../redux/slices/quote-parts-slice";
import { useNavigate } from "react-router-dom";
import { addBusinessDays } from "@/utils/utils";
import { AddCost, AddJob, updateStatus } from "./webflow-services";
import { useState } from "react";

// Initialize Firestore
export const db = getFirestore();

// Function to delete documents from "RateTable" where materialID matches
export const deleteDocumentsByMaterialId = async (
  collectionName: string,
  materialId: string,
): Promise<void> => {
  try {
    // Reference to the collection
    const collectionRef = collection(db, collectionName);

    // Create a query to find documents with the matching materialID
    const queryRef = query(
      collectionRef,
      where("materialID", "==", materialId),
    );

    // Get all documents matching the query
    const querySnapshot = await getDocs(queryRef);

    // Check if there are any matching documents
    if (querySnapshot.empty) {
      console.info(`No documents found for materialID: ${materialId}. Nothing to delete.`);
      return; // Exit the function gracefully
    }

    // Iterate over each document and delete it
    const deletePromises = querySnapshot.docs.map(async (docSnapshot) => {
      const docRef = doc(db, collectionName, docSnapshot.id);
      await deleteDoc(docRef);
      console.log(`Document with ID ${docSnapshot.id} successfully deleted`);
    });

    // Wait for all delete operations to complete
    await Promise.all(deletePromises);
    console.info(`All documents with materialID: ${materialId} have been deleted successfully.`);
  } catch (error) {
    console.error(
      `Error deleting documents by materialID ${materialId}:`,
      error,
    );

    // Depending on your application's requirements, you might want to rethrow the error
    // or handle it differently. Here, we're rethrowing it.
    throw new Error(
      `Failed to delete documents with materialID: ${materialId}`,
    );
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

export const updateUserProfileImage = async (
  userId: string,
  downloadURL: string,
) => {
  const userDocRef = doc(db, "Users", userId);
  await updateDoc(userDocRef, { profileImage: downloadURL });
};

export const updateUserProfileField = async (
  userId: string,
  fieldName: string,
  fieldValue: any,
) => {
  const userDocRef = doc(db, "Users", userId);
  await updateDoc(userDocRef, { [fieldName]: fieldValue });
};

export const fetchDocuments = async (
  collectionName: string,
  filters: Array<{ field: string; operator: any; value: any }> = [],
) => {
  try {
    const collectionRef: CollectionReference<DocumentData> = collection(
      db,
      collectionName,
    );
    let queryRef: Query<DocumentData> = collectionRef; // Initially, it's just the collection reference.

    // Apply filters if provided
    if (filters.length > 0) {
      const conditions = filters.map((filter) => {
        const { field, operator, value } = filter;
        return where(field, operator, value);
      });
      queryRef = query(collectionRef, ...conditions);
    }

    const querySnapshot = await getDocs(queryRef);
    const docs = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
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
    console.log("Document written with ID: ", docRef.id);
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
    console.log(
      `Document with ID ${docId} successfully deleted from ${collectionName}`,
    );
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error);
    throw new Error(`Failed to delete document from ${collectionName}`);
  }
};

// Function to update a document in any Firestore collection
export const updateDocument = async (
  collectionName: string,
  docId: string,
  updatedData: object,
) => {
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
    console.log(
      `Document with ID ${docId} successfully updated in ${collectionName}`,
    );
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error);
    throw new Error(`Failed to update document in ${collectionName}`);
  }
};

export const addItemToArrayField = async (
  collectionName: string,
  documentId: string,
  arrayFieldName: string,
  newItem: object,
) => {
  try {
    console.log("collectionName" + collectionName);
    console.log("documentId" + documentId);
    console.log("arrayFieldName" + arrayFieldName);
    console.log("newItem" + newItem);

    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, {
      [arrayFieldName]: arrayUnion(newItem),
    });
    toast({
      title: "New Data Added",
      description: "New Item is added successfully",
      duration: 3000,
    });
    console.log(
      `New item added to ${arrayFieldName} in document with ID ${documentId}`,
    );
  } catch (error) {
    console.error(`Error adding item to ${arrayFieldName}:`, error);
    throw new Error(`Failed to add item to ${arrayFieldName}`);
  }
};

export const handleDeleteSheet = async (materialId: string, sheetData: any) => {
  try {
    const materialDocRef = doc(db, "Materials", materialId);

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
      title: "Sheet Deleted",
      description: "Sheet successfully deleted",
      duration: 3000,
    });

    console.log(
      `Sheet successfully deleted from material with ID ${materialId}`,
    );
  } catch (error) {
    console.error("Error deleting sheet: ", error);
  }
};

export const handleDeleteTableData = async (tableData: any) => {
  try {
    if (!tableData?.id) {
      throw new Error("rateTableDocId is undefined");
    }

    const rateTableDocRef = doc(db, "RateTable", tableData.id);

    const tableDataCopy = { ...tableData };
    delete tableDataCopy.id;

    console.log("Deleting table data:", tableDataCopy);

    await updateDoc(rateTableDocRef, {
      rateData: arrayRemove(tableDataCopy),
    });
    toast({
      variant: "destructive",
      title: "RateTable data deleted",
      description: "RateTable data successfully deleted",
      duration: 3000,
    });
    console.log(
      `Table data successfully deleted from RateTable with material ID`,
    );
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
  updatedItem: object,
) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnapshot = await getDoc(docRef);

    if (!docSnapshot.exists()) {
      throw new Error(
        `Document with ID ${documentId} does not exist in ${collectionName}`,
      );
    }

    const docData = docSnapshot.data();
    const currentArray = docData[arrayFieldName] || [];
    const sortAndRemoveId = (obj: any) => {
      const { id, ...rest } = obj;

      // Sort object keys and handle nested objects
      const sortedObj = Object.keys(rest)
        .sort()
        .reduce((sorted, key) => {
          const value = rest[key];

          // Recursively sort nested objects
          if (typeof value === "object" && value !== null) {
            sorted[key] = sortAndRemoveId(value); // Sort nested objects
          } else {
            sorted[key] = value;
          }

          return sorted;
        }, {});

      return sortedObj;
    };

    const sortedCurrentObject = sortAndRemoveId(currentObject);

    const itemIndex = currentArray.findIndex((item) => {
      const sortedItem = sortAndRemoveId(item);
      return JSON.stringify(sortedItem) === JSON.stringify(sortedCurrentObject);
    });
    if (itemIndex === -1) {
      throw new Error("Item not found in array. Cannot update.");
    }

    const updatedArray = [
      ...currentArray.slice(0, itemIndex),
      updatedItem,
      ...currentArray.slice(itemIndex + 1),
    ];

    await updateDoc(docRef, {
      [arrayFieldName]: updatedArray,
    });

    console.log(
      `Item matching currentObject updated in ${arrayFieldName} in document with ID ${documentId}`,
    );
    toast({
      title: "Sheet Data Saved",
      description: `Sheet Data has been Saved Successfuly `,
      duration: 3000,
    });
  } catch (error) {
    console.error(`Error updating item in ${arrayFieldName}:`, error);
    toast({
      variant: "destructive",
      title: "Sheet not Saved",
      description: "Sheet could not save please try again",
      duration: 3000,
    });
    throw new Error(`Failed to update item in ${arrayFieldName}`);
  }
};

export const getRateTableData = async (
  materialID: string,
  cuttingTechID: string,
  thickness: string,
): Promise<{ rate: number; speed: number }> => {
  try {
    const collectionRef = collection(db, "RateTable");
    const queryRef = query(
      collectionRef,
      where("materialID", "==", materialID),
      where("cuttingTechID", "==", cuttingTechID),
    );

    const querySnapshot = await getDocs(queryRef);

    if (querySnapshot.empty) {
      throw new Error(
        `No RateTable entry found for materialID: ${materialID} and cuttingTechID: ${cuttingTechID}`,
      );
    }

    for (const docSnapshot of querySnapshot.docs) {
      const rateDataArray = docSnapshot.data().rateData;
      const matchedRateData = rateDataArray.find(
        (rateData: any) => rateData.thickness === thickness,
      );

      if (matchedRateData) {
        const appliedHourlyRate = parseFloat(matchedRateData.appliedHourlyRate);
        const cuttingFeedRate = parseFloat(matchedRateData.cuttingFeedRate);

        return { rate: appliedHourlyRate, speed: cuttingFeedRate };
      }
    }

    throw new Error(
      `No rate data found for thickness: ${thickness} in the matched RateTable entry.`,
    );
  } catch (error) {
    console.error("Error retrieving rate data:", error);
    throw new Error("Failed to retrieve rate data");
  }
};
export const getMaterialSheetData = async (
  materialID: string,
  thickness: string,
  size: { width: number; height: number },
): Promise<{
  appliedMarkup: number;
  sheetCost: number;
  width: number;
  height: number;
} | null> => {
  try {
    const docRef = doc(db, "Materials", materialID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const sheetsArray = docSnap.data().sheets;
      console.log(sheetsArray);
      // Find the sheet that matches the specified thickness and size
      const matchedSheet = sheetsArray.find(
        (sheet) =>
          sheet.thickness === thickness &&
          parseInt(sheet.size.width) === size.width &&
          parseInt(sheet.size.height) === size.height,
      );

      if (matchedSheet) {
        console.log("Matched Sheet:", matchedSheet);

        return {
          appliedMarkup: parseFloat(matchedSheet.appliedMarkup),
          sheetCost: parseFloat(matchedSheet.sheetCost),
          width: parseFloat(matchedSheet.size.width),
          height: parseFloat(matchedSheet.size.height),
        };
      } else {
        throw new Error(
          `No sheet data found for thickness: ${thickness} and size: ${size.width}x${size.height} in the matched Material entry.`,
        );
      }
    } else {
      throw new Error(`Document with ID ${materialID} does not exist.`);
    }
  } catch (error) {
    console.error(`Error retrieving sheet data:`, error);
    throw new Error(`Failed to retrieve sheet data`);
  }
};

const materialsSheetQunatityupdate = async (
  materialId,
  width,
  height,
  quantityToReduce,
) => {
  try {
    console.log("Quantity to reduce: " + quantityToReduce);

    // Fetch material by its ID
    const materialDocRef = doc(db, "Materials", materialId);
    const materialDoc = await getDoc(materialDocRef);

    if (!materialDoc.exists()) {
      throw new Error("Material not found");
    }

    const materialData = materialDoc.data();
    let updatedSheets = [];

    // Find the correct sheet and reduce the quantity
    const sheets = materialData.sheets.map((sheet) => {
      if (
        sheet.size.width == parseFloat(width) &&
        sheet.size.height == parseFloat(height)
      ) {
        sheet.quantity -= quantityToReduce;
        console.log("sheet quantity " + sheet.quantity);
      }
      return sheet;
    });

    updatedSheets = sheets;
    console.log(updatedSheets);

    // Update the material document with the new sheets array
    await updateDoc(materialDocRef, { sheets: updatedSheets });

    console.log("Quantity updated successfully");
  } catch (error) {
    console.log("cannot update document");
  }
};

export const getIncrementedQuoteId = async () => {
  const quotesRef = collection(db, "Quotes");
  const quotesQuery = query(quotesRef, orderBy("quoteId", "desc"), limit(1));

  const querySnapshot = await getDocs(quotesQuery);

  if (!querySnapshot.empty) {
    const highestQuoteDoc = querySnapshot.docs[0];
    const highestQuoteId = highestQuoteDoc.data().quoteId;
    return highestQuoteId + 1;
  } else {
    return 1001;
  }
};

export const useSavePartsAndQuote = (status = "draft", isCredit = "no") => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const parts = useSelector((state: RootState) => state.quoteParts.parts);
  const user = useSelector((state: RootState) => state.auth);
  const quoteId = useSelector((state: RootState) => state.quoteParts.id);
  const customQuoteID = useSelector(
    (state: RootState) => state.quoteParts.customQuoteID,
  ); // Get custom quote ID
  const shippingOption = useSelector(
    (state: RootState) => state.quoteParts.shippingOption,
  );
  const shippingAddress = useSelector(
    (state: RootState) => state.quoteParts.shippingAddress,
  );

  const [loading, setLoading] = useState(false);

  const savePartsAndQuote = async () => {
    try {
      setLoading(true);
      let totalCuttingTimeOfQuote = 0;
      const lastModified = Timestamp.fromDate(new Date()).seconds.toString();
      const savedParts = await Promise.all(
        parts.map(async (part) => {
          // Upload the main part file
          const fileURL = await uploadPartImage(part.id, part.file); // Assuming uploadPartImage exists

          // Initialize uploadedFiles as an empty array of objects containing URL and name
          let uploadedFiles: Array<{ url: string; name: string }> = [];

          // If there are uploadedFiles, upload each one and collect their URLs and names
          if (part.uploadedFiles && part.uploadedFiles.length > 0) {
            // Use Promise.all to upload files concurrently
            uploadedFiles = await Promise.all(
              part.uploadedFiles.map(async (uploadedFile) => {
                try {
                  const uploadedFileURL = await uploadFile("extrapartsfiles", uploadedFile);
                  return { url: uploadedFileURL, name: uploadedFile.name };
                } catch (error) {
                  console.error(`Error uploading file ${uploadedFile.name} for part ${part.id}:`, error);
                  // Optionally, handle the error (e.g., skip the file or notify the user)
                  return null; // Return null for failed uploads
                }
              })
            );

            // Filter out any null entries resulting from failed uploads
            uploadedFiles = uploadedFiles.filter(
              (file): file is { url: string; name: string } => file !== null
            );
          }

          // Accumulate total cutting time
          totalCuttingTimeOfQuote += part.cuttingTime * part.quantity;

          // Prepare the data object for Firestore
          const partData = {
            customerID: user.id,
            cuttingTime: part.cuttingTime * part.quantity,
            partID: part.id,
            name: part.name,
            fileURL,
            cuttingTechnology: part.cuttingTechnology,
            material: part.material,
            thickness: part.thickness || "default",
            size: {
              width: part.size?.width || "default",
              height: part.size?.height || "default",
            },
            quantity: part.quantity,
            totalCost: part.totalCost || 0,
            extraNote: part.extraNote || "", // Include extraNote
            uploadedFiles: uploadedFiles || null,
          };

          // If credit is applied, update materials quantity
          if (isCredit === "yes") {
            const quantityToReduce = Math.ceil(
              (part.sheetUsedPerc * part.quantity) / 100
            );
            await materialsSheetQunatityupdate(
              part.material.id,
              Number(part.size?.width || "default"),
              Number(part.size?.height || "default"),
              quantityToReduce,
            );
          }

          // Reference to the Firestore document
          const partDocRef = doc(db, "Parts", part.id);

          // Save the part data to Firestore
          await setDoc(partDocRef, partData);

          return partDocRef.id;
        })
      );


      const totalPrice = parts.reduce(
        (acc, part) => acc + (part.totalCost || 0),
        0,
      );
      let newQuoteId: number;
      if (!quoteId) {
        newQuoteId = await getIncrementedQuoteId();
      }

      const today = new Date();
      const todayData = today.toISOString().split("T")[0];
      const futureDate = addBusinessDays(today, 5);
      const formatedfuturedate = futureDate.toISOString().split('T')[0];
      let jobID
      // if (isCredit === "yes" || user.role === 'admin') {
      //   // Creating Job in workflowmax
      //   const job = {
      //     budget: totalPrice || '',
      //     categoryUUID: "9d2f51d7-04a8-42fa-9d6f-aaca27f9e82e",
      //     clientNumber: customQuoteID || '',
      //     clientUUID: user.clientID,
      //     contactUUID: user.contactID,
      //     description: "Laser-Cutting",
      //     dueDate: formatedfuturedate,
      //     name: "Laser Cut",
      //     startDate: todayData,
      //   };
      //   jobID = await AddJob(job);
      //   console.log('job id is ' + jobID);
      // }


      // if (isCredit === "yes" || user.role === 'admin') {

      //   const state = {
      //     jobID: jobID,
      //     status: "in progress"
      //   };
      //   await UpdateStatus(state);


      //   // Initialize totalCuttingCost
      //   let totalCuttingCost = 0;

      //   // Array to hold the results of AddCost
      //   const costResults = [];

      //   try {
      //     // Use for...of loop for better async control
      //     for (const part of parts) {
      //       // Accumulate totalCuttingCost synchronously
      //       totalCuttingCost += part.totalCuttingCost;


      //     }

      //     // Optionally, handle all results
      //     // console.log(costResults);
      //   } catch (error) {
      //     // Handle errors appropriately
      //     console.error("Error adding costs:", error);
      //   }

      //   // Continue with the rest of your logic

      //   const cost = {
      //     billable: true,
      //     bode: "",
      //     date: todayData,
      //     description: "Cutting Technology",
      //     jobID: jobID,
      //     note: "",
      //     quantity: 1,
      //     unitCost: totalCuttingCost,
      //     unitPrice: totalCuttingCost
      //   };
      //   await AddCost(cost);

      // }
      const quoteData = {
        jobID: jobID || "",
        customerID: user.id,
        status,
        parts: savedParts,
        totalPrice,
        lastModified,
        totalCuttingTimeOfQuote,
        quoteId: newQuoteId || parseInt(quoteId),
        shippingOption,
        shippingAddress: shippingOption === "delivery" ? shippingAddress : null,
        customQuoteID: customQuoteID || null,
      };

      if (quoteId) {
        const quoteDocRef = doc(db, "Quotes", quoteId);
        await updateDoc(quoteDocRef, quoteData);
        if (isCredit === "yes") {
          toast({
            title: "Order Placed",
            description: "Your Order has been placed Thank you!",
            duration: 2000,
          });
        } else {
          toast({
            title: "Quote Saved",
            description: "Your Quote has been saved Successfuly",
            duration: 2000,
          });
        }
      } else {
        const newQuoteDocRef = doc(db, "Quotes", newQuoteId.toString());
        await setDoc(newQuoteDocRef, quoteData);
        dispatch(updateQuoteId(newQuoteId.toString()));
        if (isCredit === "yes") {
          toast({
            title: "Order Placed",
            description: "Your Order has been placed Thank you!",
            duration: 2000,
          });
        } else {
          toast({
            title: "Quote Saved",
            description: "Your Quote has been saved Successfuly",
            duration: 2000,
          });
        }
      }
      await updateUserProfileField(user.id, "lastquote", lastModified);

      console.log("Quote and parts saved successfully!");
      setLoading(false);
      dispatch(clearparts());
      if (user.role === "admin") {
        navigate("/admin/quotes");
      } else {
        navigate("/quotes/history");
      }
    } catch (error) {
      console.error("Error saving quote and parts:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save quote and parts.",
        duration: 3000,
      });
    }
  };

  return { savePartsAndQuote, loading };
};

export const replaceWebflowMetaData = async (newDocument: object) => {
  try {
    // Reference to the 'webflowMeta' collection
    const collectionRef = collection(db, "webflowMeta");

    // Get all documents from the collection
    const querySnapshot = await getDocs(collectionRef);

    // Map over the documents and delete each one
    const deletePromises = querySnapshot.docs.map(async (docSnapshot) => {
      const docRef = doc(db, "webflowMeta", docSnapshot.id);
      try {
        await deleteDoc(docRef);
        console.log(
          `Document with ID ${docSnapshot.id} successfully deleted from webflowMeta`,
        );
      } catch (deleteError) {
        console.error(
          `Failed to delete document with ID ${docSnapshot.id}:`,
          deleteError,
        );
        // You can either choose to throw an error here or handle it differently
        throw new Error(`Failed to delete document with ID ${docSnapshot.id}`);
      }
    });

    // Wait for all delete operations to complete
    await Promise.all(deletePromises);

    console.log("All documents deleted successfully.");

    // Now add the new document to 'webflowMeta' collection
    const newDocRef = await addDoc(collectionRef, newDocument);
    console.log("New document added to 'webflowMeta' with ID:", newDocRef.id);

    return newDocRef.id; // Return the new document's ID
  } catch (error) {
    console.error("Error replacing webflowMeta documents:", error);

    // Throw an error to be handled at the calling function
    throw new Error("Failed to replace webflowMeta data.");
  }
};

export const updateItemInArrayByIndex = async (
  collectionName,
  docId,
  arrayField,
  index,
  updatedItem,
) => {
  try {
    // Reference to the document in the specified collection
    const docRef = doc(db, collectionName, docId);

    // Get the current document data
    const docSnapshot = await getDoc(docRef);

    if (!docSnapshot.exists()) {
      throw new Error("Document does not exist");
    }

    // Get the array data from the document
    const data = docSnapshot.data();
    const array = data[arrayField];

    // Check if the index is within bounds
    if (index < 0 || index >= array.length) {
      throw new Error("Index out of bounds");
    }

    // Update the item at the specified index
    array[index] = updatedItem;

    // Update the document with the modified array
    await updateDoc(docRef, { [arrayField]: array });

    console.log(`Successfully updated item at index ${index} in ${arrayField}`);
  } catch (error) {
    console.error("Error updating item in array by index:", error);
    throw error;
  }
};
