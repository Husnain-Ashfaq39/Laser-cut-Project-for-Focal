import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";

const db = admin.firestore();

// Function to notify customers when their quote status is updated by an admin
export const notifyCustomerOnQuoteStatusChange = onDocumentUpdated(
  "Quotes/{quoteId}",
  async (event) => {
    const oldQuote = event.data?.before.data();
    const newQuote = event.data?.after.data();

    // Exit if no data, if status hasn't changed, or if status is "draft"
    if (
      !oldQuote ||
      !newQuote ||
      oldQuote.status === newQuote.status ||
      newQuote.status === "draft"
    ) {
      return null;
    }

    // Fetch customer data to retrieve email or name for the notification
    const customerRef = db.collection("Users").doc(newQuote.customerID);
    const customerDoc = await customerRef.get();

    if (!customerDoc.exists) {
      console.log("Customer not found");
      return null;
    }

    const customerData = customerDoc.data();
    const { firstName } = customerData || {};

    // Notification message based on the status update
    const notificationMessage = `${firstName}, your quote status has been updated to "${newQuote.status}".`;

    // Add the notification to the root-level Notifications collection
    await db.collection("Notifications").add({
      type: "quote_status_update",
      message: notificationMessage,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      customerID: newQuote.customerID,
      recipientType: "customer",
      status: "unread",
      quoteId: event.params?.quoteId,
    });

    console.log("Notification created successfully at the root level.");
    return null;
  },
);
