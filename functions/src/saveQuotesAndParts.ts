/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as admin from "firebase-admin";
import { DocumentData, Timestamp } from "firebase/firestore";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import axios from "axios";
import xml2js = require("xml2js");

const db = admin.firestore();

const materialsSheetQuantityBatchUpdate = async (
  materialId: string,
  sheetUpdates: { width: number; height: number; quantityToReduce: number }[],
) => {
  try {
    console.log("Batch quantity update for material:", materialId);

    const materialDocRef = db.collection("Materials").doc(materialId);
    const materialDoc = await materialDocRef.get();

    if (!materialDoc.exists) {
      throw new Error("Material not found");
    }

    const materialData = materialDoc.data() as DocumentData;

    // Group updates by sheet size to accumulate reductions
    const updatesBySize: { [key: string]: number } = sheetUpdates.reduce(
      (acc, update) => {
        const sizeKey = `${update.width}x${update.height}`;
        if (!acc[sizeKey]) {
          acc[sizeKey] = 0;
        }
        acc[sizeKey] += update.quantityToReduce;
        return acc;
      },
      {} as { [key: string]: number },
    );

    // Shallow copy of sheets
    const updatedSheets = [...materialData?.sheets]?.map((sheet: any) => {
      const sizeKey = `${sheet.size.width}x${sheet.size.height}`;
      const totalQuantityToReduce = updatesBySize[sizeKey];

      if (totalQuantityToReduce) {
        sheet.quantity -= totalQuantityToReduce;
        console.log(
          `Updated quantity for sheet ${sheet.size.width}x${sheet.size.height}: ${sheet.quantity}`,
        );
      }
      return { ...sheet };
    });

    console.log("Updated sheets:", updatedSheets);
    await materialDocRef.update({ sheets: updatedSheets });
    console.log("Batch quantity update completed");
  } catch (error) {
    console.error("Cannot update document:", error);
  }
};

// const addBusinessDays = (date: any, days: any) => {
//   const result = new Date(date);
//   let count = 0;

//   while (count < days) {
//     result.setDate(result.getDate() + 1);
//     const dayOfWeek = result.getDay();
//     if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Exclude Sundays (0) and Saturdays (6)
//       count++;
//     }
//   }

//   return result;
// }


// const replaceWebflowMetaData = async (newDocument: object) => {
//   try {
//     // Reference to the 'webflowMeta' collection
//     const collectionRef = db.collection("webflowMeta");

//     // Get all documents from the collection
//     const querySnapshot = await collectionRef.get();

//     // Map over the documents and delete each one
//     const deletePromises = querySnapshot.docs.map(async (docSnapshot) => {
//       const docRef = collectionRef.doc(docSnapshot.id);
//       try {
//         await docRef.delete();
//         console.log(`Document with ID ${docSnapshot.id} successfully deleted from webflowMeta`);
//       } catch (deleteError) {
//         console.error(`Failed to delete document with ID ${docSnapshot.id}:`, deleteError);
//         // You can choose to throw an error here or handle it accordingly
//         throw new Error(`Failed to delete document with ID ${docSnapshot.id}`);
//       }
//     });

//     // Wait for all delete operations to complete
//     await Promise.all(deletePromises);

//     console.log("All documents deleted successfully.");

//     // Now add the new document to 'webflowMeta' collection
//     const newDocRef = await collectionRef.add(newDocument);
//     console.log("New document added to 'webflowMeta' with ID:", newDocRef.id);

//     return newDocRef.id; // Return the new document's ID
//   } catch (error) {
//     console.error("Error replacing webflowMeta documents:", error);
//     // Throw an error to be handled at the calling function
//     throw new Error("Failed to replace webflowMeta data.");
//   }
// };



// Use onDocumentCreated for Firestore triggers in Firebase v2
export const saveQuotesAndParts = onDocumentCreated(
  "Users/{userId}/payments/{paymentId}",
  async (event) => {
    const snap = event.data;
    const { userId } = event.params;

    const paymentData = snap?.data();
    console.log("Received payment data:", paymentData);
    console.log("User ID:", userId);

    if (paymentData?.status === "succeeded") {
      try {
        const stripeMetaDataId = paymentData.metadata?.stripeMetaDataId;

        if (!stripeMetaDataId) {
          console.error("stripeMetaDataId not found in payment metadata");
          return;
        }

        const metaDataDoc = await db
          .collection("StripeMetaData")
          .doc(stripeMetaDataId)
          .get();

        if (metaDataDoc.exists) {
          const metaData = metaDataDoc.data() as DocumentData;
          const parts = metaData.parts as any[];
          const updateQuoteId = metaData.updateQuoteId;
          const customQuoteID = metaData.customQuoteID;
          const shippingOption = metaData?.shippingOption;
          const shippingAddress = metaData?.shippingAddress;

          // const clientID = metaData.clientID;
          // const contactID = metaData.contactID;
          let totalCuttingTimeOfQuote = 0;

          const sheetUpdatesMap: {
            [materialId: string]: {
              width: number;
              height: number;
              quantityToReduce: number;
            }[];
          } = {};

          const savedParts = await Promise.all(
            parts.map(async (part: any) => {
              console.log("Part data to be saved:", part);
              totalCuttingTimeOfQuote += part.cuttingTime * part.quantity;
              const quantityToReduce = Math.ceil(
                Number(part.usedSheetPercentage) / 100,
              );

              // Collect the updates for the materials
              if (!sheetUpdatesMap[part.material.id]) {
                sheetUpdatesMap[part.material.id] = [];
              }
              sheetUpdatesMap[part.material.id].push({
                width: Number(part.size?.width || "0"),
                height: Number(part.size?.height || "0"),
                quantityToReduce,
              });

              const partDocRef = await db.collection("Parts").add(part);
              console.log("Saved part with ID:", partDocRef.id);
              return partDocRef.id;
            }),
          );

          // Update all materials at once
          await Promise.all(
            Object.keys(sheetUpdatesMap).map((materialId) =>
              materialsSheetQuantityBatchUpdate(
                materialId,
                sheetUpdatesMap[materialId],
              ),
            ),
          );

          console.log("All parts saved:", savedParts);
          let newQuoteId: any;
          if (updateQuoteId === "") {
            newQuoteId = await getIncrementedQuoteId(); // Get the incremented ID
          }
          const totalAmount = paymentData.amount / 100;
          const lastModified = Timestamp.fromDate(
            new Date(),
          ).seconds.toString();

          await updateUserProfileField(userId, "lastquote", lastModified);

          console.log("Quote and parts data saved successfully");

          // const today = new Date();
          // const todayData = today.toISOString().split('T')[0];
          // const futureDate = addBusinessDays(today, 5);
          // const formatedfuturedate = futureDate.toISOString().split('T')[0];

          // // Creating Job in workflowmax
          // const job = {
          //   budget: totalAmount || '',
          //   categoryUUID: "9d2f51d7-04a8-42fa-9d6f-aaca27f9e82e",
          //   clientNumber: customQuoteID || '',
          //   clientUUID: clientID,
          //   contactUUID: contactID,
          //   description: "Laser-Cutting",
          //   dueDate: formatedfuturedate,
          //   name: "Laser Cut",
          //   startDate: todayData,
          // };
          // console.log('job ' + JSON.stringify(job));

          let jobID;

          // await replaceWebflowMetaData(job);
          // const result = await axios.post(
          //   "https://us-central1-laser-cut-d8f38.cloudfunctions.net/api/add-job",
          //   '',
          //   {
          //     headers: {
          //       "Content-Type": "application/xml",
          //       // Add more headers if necessary (e.g., Authorization headers)
          //     }
          //   })
          // const xmlData = result?.data;
          // console.log('result?.data ' + result?.data);
          // console.log('xmlData ' + xmlData);


          // xml2js.parseString(xmlData, (err: any, result: any) => {
          //   if (err) {
          //     console.log('Error parsing XML');

          //   }

          //   // Extract the Job ID from the parsed object
          //   jobID = result.Response.Job[0].ID[0];
          //   console.log("Job ID:", jobID);


          // });

          // const state = {
          //   jobID,
          //   status: "in progress"
          // };
          // await replaceWebflowMetaData(state);
          // await axios.put(
          //   "https://us-central1-laser-cut-d8f38.cloudfunctions.net/api/update-status",
          //   '',
          //   {
          //     headers: {
          //       "Content-Type": "application/xml",

          //     }
          //   })
          // let totalCuttingCost = 0;
          // try {
          //   // Use for...of loop for better async control
          //   for (const part of parts) {
          //     // Accumulate totalCuttingCost synchronously
          //     totalCuttingCost += part.totalCuttingCost;

          //     if (part.isCustomerSupplied == false) {


          //       const cost = {
          //         billable: true,
          //         bode: "",
          //         date: todayData || '',
          //         description: part.material.name || '',
          //         jobID: jobID || '',
          //         note: "",
          //         quantity: 1,
          //         unitCost: part.appliedMarkup
          //           ? part.totalMaterialCost / (1 + part.appliedMarkup / 100)
          //           : part.totalMaterialCost, // Adjust as needed
          //         unitPrice: part.totalMaterialCost || 0
          //       };


          //       await replaceWebflowMetaData(cost);
          //       await axios.post(
          //         "https://us-central1-laser-cut-d8f38.cloudfunctions.net/api/add-cost",
          //         '',
          //         {
          //           headers: {
          //             "Content-Type": "application/xml",

          //           }
          //         }
          //       );
          //     }

          //   }


          // } catch (error) {
          //   // Handle errors appropriately
          //   console.error("Error adding costs:", error);
          // }
          // console.log('Now adding Cutting tech');


          // const cost = {
          //   billable: true,
          //   bode: "",
          //   date: todayData,
          //   description: "Cutting Technology",
          //   jobID: jobID,
          //   note: "",
          //   quantity: 1,
          //   unitCost: totalCuttingCost,
          //   unitPrice: totalCuttingCost
          // };
          // await replaceWebflowMetaData(cost);
          // await axios.post(
          //   "https://us-central1-laser-cut-d8f38.cloudfunctions.net/api/add-cost",
          //   '',
          //   {
          //     headers: {
          //       "Content-Type": "application/xml",
          //       // Add more headers if necessary (e.g., Authorization headers)
          //     }
          //   }
          // );

          if (updateQuoteId !== "") {
            const quoteData = {
              quoteId: parseInt(updateQuoteId),
              customerID: userId,
              status: "in progress",
              parts: savedParts,
              totalPrice: totalAmount,
              lastModified,
              totalCuttingTimeOfQuote,
              jobID: jobID || "",
              customQuoteID: customQuoteID || "",
              shippingOption: shippingOption || "",
              shippingAddress: shippingAddress || "",
            };
            const quoteDocRef = db
              .collection("Quotes")
              .doc(updateQuoteId.toString());
            await quoteDocRef.update(quoteData);
            console.log("Quote updated with ID:", updateQuoteId);
          } else {
            const quoteData = {
              quoteId: newQuoteId,
              customerID: userId,
              status: "in progress",
              parts: savedParts,
              totalPrice: totalAmount,
              lastModified,
              totalCuttingTimeOfQuote,
              jobID: jobID || "",
              customQuoteID: customQuoteID || "",
              shippingOption: shippingOption || "",
              shippingAddress: shippingAddress || "",
            };
            const quoteDocRef = db
              .collection("Quotes")
              .doc(newQuoteId.toString()); // Use custom quoteId
            await quoteDocRef.set(quoteData); // Create a new document with custom ID
            console.log("New quote created with ID:", newQuoteId);
          }

          await db.collection("StripeMetaData").doc(stripeMetaDataId).delete();
          console.log(
            `Deleted StripeMetaData document with ID: ${stripeMetaDataId}`,
          );
        } else {
          console.log(
            "Metadata document not found for stripeMetaDataId:",
            stripeMetaDataId,
          );
        }
      } catch (error) {
        console.error("Error saving quote and parts data:", error);
      }
    } else {
      console.log("Payment status not succeeded:", paymentData?.status);
    }
  },
);

const updateUserProfileField = async (
  userId: string,
  fieldName: string,
  fieldValue: any,
) => {
  try {
    const userDocRef = db.collection("Users").doc(userId);
    await userDocRef.update({ [fieldName]: fieldValue });
    console.log(`Successfully updated ${fieldName} for user ${userId}`);
  } catch (error) {
    console.error(`Error updating ${fieldName} for user ${userId}:`, error);
  }
};

const getIncrementedQuoteId = async () => {
  try {
    const quotesRef = db.collection("Quotes");
    const quotesQuery = quotesRef.orderBy("quoteId", "desc").limit(1);

    const querySnapshot = await quotesQuery.get();

    if (!querySnapshot.empty) {
      const highestQuoteDoc = querySnapshot.docs[0];
      const highestQuoteId = highestQuoteDoc.data().quoteId;
      return parseInt(highestQuoteId) + 1;
    } else {
      // If no quotes exist, start with 1
      return 1001;
    }
  } catch (error) {
    console.error("Error getting incremented quote ID:", error);
    throw error;
  }
};
