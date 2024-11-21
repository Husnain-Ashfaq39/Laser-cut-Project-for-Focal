/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  onSnapshot,
} from "firebase/firestore";
import { stripePromise } from "../config";
import { getAuth } from "firebase/auth";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { uploadFile, uploadPartImage } from "@/services/storage-services";

const MIN_COST = 120;
const TAX_RATE = 0.15;

export const useStripeCheckout = () => {
  const [loading, setLoading] = useState(false);
  const parts = useSelector((state: RootState) => state.quoteParts.parts);
  const user = useSelector((state: RootState) => state.auth);
  const updateQuoteId = useSelector((state: RootState) => state.quoteParts.id);
  const shippingOption = useSelector(
    (state: RootState) => state.quoteParts.shippingOption,
  );
  const shippingAddress = useSelector(
    (state: RootState) => state.quoteParts.shippingAddress,
  );

  // New state for custom quote ID
  const customQuoteID = useSelector(
    (state: RootState) => state.quoteParts.customQuoteID,
  );

  const initiateCheckout = async (
    totalAmount: number,
    successUrl: string,
    cancelUrl: string,
  ) => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      console.error("User not authenticated");
      alert("Please sign in to proceed.");
      return;
    }

    const firestore = getFirestore();
    const uid = currentUser.uid;
    const checkoutSessionRef = collection(
      firestore,
      `Users/${uid}/checkout_sessions`,
    );
    const stripeMetaDataRef = collection(firestore, `StripeMetaData`);

    setLoading(true);

    try {
      let adjustedParts = [...parts];
      console.log("this si the total amount:", totalAmount);
      if (totalAmount < MIN_COST) {
        const adjustmentAmount = MIN_COST - totalAmount;
        const equalAdjustmentPerPart = adjustmentAmount / parts.length;

        adjustedParts = adjustedParts.map((part) => ({
          ...part,
          totalCost: (part.totalCost || 0) + equalAdjustmentPerPart,
        }));
      }

      adjustedParts = adjustedParts.map((part) => ({
        ...part,
        totalCost: (part.totalCost || 0) * (1 + TAX_RATE),
      }));

      const metadataParts = await Promise.all(
        adjustedParts.map(async (part) => {
          const fileURL = await uploadPartImage(part.id, part.file);

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
          return {
            customerID: user.id,
            cuttingTime: part.cuttingTime * part.quantity,
            partID: part.id,
            name: part.name,
            fileURL,
            cuttingTechnology: part.cuttingTechnology || {},
            material: part.material || {},
            thickness: part.thickness || "default",
            size: {
              width: part.size?.width || "default",
              height: part.size?.height || "default",
            },
            quantity: part.quantity,
            totalCost: part.totalCost ? part.totalCost.toFixed(2) : "0.00",
            usedSheetPercentage: part.sheetUsedPerc * part.quantity,
            appliedMarkup: part.appliedMarkup || "",
            totalMaterialCost: part.totalMaterialCost,
            totalCuttingCost: part.totalCuttingCost,
            extraNote: part.extraNote || "",
            uploadedFiles: uploadedFiles || null,
          };
        }),
      );

      const metaDataDocRef = doc(stripeMetaDataRef);
      await setDoc(metaDataDocRef, {
        parts: metadataParts,
        updateQuoteId: updateQuoteId || "",
        userId: user.id,
        shippingOption,
        shippingAddress: shippingOption === "delivery" ? shippingAddress : null, // Store address only if delivery is selected
        customQuoteID: customQuoteID || "",
        clientID: user.clientID,
        contactID: user.contactID,
      });

      const newSessionId = doc(checkoutSessionRef).id;

      const newDocRef = doc(checkoutSessionRef, newSessionId);
      await setDoc(newDocRef, {
        mode: "payment",
        success_url: successUrl,
        cancel_url: cancelUrl,
        line_items: adjustedParts.map((part) => ({
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: Math.round((part.totalCost || 0) * 100),
            product_data: {
              name: part.name,
              description: `Quantity: ${part.quantity}, Price: $${part.totalCost ? part.totalCost.toFixed(2) : "0.00"}`,
            },
          },
        })),
        metadata: {
          stripeMetaDataId: metaDataDocRef.id,
          firebaseSessionId: newSessionId,
        },
      });

      const unsubscribe = onSnapshot(newDocRef, async (docSnapshot) => {
        if (!docSnapshot.exists()) {
          console.error("Document does not exist");
          return;
        }

        const data = docSnapshot.data();
        const { error, sessionId } = data || {};

        if (error) {
          console.error(`An error occurred: ${error.message}`);
          alert(`An error occurred: ${error.message}`);
          setLoading(false);
          unsubscribe();
        }

        if (sessionId) {
          const stripe = await stripePromise;
          const result = await stripe?.redirectToCheckout({ sessionId });

          if (result?.error) {
            console.error(result.error.message);
            alert(`Error: ${result.error.message}`);
          }

          setLoading(false);
          unsubscribe();
        }
      });
    } catch (err: any) {
      console.error("An error occurred during checkout:", err);
      alert(`An error occurred during checkout: ${err.message || err}`);
      setLoading(false);
    }
  };

  return { initiateCheckout, loading };
};
