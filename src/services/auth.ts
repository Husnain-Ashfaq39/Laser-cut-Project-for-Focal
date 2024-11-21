/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/firebase.config";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import { toast } from "@/components/_ui/toast/use-toast";
import { saveUser, clearUser } from "@/redux/slices/auth-slice";

// Firebase imports
import { auth } from "@/firebase.config";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { deleteProfileImage } from "./storage-services";
import {
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

// Fetch user data from Firestore
export const fetchUserData = async (user: any, dispatch: any) => {
  if (!user.emailVerified) {
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
    dispatch(
      saveUser({
        id: user.uid,
        firstName: userFromDb.data().firstName,
        lastName: userFromDb.data().lastName,
        email: userFromDb.data().email,
        profileImage: userFromDb.data().profileImage,
        creditAccount: userFromDb.data().creditAccount,
        role: userFromDb.data().role,
        company: userFromDb.data().company,
        address: userFromDb.data().address || "", 
        clientID: userFromDb.data().clientID || "",
        contactID:userFromDb.data().contactID || "",
        mobile: userFromDb.data().mobile || "",
      }),
    );
  } else {
    console.log("User data not found in Firestore");
  }
};

// Handle user signup with email and password
export const handleSignup = async (
  name: string,
  email: string,
  password: string,
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    if (user) {
      const [firstName = "", lastName = ""] = name ? name.split(" ") : ["", ""];
      await setDoc(doc(db, "Users", user.uid), {
        email: user.email,
        firstName,
        lastName,
        company: "",
        profileImage: "",
        role: "",
      });
      await sendEmailVerification(user);

      toast({
        title: "Verification Email Sent",
        description:
          "A verification email has been sent to your email address. Please check your inbox.",
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
    const userQuery = query(
      collection(db, "Users"),
      where("email", "==", email),
    );
    const querySnapshot = await getDocs(userQuery);
    if (!querySnapshot.empty) {
      querySnapshot.forEach(async (docSnap) => {
        await deleteProfileImage(docSnap.id);
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
export const logout = async () => {};

export const updateUserEmail = async (
  user: any,
  newEmail: string,
  password: string,
) => {
  try {
    // Re-authenticate the user before making sensitive updates
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);

    // Update the email in Firebase Authentication
    await updateEmail(user, newEmail);
    await sendEmailVerification(user);

    // Update the email in Firestore
    const userDoc = doc(db, "Users", user.uid);
    await updateDoc(userDoc, {
      email: newEmail,
    });

    toast({
      title: "Email Updated",
      description:
        "Your email has been successfully updated. A verification email has been sent to your new email address.",
      duration: 3000,
    });
  } catch (error: any) {
    const errorMessage = error.message;

    // Handle specific Firebase Auth errors
    if (errorMessage.includes("auth/requires-recent-login")) {
      toast({
        variant: "destructive",
        title: "Re-authentication Required",
        description: "Please re-login to update your email.",
        duration: 3000,
      });
      return;
    }

    toast({
      variant: "destructive",
      title: "Error",
      description: errorMessage,
      duration: 3000,
    });
  }
};
