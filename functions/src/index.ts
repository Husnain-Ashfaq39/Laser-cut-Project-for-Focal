/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */

import * as admin from "firebase-admin"; // Import firebase-admin for Firestore initialization
import * as dotenv from "dotenv";
dotenv.config();

// Initialize the Firebase Admin SDK to interact with Firestore
admin.initializeApp();

import { saveQuotesAndParts } from "./saveQuotesAndParts";
import { notifyAdminOnNewQuote } from "./notifyAdminOnNewQuote";
import { notifyAdminOnQuoteUpdate } from "./notifyAdminOnQuoteUpdate";
import { notifyCustomerOnQuoteStatusChange } from "./notifyCustomerOnQuoteStatusChange"; // Import the customer notification function
import { notifyUserOnCreditAccountUpdate } from "./notifyonCreditAccountUpdate";
import { refreshToken } from "./webflow";
import { addClient } from "./webflow";
import { addContact } from "./webflow";
import { addJob } from "./webflow";
import { updateStatus } from "./webflow";
import { addCost } from "./webflow";
import { fetchClients } from "./webflow";

import { emailCustomerOnQuoteStatusUpdate } from "./emailCustomerOnQuoteStatusUpdate";

import * as functions from "firebase-functions";
import axios from "axios";
import * as cors from "cors";
import * as express from "express";
import jwt = require("jsonwebtoken");
import xmlparser = require("express-xml-bodyparser");
const xml2js = require("xml2js");
const parser = new xml2js.Parser();
// Define the types for the response data

// Set up your credentials here
const clientID = "9d30a67d-e0d7-4e37-9ee1-20097d302548";
const clientSecret = "iLo2WbfL6wF9OLycwejSSEanYq9Lg9EIIp7uOdoC";
const redirectURI =
  "https://us-central1-laser-cut-d8f38.cloudfunctions.net/api/callback";
const authURL = "https://oauth.workflowmax2.com/oauth/authorize";
const tokenURL = "https://oauth.workflowmax2.com/oauth/token";

const app = express();
app.use(cors({ origin: true }));
app.use(
  xmlparser({
    explicitArray: false, // To avoid wrapping single elements in an array
    normalize: true, // Normalize the case of tags
    normalizeTags: true, // Remove all whitespaces
  }),
);

// Step 1: Redirect to the OAuth2 authorization URL
app.get("/auth", (req, res) => {
  const state = Math.random().toString(36).substring(7); // Generate random state for security
  const authorizationURL = `${authURL}?response_type=code&client_id=${clientID}&redirect_uri=${redirectURI}&scope=openid profile email workflowmax offline_access&state=${state}&prompt=consent`;
  res.redirect(authorizationURL);
});

// Step 2: Handle OAuth callback and exchange authorization code for tokens
app.get("/callback", async (req, res) => {
  const code = req.query.code as string;
  if (!code) {
    return res.status(400).send("Missing authorization code");
  }

  try {
    const response = await axios.post(tokenURL, {
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirectURI,
      client_id: clientID,
      client_secret: clientSecret,
    });

    const { access_token, refresh_token, expires_in } = response.data;
    console.log("Tokens received: ", response.data);

    // Calculate the expiration time in Unix seconds
    const expirationTime = Math.floor(Date.now() / 1000) + expires_in;

    // Store tokens in Firestore
    const tokenData = {
      access_token: access_token,
      refresh_token: refresh_token || null, // Store null if refresh_token is not provided
      expires_in: expirationTime, // Store the exact expiration time in Unix seconds
      updated_at: admin.firestore.FieldValue.serverTimestamp(), // Store current timestamp
    };

    // Check if a document already exists in the 'Tokens' collection
    const tokensRef = admin.firestore().collection("Tokens");
    const snapshot = await tokensRef.limit(1).get(); // Limit to 1 to check if a document exists

    if (!snapshot.empty) {
      // Update the first document found
      const docId = snapshot.docs[0].id;
      await tokensRef.doc(docId).update(tokenData);
      console.log(`Tokens updated for document ID: ${docId}`);
    } else {
      // Create a new document if none exists
      await tokensRef.add(tokenData);
      console.log("New tokens document created");
    }

    // Redirect the user to the specified URL
    return res.redirect("http://localhost:3000/callback");
  } catch (error) {
    console.error("Error exchanging code for tokens:", error);
    return res.status(500).json({ error: (error as Error).message });
  }
});

// Step 3: Refresh tokens
app.post("/refresh_token", async (req, res) => {
  try {
    // Step 1: Retrieve the refresh token from Firestore
    const tokensRef = admin.firestore().collection("Tokens");
    const snapshot = await tokensRef.limit(1).get(); // Retrieve the first document in the 'Tokens' collection

    if (snapshot.empty) {
      return res
        .status(400)
        .json({ error: "No refresh token found in Firestore" });
    }

    // Extract the refresh token from the document
    const tokenDoc = snapshot.docs[0];
    const refresh_token = tokenDoc.data().refresh_token;

    if (!refresh_token) {
      return res
        .status(400)
        .json({ error: "Refresh token not found in Firestore" });
    }

    // Step 2: Use the refresh token to get new access and refresh tokens
    const response = await axios.post(tokenURL, {
      grant_type: "refresh_token",
      refresh_token: refresh_token,
      client_id: clientID,
      client_secret: clientSecret,
    });

    const {
      access_token,
      refresh_token: new_refresh_token,
      expires_in,
    } = response.data;

    // Calculate the expiration time in Unix seconds
    const expirationTime = Math.floor(Date.now() / 1000) + expires_in;

    // Step 3: Update Firestore with the new tokens
    const updatedTokenData = {
      access_token: access_token,
      refresh_token: new_refresh_token || refresh_token, // Keep the old refresh token if a new one is not provided
      expires_in: expirationTime, // Store the exact expiration time in Unix seconds
      updated_at: admin.firestore.FieldValue.serverTimestamp(), // Store the updated timestamp
    };

    // Update the existing document with new tokens
    await tokensRef.doc(tokenDoc.id).update(updatedTokenData);

    console.log(`Tokens updated for document ID: ${tokenDoc.id}`);

    // Return the new tokens to the client
    return res.status(200);
  } catch (error) {
    console.error("Error refreshing tokens:", error);
    return res.status(500).json({ error: (error as Error).message });
  }
});

// POST handler for adding a client
app.post("/add-client", async (req, res) => {
  try {
    // const rawBody = req.body.toString(); // Convert Buffer to string
    // console.log("Raw request body: ", rawBody);

    const dataRef = admin.firestore().collection("webflowMeta");
    const snapshot1 = await dataRef.limit(1).get();
    if (snapshot1.empty) {
      return {
        success: false,
        error: "no data found",
      };
    }
    // Extract the refresh token from the document
    const dataDoc = snapshot1.docs[0];
    const data = dataDoc.data();

    if (!data) {
      return {
        success: false,
        error: "no data found",
      };
    }

    // Proceed with token retrieval and API call
    const tokensRef = admin.firestore().collection("Tokens");
    const snapshot = await tokensRef.limit(1).get(); // Retrieve the first document in the
    if (snapshot.empty) {
      return res
        .status(400)
        .json({ error: "No access token found in Firestore" });
    }
    const tokenDoc = snapshot.docs[0];
    const access_token = tokenDoc.data().access_token;
    const decoded: any = jwt.decode(access_token);
    const account_id = decoded.org_ids[0];

    // Create a formatted XML client data string if necessary for the API request
    const formattedClientXML = `
            <Client>
                <Address>${data.address}</Address>
                <FirstName>${data.firstName}</FirstName>
                <LastName>${data.lastName}</LastName>
                <Name>${data.name}</Name>
            </Client>
        `;

    // Make a POST request to the WorkflowMax API to add a new client
    const response = await axios.post(
      "https://api.workflowmax2.com/client.api/add",
      formattedClientXML,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/xml",
          account_id: `${account_id}`,
        },
      },
    );

    // Check the response from the API
    if (response.status === 200) {
      console.log("Client successfully added:", response.data);
      return res.status(200).json(response.data);
    } else {
      console.error("Error adding client:", response.data);
      return res.status(response.status).json(response.data);
    }
  } catch (error) {
    console.error("Error adding new client:", error);
    return res.status(500).json({ error: (error as Error).message });
  }
});

// POST handler for adding a contact
app.post("/add-contact", async (req, res) => {
  try {
    const dataRef = admin.firestore().collection("webflowMeta");
    const snapshot1 = await dataRef.limit(1).get();
    if (snapshot1.empty) {
      return res.status(400).json({ error: "No data found in Firestore" });
    }

    // Extract the required data from Firestore
    const dataDoc = snapshot1.docs[0];
    const data = dataDoc.data();

    if (!data) {
      return res.status(400).json({ error: "No contact data found" });
    }

    // Retrieve the access token from Firestore
    const tokensRef = admin.firestore().collection("Tokens");
    const snapshot = await tokensRef.limit(1).get(); // Retrieve the first document
    if (snapshot.empty) {
      return res
        .status(400)
        .json({ error: "No access token found in Firestore" });
    }

    // Extract access token and decode it
    const tokenDoc = snapshot.docs[0];
    const access_token = tokenDoc.data().access_token;
    const decoded: any = jwt.decode(access_token);
    const account_id = decoded.org_ids[0];

    // Create a formatted XML string for the contact data
    const formattedContactXML = `
            <Contact>
                <Addressee>${data.address}</Addressee>
                <Client>
                    <UUID>${data.clientUUID}</UUID>
                </Client>
                <Email>${data.email}</Email>
                <Mobile>${data.mobile}</Mobile>
                <Name>${data.name}</Name>
                <Phone>${data.phone}</Phone>
                <Position>${data.position}</Position>
                
            </Contact>
        `;

    // Make a POST request to the WorkflowMax API to add a new contact
    const response = await axios.post(
      "https://api.workflowmax2.com/client.api/contact",
      formattedContactXML,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/xml",
          account_id: `${account_id}`,
        },
      },
    );

    // Check the response status
    if (response.status === 200) {
      console.log("Contact successfully added:", response.data);
      return res.status(200).json(response.data);
    } else {
      console.error("Error adding contact:", response.data);
      return res.status(response.status).json(response.data);
    }
  } catch (error) {
    console.error("Error adding new contact:", error);
    return res.status(500).json({ error: (error as Error).message });
  }
});

app.get("/fetch-clients", async (req, res) => {
  try {
    // Step 1: Retrieve the access token from Firestore
    const tokensRef = admin.firestore().collection("Tokens");
    const snapshot = await tokensRef.limit(1).get(); // Retrieve the first document in the 'Tokens' collection

    if (snapshot.empty) {
      return res
        .status(400)
        .json({ success: false, error: "No access token found in Firestore" });
    }

    const tokenDoc = snapshot.docs[0];
    let access_token = tokenDoc.data().access_token;
    const decoded: any = jwt.decode(access_token);
    const account_id = decoded.org_ids[0];

    access_token = tokenDoc.data().access_token.trim();

    axios.interceptors.request.use((request) => {
      console.log("Starting Request:", JSON.stringify(request, null, 2));
      return request;
    });

    // Step 2: Make a GET request to the WorkflowMax API to retrieve all clients
    const response = await axios.get(
      "https://api.workflowmax2.com/client.api/list",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/xml",
          account_id: `${account_id}`,
        },
      },
    );

    // Check the response from the API
    if (response.status === 200) {
      console.log("Clients successfully retrieved:", response.data);

      // Parse the XML response into JSON
      const result = await parser.parseStringPromise(response.data);
      return res.status(200).json({ success: true, clients: result });
    } else {
      console.error("Error retrieving clients:", response.data);
      return res
        .status(response.status)
        .json({ success: false, error: response.data });
    }
  } catch (error) {
    console.error("Error retrieving clients:", error);
    return res
      .status(500)
      .json({ success: false, error: (error as Error).message });
  }
});

// POST handler for adding a job
app.post("/add-job", async (req, res) => {
  try {
    const dataRef = admin.firestore().collection("webflowMeta");
    const snapshot1 = await dataRef.limit(1).get();
    if (snapshot1.empty) {
      return res.status(400).json({ error: "No job data found in Firestore" });
    }

    // Extract the required job data from Firestore
    const dataDoc = snapshot1.docs[0];
    const data = dataDoc.data();

    if (!data) {
      return res.status(400).json({ error: "No job data found" });
    }

    // Retrieve the access token from Firestore
    const tokensRef = admin.firestore().collection("Tokens");
    const snapshot = await tokensRef.limit(1).get();
    if (snapshot.empty) {
      return res
        .status(400)
        .json({ error: "No access token found in Firestore" });
    }

    // Extract access token and decode it
    const tokenDoc = snapshot.docs[0];
    const access_token = tokenDoc.data().access_token;
    const decoded: any = jwt.decode(access_token);
    const account_id = decoded.org_ids[0];

    // Create a formatted XML string for the job data
    const formattedJobXML = `
            <Job>
                <Budget>${data.budget || ""}</Budget>
                <CategoryUUID>${data.categoryUUID || ""}</CategoryUUID>
                <ClientNumber>${data.clientNumber || ""}</ClientNumber>
                <ClientUUID>${data.clientUUID || ""}</ClientUUID>
                <ContactUUID>${data.contactUUID || ""}</ContactUUID>
                <Description>${data.description || ""}</Description>
                <DueDate>${data.dueDate || ""}</DueDate>
                <Name>${data.name || ""}</Name>
                <StartDate>${data.startDate || ""}</StartDate>
            </Job>
        `;

    // Make a POST request to the WorkflowMax API to create a new job
    const response = await axios.post(
      "https://api.workflowmax2.com/job.api/add",
      formattedJobXML,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/xml",
          account_id: `${account_id}`,
        },
      },
    );

    // Check the response status
    if (response.status === 200) {
      console.log("Job successfully added:", response.data);
      return res.status(200).json(response.data);
    } else {
      console.error("Error adding job:", response.data);
      return res.status(response.status).json(response.data);
    }
  } catch (error) {
    console.error("Error adding new job:", error);
    return res.status(500).json({ error: (error as Error).message });
  }
});
app.put("/update-status", async (req, res) => {
  try {
    const dataRef = admin.firestore().collection("webflowMeta");
    const snapshot1 = await dataRef.limit(1).get();
    if (snapshot1.empty) {
      return res.status(400).json({ error: "No job data found in Firestore" });
    }

    // Extract the required job data from Firestore
    const dataDoc = snapshot1.docs[0];
    const data = dataDoc.data();

    if (!data) {
      return res.status(400).json({ error: "No job data found" });
    }

    // Retrieve the access token from Firestore
    const tokensRef = admin.firestore().collection("Tokens");
    const snapshot = await tokensRef.limit(1).get();
    if (snapshot.empty) {
      return res
        .status(400)
        .json({ error: "No access token found in Firestore" });
    }

    // Extract access token and decode it
    const tokenDoc = snapshot.docs[0];
    const access_token = tokenDoc.data().access_token;
    const decoded: any = jwt.decode(access_token);
    const account_id = decoded.org_ids[0];

    // Create a formatted XML string for the job data
    const formattedJobXML = `
            <Job>
                    <ID>${data.jobID}</ID>
                    <State>${data.status}</State>
            </Job>
        `;

    // Make a POST request to the WorkflowMax API to create a new job
    const response = await axios.put(
      "https://api.workflowmax2.com/job.api/state",
      formattedJobXML,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/xml",
          account_id: `${account_id}`,
        },
      },
    );

    // Check the response status
    if (response.status === 200) {
      console.log("Job successfully update:", response.data);
      return res.status(200).json(response.data);
    } else {
      console.error("Error editing status:", response.data);
      return res.status(response.status).json(response.data);
    }
  } catch (error) {
    console.error("Error editing status:", error);
    return res.status(500).json({ error: (error as Error).message });
  }
});

app.post("/add-cost", async (req, res) => {
  try {
    const dataRef = admin.firestore().collection("webflowMeta");
    const snapshot1 = await dataRef.limit(1).get();
    if (snapshot1.empty) {
      return res.status(400).json({ error: "No cost data found in Firestore" });
    }

    // Extract the required job data from Firestore
    const dataDoc = snapshot1.docs[0];
    const data = dataDoc.data();

    if (!data) {
      return res.status(400).json({ error: "No cost data found" });
    }

    // Retrieve the access token from Firestore
    const tokensRef = admin.firestore().collection("Tokens");
    const snapshot = await tokensRef.limit(1).get();
    if (snapshot.empty) {
      return res
        .status(400)
        .json({ error: "No access token found in Firestore" });
    }

    // Extract access token and decode it
    const tokenDoc = snapshot.docs[0];
    const access_token = tokenDoc.data().access_token;
    const decoded: any = jwt.decode(access_token);
    const account_id = decoded.org_ids[0];

    // Create a formatted XML string for the job data
    const formattedJobXML = `
            <Cost>
                <Billable>true</Billable>
                <Code></Code>
                <Date>${data.date}</Date>
                <Description>${data.description}</Description>
                <Job>${data.jobID}</Job>
                <Note></Note>
                <Quantity>1</Quantity>
                <UnitCost>${data.unitCost}</UnitCost>
                <UnitPrice>${data.unitPrice}</UnitPrice>
            </Cost>
        `;

    // Make a POST request to the WorkflowMax API to create a new job
    const response = await axios.post(
      "https://api.workflowmax2.com/job.api/cost",
      formattedJobXML,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/xml",
          account_id: `${account_id}`,
        },
      },
    );

    // Check the response status
    if (response.status === 200) {
      console.log("Cost successfully added:", response.data);
      return res.status(200).json(response.data);
    } else {
      console.error("Error adding Cost:", response.data);
      return res.status(response.status).json(response.data);
    }
  } catch (error) {
    console.error("Error adding new Cost:", error);
    return res.status(500).json({ error: (error as Error).message });
  }
});

// Export the API as a Firebase function
exports.api = functions.https.onRequest(app);

// Export functions
exports.saveQuotesAndParts = saveQuotesAndParts;
exports.notifyAdminOnNewQuote = notifyAdminOnNewQuote;
exports.notifyAdminOnQuoteUpdate = notifyAdminOnQuoteUpdate;
exports.notifyCustomerOnQuoteStatusChange = notifyCustomerOnQuoteStatusChange;
exports.notifyUserOnCreditAccountUpdate = notifyUserOnCreditAccountUpdate;
exports.refreshToken = refreshToken;
exports.addClient = addClient;
exports.addContact = addContact;
exports.addJob = addJob;
exports.addCost = addCost;
exports.updateStatus = updateStatus;
exports.fetchClients = fetchClients;
exports.emailCustomerOnQuoteStatusUpdate = emailCustomerOnQuoteStatusUpdate;
