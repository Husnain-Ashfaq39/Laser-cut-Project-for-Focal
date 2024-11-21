import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";
import * as sendgridMail from "@sendgrid/mail";

// Initialize Firestore
const db = admin.firestore();

const sendGridApiKey = process.env.SENDGRID_API_KEY;

if (!sendGridApiKey) {
  throw new Error("SendGrid API key is not defined in environment variables.");
}

sendgridMail.setApiKey(sendGridApiKey);

export const emailCustomerOnQuoteStatusUpdate = onDocumentUpdated(
  "Quotes/{quoteId}",
  async (event) => {
    console.log("Function triggered for quote status update.");

    const oldQuote = event.data?.before.data();
    const newQuote = event.data?.after.data();

    // Check if "status" field was updated to "ready for pickup" or "shipped"
    if (
      !oldQuote ||
      !newQuote ||
      oldQuote.status === newQuote.status ||
      (newQuote.status !== "ready for pickup" && newQuote.status !== "shipped")
    ) {
      console.log("No relevant status change detected. Exiting function.");
      return null;
    }

    console.log(
      `Status changed to "${newQuote.status}". Preparing to notify customer.`,
    );

    // Get the customer ID and fetch the user's email
    const customerID = newQuote.customerID;
    const userRef = db.collection("Users").doc(customerID);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      console.log("User not found for customer ID:", customerID);
      return null;
    }

    const userData = userDoc.data();
    const userEmail = userData?.email;

    if (!userEmail) {
      console.log("User email not found for customer ID:", customerID);
      return null;
    }

    console.log(`Sending email to: ${userEmail}`);

    // Define the subject and message based on the new status
    const subject = `Your Quote is ${newQuote.status === "ready for pickup" ? "Ready for Pickup" : "Shipped"}`;
    const message = `Hello, your quote with ID: ${event.params?.quoteId} is now "${newQuote.status}". Thank you for your business!`;

    // Create the email
    const msg = {
      to: userEmail,
      from: "your-verified-sender@example.com", // Use the verified email from SendGrid
      subject: subject,
      text: message,
      html: `<p>${message}</p>`,
    };

    // Send the email
    try {
      await sendgridMail.send(msg);
      console.log("Email successfully sent to:", userEmail);
    } catch (error) {
      console.error("Error sending email:", error);
    }

    return null;
  },
);
