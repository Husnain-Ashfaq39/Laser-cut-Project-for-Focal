import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";

const db = admin.firestore();

export const notifyUserOnCreditAccountUpdate = onDocumentUpdated(
  "Users/{userId}",
  async (event) => {
    const oldUserData = event.data?.before.data();
    const newUserData = event.data?.after.data();

    // Check if "creditAccount" field was updated
    if (
      !oldUserData ||
      !newUserData ||
      oldUserData.creditAccount === newUserData.creditAccount
    ) {
      return null; // Exit if there's no change in "creditAccount"
    }

    const userId = event.params?.userId;
    const userRef = db.collection("Users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      console.log("User not found");
      return null;
    }

    const userData = userDoc.data();
    const { firstName } = userData || {};

    // Determine the notification message based on the creditAccount status
    let notificationMessage = "";
    if (newUserData.creditAccount === "verified") {
      notificationMessage = `${firstName}, your request to become a credit account has been approved.`;
    } else if (newUserData.creditAccount === "unverified") {
      notificationMessage = `${firstName}, your request to become a credit account has been rejected.`;
    }

    // If there's no message to show, exit the function
    if (!notificationMessage) {
      return null;
    }

    // Add the notification to the Notifications collection
    await db.collection("Notifications").add({
      type: "credit_account_update",
      message: notificationMessage,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      status: "unread",
      customerID: userId,
      recipientType: "customer",
    });

    return null;
  },
);
