// future work

// when refactored to isolate logic from ui, the login, and signup functions will be refactored to be a part of the auth service
import { db } from "@/firebase.config";
import { doc, getDoc } from "firebase/firestore";

import { toast } from "@/components/_ui/toast/use-toast";
import { saveUser, clearUser } from "@/redux/slices/auth-slice";

export const fetchUserData = async (user: any, dispatch: any) => {
    if (!user.emailVerified) {
        // Show a toast notification or handle the unverified email case
        toast({
            title: "Email not verified",
            description: "Please verify your email before accessing your account.",
            variant: "destructive",
            duration: 5000,
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
                firstName: userFromDb.data().firstName,
                lastName: userFromDb.data().lastName,
                email: userFromDb.data().email,
            }),
        );
    } else {
        console.log("User data not found in Firestore");
    }
};


export const emailPasswordLogin = async () => {
    // Login logic here
};

export const googleAuth = async () => {
    // Google login logic here
};

export const emailPasswordSignup = async () => {
    // Signup logic here
};


export const logout = async () => {
    // Logout logic here
};