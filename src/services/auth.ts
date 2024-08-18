/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/firebase.config";
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";

import { toast } from "@/components/_ui/toast/use-toast";
import { saveUser, clearUser } from "@/redux/slices/auth-slice";

// Firebase imports
import { auth } from "@/firebase.config";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";



// Fetch user data from Firestore
export const fetchUserData = async (user: any, dispatch: any) => {
  if (!user.emailVerified) {
    // Show a toast notification or handle the unverified email case
    toast({
      title: "Email not verified",
      description: "Please verify your email before accessing your account.",
      variant: "destructive",
      duration: 3000,
    });
    dispatch(clearUser());
    return;
  }

  const docRef = doc(db, "Users", user.uid);
  const userFromDb = await getDoc(docRef);

  if (userFromDb.exists()) {
    console.log("user from firestore db", userFromDb.data());
    dispatch(
      saveUser({
        id:user.uid,
        firstName: userFromDb.data().firstName,
        lastName: userFromDb.data().lastName,
        email: userFromDb.data().email,
        profileImage:userFromDb.data().profileImage
      })
    );
  } else {
    console.log("User data not found in Firestore");
  }
};

// Handle user signup with email and password
export const handleSignup = async (name: string, email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (user) {
      const [firstName = "", lastName = ""] = name ? name.split(" ") : ["", ""];
      await setDoc(doc(db, "Users", user.uid), {
        email: user.email,
        firstName,
        lastName,
        company: "",
        profileImage:""
      });
      await sendEmailVerification(user);

      toast({
        title: "Verification Email Sent",
        description: "A verification email has been sent to your email address. Please check your inbox.",
        duration: 3000,
      });

    

      toast({
        title: "Registration Successful",
        description: "Your account has been created successfully.",
        duration: 3000,
      });
    }
  } catch (error: any) {
    const errorMessage = error.message;
    if (errorMessage === "Firebase: Error (auth/email-already-in-use).") {
      toast({
        variant: "destructive",
        title: "Email already in use",
        description: "The email address is already in use by another account.",
        duration: 3000,
      });
      return;
    }

    toast({
      variant: "destructive",
      title: errorMessage,
      duration: 3000,
    });
  }
};

export const deleteUser = async (email: string) => {
    try {
      
      const userQuery = query(collection(db, "Users"), where("email", "==", email));
      const querySnapshot = await getDocs(userQuery);
  
      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (docSnap) => {
          await deleteDoc(doc(db, "Users", docSnap.id)); // delete user document
          toast({
            title: "User Data Deleted",
            description: `User with email ${email} has been deleted.`,
            duration: 3000,
          });
        });
      } else {
        toast({
          title: "Error",
          description: "User not found in Firestore.",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
        duration: 3000,
      });
    }
  };

// Google Authentication
export const googleAuth = async () => {
  // Google login logic here
};

// Logout function
export const logout = async () => {
  // Logout logic here
};