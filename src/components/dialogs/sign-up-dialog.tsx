/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/_ui/button";
import {
  Dialog,
  DialogContent,

  DialogTrigger,
} from "@/components/_ui/dialog";
import { Input } from "@/components/_ui/input";
import { Label } from "@/components/_ui/label";
import { useState } from "react";
import DialogImage from "@/assets/dialogs-img.png";
import GoogleIcon from "@/assets/icons/google-icon.png";
import FocalLogo from "@/assets/focal-logo-2.png";

// Firebase imports
import { auth, googleProvider } from "@/firebase.config";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
} from "firebase/auth";

// Toast imports
import { useToast } from "@/components/_ui/toast/use-toast";
import { ToastAction } from "@/components/_ui/toast/toast";

// Firestore imports
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase.config";

interface SignUpDialogProps {
  isDialogOpen: boolean;
  toggleDialog: (isOpen: boolean) => void;
  toggleLoginDialog: (isOpen: boolean) => void;
  children?: React.ReactNode;
}

export function SignUpDialog({
  isDialogOpen,
  toggleDialog,
  toggleLoginDialog,
  children,
}: SignUpDialogProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const { toast } = useToast();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value);

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      if (user) {
        const [firstName, lastName] = name.split(" ");
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          firstName: firstName || "",
          lastName: lastName || "",
          company: "",
          profileImage: ""
        });
        await sendEmailVerification(user);
        toast({
          title: "Verification Email Sent",
          description:
            "A verification email has been sent to your email address. Please check your inbox.",
          duration: 5000,
        });
      }
      toggleDialog(false);
      setEmail("");
      setPassword("");
      setName("");
      // toast({
      //   title: "Registration Successful",
      //   description: "Your account has been created successfully.",
      //   duration: 5000,
      // });
    } catch (error: any) {
      const errorMessage = error.message;
      if (errorMessage === "Firebase: Error (auth/email-already-in-use).") {
        toast({
          variant: "destructive",
          title: "Email already in use",
          description:
            "The email address is already in use by another account.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
          duration: 5000,
        });
        return;
      }
      toast({
        variant: "destructive",
        title: errorMessage,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
        duration: 5000,
      });
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;
      if (user) {
        try {
          const displayName = user?.displayName || "";
          const [firstName, lastName] = displayName.split(" ");
          await setDoc(doc(db, "Users", user.uid), {
            email: user.email,
            firstName: firstName || "",
            lastName: lastName || "",
            company: "",
            profileImage: ""
          });
          await sendEmailVerification(user);
          toast({
            title: "Verification Email Sent",
            description:
              "A verification email has been sent to your email address. Please check your inbox.",
            duration: 5000,
          });
        } catch (error: any) {
          console.error("Error adding document: ", error);
        }
      }
      toggleDialog(false);
      toast({
        title: "Registration Successful",
        description: "Your account has been created successfully.",
        duration: 5000,
      });
    } catch (error: any) {
      const errorMessage = error.message;
      toast({
        variant: "destructive",
        title: errorMessage,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
        duration: 5000,
      });
    }
  };

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={toggleDialog}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="m-0 h-[100vh] overflow-y-auto p-0 lg:max-h-[90vh]">
          <div className="flex w-full flex-col items-center md:flex-row">
            <div className="bg-red relative hidden h-full w-full flex-shrink-0 md:w-1/2 lg:block">
              <img
                src={DialogImage}
                className="h-[90vh] w-full object-cover brightness-75"
                alt="Dialog"
              />
              <div className="absolute inset-0 flex flex-col space-y-16 pl-8 pt-6">
                <img src={FocalLogo} className="left-0 top-0 m-5 w-[100px]" />
                <p className="font-cinzel text-4xl font-bold leading-loose text-white md:text-7xl">
                  Craft
                  <br />
                  From
                  <br />
                  Heart
                </p>
              </div>
            </div>
            <div className="m-auto flex w-full flex-col px-12 py-5 md:w-1/2">
              <h1 className="font-cinzel py-8 text-center text-2xl font-bold">
                CREATE ACCOUNT
              </h1>
              <Button
                variant="outline"
                className="mb-4 flex w-full items-center justify-center space-x-2 rounded-lg border-2 border-gray-300 p-2 transition duration-200 hover:bg-gray-100"
                onClick={handleGoogleSignUp}
              >
                <img
                  src={GoogleIcon}
                  className="h-6 w-6 object-contain"
                  alt="Google Icon"
                />
                <span className="font-medium text-gray-700">
                  Sign up with Google
                </span>
              </Button>
              <div className="my-4 w-full text-center">
                <p className="secondary text-base text-gray-400">- OR -</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Full Name"
                  value={name}
                  onChange={handleNameChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <button
                type="button"
                className="secondary w-full rounded-full bg-black px-4 py-2 font-light text-white transition duration-200"
                onClick={handleSignUp}
              >
                Sign Up
              </button>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <button
                  className="underline"
                  onClick={() => {
                    toggleDialog(false);
                    toggleLoginDialog(true);
                  }}
                >
                  Log in
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
