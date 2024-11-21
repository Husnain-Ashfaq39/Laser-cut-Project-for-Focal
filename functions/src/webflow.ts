/* eslint-disable @typescript-eslint/no-explicit-any */
import * as functions from 'firebase-functions';
import axios from 'axios';


// Define the refreshToken Cloud Function in TypeScript
export const refreshToken = functions.https.onCall(async () => {

  try {
    const response = await axios.post("https://us-central1-laser-cut-d8f38.cloudfunctions.net/api/refresh_token",
      {
        // Add any required payload if the API requires it
      },
      {
        headers: {
          "Content-Type": "application/json",
          // Add any necessary headers such as Authorization if required
        }
      });

    console.log("Token refreshed successfully", response.data);
    return {
      success: true
    };
  } catch (error: any) {
    console.error("Error refreshing token:", error);
    return {
      success: false,
      message: "Error refreshing token",
      error: error.message,
    };
  }
});

export const addClient = functions.https.onCall(async () => {
  try {
    

    // Make the API call to the add-client endpoint
    const response = await axios.post(
      "https://us-central1-laser-cut-d8f38.cloudfunctions.net/api/add-client",
      '',
      {
        headers: {
          "Content-Type": "application/xml",
          // You can add more headers if necessary (e.g., Authorization headers)
        }
      }
    );

    // Check if the client was added successfully
    if (response.status === 200) {
      console.log("Client successfully added:", response.data);
      return {
        success: true,
        data: response.data,
      };
    } else {
      console.error("Error adding client:", response.data);
      return {
        success: false,
        error: response.data,
      };
    }
  } catch (error: any) {
    console.error("Error adding client:", error);
    return {
      success: false,
      message: "Error adding client",
      error: error.message,
    };
  }
});

export const addContact = functions.https.onCall(async () => {
  try {
    // Make the API call to the add-contact endpoint
    const response = await axios.post(
      "https://us-central1-laser-cut-d8f38.cloudfunctions.net/api/add-contact",
      '',
      {
        headers: {
          "Content-Type": "application/xml",
          // Add more headers if necessary (e.g., Authorization headers)
        }
      }
    );

    // Check if the contact was added successfully
    if (response.status === 200) {
      console.log("Contact successfully added:", response.data);
      return {
        success: true,
        data: response.data,
      };
    } else {
      console.error("Error adding contact:", response.data);
      return {
        success: false,
        error: response.data,
      };
    }
  } catch (error: any) {
    console.error("Error adding contact:", error);
    return {
      success: false,
      message: "Error adding contact",
      error: error.message,
    };
  }
});
export const addJob = functions.https.onCall(async () => {
  try {
    // Make the API call to the add-contact endpoint
    const response = await axios.post(
      "https://us-central1-laser-cut-d8f38.cloudfunctions.net/api/add-job",
      '',
      {
        headers: {
          "Content-Type": "application/xml",
          // Add more headers if necessary (e.g., Authorization headers)
        }
      }
    );

    // Check if the contact was added successfully
    if (response.status === 200) {
      console.log("Job successfully added:", response.data);
      return {
        success: true,
        data: response.data,
      };
    } else {
      console.error("Error adding job:", response.data);
      return {
        success: false,
        error: response.data,
      };
    }
  } catch (error: any) {
    console.error("Error adding contact:", error);
    return {
      success: false,
      message: "Error adding contact",
      error: error.message,
    };
  }
});
export const updateStatus = functions.https.onCall(async () => {
  try {
    // Make the API call to the add-contact endpoint
    const response = await axios.put(
      "https://us-central1-laser-cut-d8f38.cloudfunctions.net/api/update-status",
      '',
      {
        headers: {
          "Content-Type": "application/xml",
          // Add more headers if necessary (e.g., Authorization headers)
        }
      }
    );

    // Check if the contact was added successfully
    if (response.status === 200) {
      console.log("status update successfully", response.data);
      return {
        success: true,
        data: response.data,
      };
    } else {
      console.error("Error editing status:", response.data);
      return {
        success: false,
        error: response.data,
      };
    }
  } catch (error: any) {
    console.error("Error editing status ", error);
    return {
      success: false,
      message: "Error editing status",
      error: error.message,
    };
  }
});

export const fetchClients = functions.https.onCall(async () => {
  try {
    // Make the API call to the fetch-clients endpoint in your index.ts
    const response = await axios.get(
      "https://us-central1-laser-cut-d8f38.cloudfunctions.net/api/fetch-clients",
      {
        headers: {
          "Content-Type": "application/json",
          // Add any additional headers if necessary (e.g., Authorization)
        }
      }
    );

    // Check if the clients were fetched successfully
    if (response.status === 200) {
      console.log("Clients successfully fetched:", response.data);
      return {
        success: true,
        data: response.data.clients.Response.Clients[0].Client,
      };
    } else {
      console.error("Error fetching clients:", response.data);
      return {
        success: false,
        error: response.data,
      };
    }
  } catch (error: any) {
    console.error("Error fetching clients:", error);
    return {
      success: false,
      message: "Error fetching clients",
      error: error.message,
    };
  }
});

export const addCost = functions.https.onCall(async () => {
  try {
    // Make the API call to the add-cost endpoint
    const response = await axios.post(
      "https://us-central1-laser-cut-d8f38.cloudfunctions.net/api/add-cost",
      '',
      {
        headers: {
          "Content-Type": "application/xml",
          // Add more headers if necessary (e.g., Authorization headers)
        }
      }
    );

    // Check if the cost was added successfully
    if (response.status === 200) {
      console.log("Cost successfully added:", response.data);
      return {
        success: true,
        data: response.data,
      };
    } else {
      console.error("Error adding cost:", response.data);
      return {
        success: false,
        error: response.data,
      };
    }
  } catch (error: any) {
    console.error("Error adding cost:", error);
    return {
      success: false,
      message: "Error adding cost",
      error: error.message,
    };
  }
});
