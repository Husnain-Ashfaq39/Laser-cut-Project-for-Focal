/* eslint-disable @typescript-eslint/no-explicit-any */
import { getFirestore, collection, getDocs, where, query } from "firebase/firestore";

// Initialize Firestore
const db = getFirestore();

// Define the structure of a User document
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  // Add more fields as necessary
  [key: string]: any; // In case there are dynamic fields
}
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

export const fetchUserByEmail = async (collectionName: string, email: string): Promise<User | null> => {
  try {
    // Reference to the specified collection
    const usersCollection = collection(db, collectionName);

    // Create a query to find the user with the matching email
    const q = query(usersCollection, where("email", "==", email));

    // Get the documents that match the query
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null; // If no user is found
    }

    // Assuming there's only one user with that email, take the first result
    const userDoc = querySnapshot.docs[0];

    // Extract the document data
    const userData = userDoc.data() as User;
    const user: User = {
      id: userDoc.id, // Document ID
      name: `${userData.firstName} ${userData.lastName}`, // Combine firstName and lastName
      email: userData.email, // User email
      ...userData, // Spread the rest of the data if needed
    };

    return user; // Return the user data
  } catch (error) {
    console.error("Error fetching user by email: ", error);
    throw new Error("Failed to fetch user by email");
  }
};
