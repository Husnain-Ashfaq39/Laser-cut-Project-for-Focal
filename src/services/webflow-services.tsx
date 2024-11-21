/* eslint-disable @typescript-eslint/no-explicit-any */
import { getFunctions, httpsCallable } from "firebase/functions";
import { replaceWebflowMetaData } from "./db-services";
const functions = getFunctions();

export const refreshToken = async () => {
  console.log("Token is about to expire, refreshing...");

  try {
    const RefreshToken = httpsCallable(functions, "refreshToken");

    RefreshToken()
      .then((result) => {
        // Handle the success response
        console.log("Token refreshed:", result?.data);
      })
      .catch((error) => {
        // Handle the error response
        console.error("Error refreshing token:", error);
      });
  } catch (error) {
    console.error("Error refreshing token:", error);
  }
};
export const FetchClients = async () => {
  console.log("getting clients.......");

  try {
    const fetchClients = httpsCallable(functions, "fetchClients");

    // Await the response from the callable function
    const result = await fetchClients();

    // Log and return the result
    console.log("Clients:", result?.data);
    return result?.data;
  } catch (error) {
    console.error("Error getting clients:", error);
    return null; // Return null or handle error response as needed
  }
};

export const AddClient = async (data: any) => {
  console.log("Adding client...");

  try {
    // Assuming replaceWebflowMetaData modifies or prepares the data before making the API call
    await replaceWebflowMetaData(data);

    const addClientCallable = httpsCallable(functions, "addClient");

    // Calling the Cloud Function that adds the client
    const result: any = await addClientCallable();

    // Parsing the result to get the XML data
    const xmlData = result?.data.data;

    if (xmlData) {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlData, "application/xml");

      // Extract the UUID from the parsed XML document
      const uuidElement = xmlDoc.getElementsByTagName("UUID")[0];
      const uuid = uuidElement ? uuidElement.textContent : "UUID not found";

      console.log("Client added, UUID:", uuid);

      // Return the extracted UUID
      return uuid || "UUID not found"; // Handle cases where UUID might not exist
    }

    return "No data returned";
  } catch (error) {
    console.error("Error adding client:", error);
    return null;
  }
};

export const AddContact = async (data: any) => {
  console.log("Adding Contact...");

  try {
    await replaceWebflowMetaData(data);
    const addClientCallable = httpsCallable(functions, "addContact");

    const result: any = await addClientCallable();
    // Parsing the result to get the XML data
    const xmlData = result?.data.data;

    if (xmlData) {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlData, "application/xml");

      // Extract the UUID from the parsed XML document
      const uuidElement = xmlDoc.getElementsByTagName("UUID")[0];
      const uuid = uuidElement ? uuidElement.textContent : "UUID not found";
      console.log("contact added, UUID:", uuid);
      // Return the extracted UUID
      return uuid || "UUID not found"; // Handle cases where UUID might not exist
    }
    return "no data return from api";
  } catch (error) {
    console.error("Error adding client:", error);
  }
};
export const AddJob = async (data: any) => {
  console.log("Adding Job...");

  try {
    await replaceWebflowMetaData(data);
    const addJobCallable = httpsCallable(functions, "addJob");

    const result: any = await addJobCallable();
    // Parsing the result to get the XML data
    const xmlData = result?.data.data;
    console.log("job data " + xmlData);

    if (xmlData) {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlData, "application/xml");

      // Extract the UUID from the parsed XML document
      const uuidElement = xmlDoc.getElementsByTagName("ID")[0];
      const uuid = uuidElement ? uuidElement.textContent : "UUID not found";
      console.log("Job added, UUID:", uuid);
      // Return the extracted UUID
      return uuid || "UUID not found"; // Handle cases where UUID might not exist
    }

    return "no data return from api";
  } catch (error) {
    console.error("Error adding client:", error);
  }
};
export const updateStatus = async (data: any) => {
  console.log("Editing Status...");

  try {
    await replaceWebflowMetaData(data);
    const addJobCallable = httpsCallable(functions, "updateStatus");

    const result: any = await addJobCallable();
    // // Parsing the result to get the XML data
    // const xmlData = result?.data.data;

    // if (xmlData) {
    //   const parser = new DOMParser();
    //   const xmlDoc = parser.parseFromString(xmlData, "application/xml");

    //   // Extract the UUID from the parsed XML document
    //   const uuidElement = xmlDoc.getElementsByTagName("UUID")[0];
    //   const uuid = uuidElement ? uuidElement.textContent : "UUID not found";
    //   console.log("Job added, UUID:", uuid);
    //   // Return the extracted UUID
    //   return uuid || "UUID not found"; // Handle cases where UUID might not exist
    // }

    console.log("status " + JSON.stringify(result));

    //  return 'no data return from api';
  } catch (error) {
    console.error("Error editing status:", error);
  }
};

export const AddCost = async (data: any) => {
  console.log("Adding Cost...");

  try {
    await replaceWebflowMetaData(data);
    const addCostCallable = httpsCallable(functions, "addCost");

    const result: any = await addCostCallable();
    // Parsing the result to get the XML data
    // const xmlData = result?.data.data;
    // console.log('Cost data '+xmlData);

    //   if (xmlData) {
    //     const parser = new DOMParser();
    //     const xmlDoc = parser.parseFromString(xmlData, "application/xml");

    //     // Extract the UUID from the parsed XML document
    //     const uuidElement = xmlDoc.getElementsByTagName("ID")[0];
    //     const uuid = uuidElement ? uuidElement.textContent : "UUID not found";
    //     console.log("Job added, UUID:", uuid);
    //     // Return the extracted UUID
    //     return uuid || "UUID not found"; // Handle cases where UUID might not exist
    //   }

    //  return 'no data return from api';
    console.log("cost result " + JSON.stringify(result));
  } catch (error) {
    console.error("Error adding cost:", error);
  }
};
