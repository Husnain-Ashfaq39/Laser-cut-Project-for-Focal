import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { app } from "@/firebase.config";

const firestore = getFirestore(app);

export const getServicesFromDb = async () => {
  try {
    const servicesRef = collection(firestore, "Services");

    const servicesQuery = query(servicesRef, orderBy("id"));

    const snapshot = await getDocs(servicesQuery);

    const data = snapshot.docs.map((doc) => ({ firestoreId: doc.id, ...doc.data() }));

    return data;
  } catch (error) {
    console.error("Error fetching services: ", error);
  }
};

export const getSingleServiceById = async (blogId: string) => {
  const blogRef = doc(firestore, "Services", blogId);
  const blogSnap = await getDoc(blogRef);

  if (blogSnap.exists()) {
    return { id: blogSnap.id, ...blogSnap.data() };
  } else {
    return null;
  }
};

