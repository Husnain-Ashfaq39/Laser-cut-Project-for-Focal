import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";

const db = admin.firestore();

export const notifyAdminOnNewQuote = onDocumentCreated(
  "Quotes/{quoteId}",
  async (event) => {
    const newQuote = event.data?.data();

    // Check if the status is "draft" and exit if so
    if (!newQuote || newQuote.status === "draft") {
      return null;
    }

    // Fetch customer data from Users collection
    const customerRef = db.collection("Users").doc(newQuote.customerID);
    const customerDoc = await customerRef.get();

    if (!customerDoc.exists) {
      console.log("Customer not found");
      return null;
    }

    const customerData = customerDoc.data();
    const { firstName, lastName, company } = customerData || {};

    // Construct the notification message
    const notificationMessage = `${firstName} ${lastName} from ${company} just created a new quote worth $${newQuote.totalPrice.toFixed(2)}!`;

    // Add the notification to the Notifications collection
    await db.collection("Notifications").add({
      type: "quote_placed",
      message: notificationMessage,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      status: "unread",
      quoteId: event.params?.quoteId,
      recipientType: "admin",
    });

    return null;
  },
);