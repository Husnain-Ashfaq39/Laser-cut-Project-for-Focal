import { getFirestore, collection, getDocs, addDoc, getDoc, doc, query, orderBy } from "firebase/firestore";
import { app } from "@/firebase.config";

// Initialize Firestore
const firestore = getFirestore(app);

// Function to get portfolio items from Firestore, sorted by custom 'id'
export const getPortfolioFromDb = async () => {
  try {
    const portfolioRef = collection(firestore, "Portfolio");
    
    // Sorting by the custom 'id' field while keeping Firestore document ID
    const portfolioQuery = query(portfolioRef, orderBy("id"));
    const snapshot = await getDocs(portfolioQuery);

    // Keep Firestore-generated doc.id for fetching details later
    const data = snapshot.docs.map((doc) => ({
      firestoreId: doc.id,  // Use Firestore document ID to fetch details later
      ...doc.data(),
    }));
    
    return data;
  } catch (error) {
    console.error("Error fetching portfolio items: ", error);
  }
};

export const getSinglePortfolioById = async (blogId: string) => {
  const blogRef = doc(firestore, "Portfolio", blogId);
  const blogSnap = await getDoc(blogRef);

  if (blogSnap.exists()) {
    return { id: blogSnap.id, ...blogSnap.data() };
  } else {
    return null; // No such blog
  }
};