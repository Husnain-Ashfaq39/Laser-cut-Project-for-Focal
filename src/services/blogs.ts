import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { app } from "@/firebase.config";

const firestore = getFirestore(app);

// Get blogs from Firestore, sorted by custom 'id'
export const getBlogsFromDb = async () => {
  try {
    const blogsRef = collection(firestore, "Blogs");

    const blogsQuery = query(blogsRef, orderBy("id"));
    const snapshot = await getDocs(blogsQuery);

    const data = snapshot.docs.map((doc) => ({
      firestoreId: doc.id,
      ...doc.data(),
    }));

    return data;
  } catch (error) {
    console.error("Error fetching blogs: ", error);
  }
};

export const getBlogById = async (blogId: string) => {
  const blogRef = doc(firestore, "Blogs", blogId);
  const blogSnap = await getDoc(blogRef);

  if (blogSnap.exists()) {
    return { id: blogSnap.id, ...blogSnap.data() };
  } else {
    return null; // No such blog
  }
};
