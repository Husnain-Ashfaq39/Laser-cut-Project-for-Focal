import { Button } from "@/components/_ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/_ui/dialog";
import { Input } from "@/components/_ui/input";
import { Label } from "@/components/_ui/label";
import { useState, ChangeEvent, useEffect } from "react";
import DialogImage from "@/assets/dialogs-img.png";
import GoogleIcon from "@/assets/icons/google-icon.png";
import FocalLogo from "@/assets/focal-logo-2.png";

// Firebase imports
import { auth, db, googleProvider } from "@/firebase.config";
import {
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

// Toast imports
import { useToast } from "@/components/_ui/toast/use-toast";
import { ToastAction } from "@/components/_ui/toast/toast";
import { doc, setDoc } from "firebase/firestore";

import { useNavigate } from "react-router-dom";

interface LoginDialogProps {
  navgateto?: boolean;
  isDialogOpen: boolean;
  toggleDialog: (isOpen: boolean) => void;
  toggleSignUpDialog: (isOpen: boolean) => void;
  children?: React.ReactNode;
}

export function LoginDialog({
  navgateto = false,
  isDialogOpen,
  toggleDialog,
  toggleSignUpDialog,
  children,
}: LoginDialogProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    const checkUserStatus = async () => {
      auth.onAuthStateChanged((user) => {
        if (user && user.emailVerified) {
          if (navgateto) {
            navigate("quotes/history");
          }
        }
      });
    };
    if (navgateto) {
      checkUserStatus();
    }
  }, [navgateto]);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      if (!user.emailVerified) {
        toast({
          variant: "destructive",
          title: "Email not verified",
          description:
            "Please verify your email before accessing your account.",
          duration: 5000,
        });
        return;
      }

      toast({
        title: "Login Successful",
        description: "You have been logged in successfully.",
      });

      toggleDialog(false);
      setEmail("");
      setPassword("");
      // window.location.reload(); // Refresh the window
      if (navgateto) {
        navigate("/quotes/history");
      }
    } catch (error: any) {
      const errorMessage = error.message;
      if (errorMessage === "Firebase: Error (auth/user-not-found).") {
        toast({
          variant: "destructive",
          title: "User not found",
          description: "The email address is not registered.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
          duration: 5000,
        });
        return;
      } else if (
        errorMessage === "Firebase: Error (auth/invalid-credential)."
      ) {
        toast({
          variant: "destructive",
          title: "Invalid credentials",
          description: "Email or password invalid.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
          duration: 5000,
        });
        return;
      }
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: errorMessage,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
        duration: 5000,
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;
      console.log("user after google auth", user);
      if (user) {
        try {
          const displayName = user?.displayName || "";
          const [firstName, lastName] = displayName.split(" ");
          await setDoc(doc(db, "Users", user.uid), {
            email: user.email,
            firstName: firstName || "",
            lastName: lastName || "",
            company: "",
          });
          await sendEmailVerification(user);
        } catch (error: any) {
          console.error("Error adding document: ", error);
        }
      }
      toggleDialog(false);
      toast({
        title: "Registration Successful",
        description: "Your account has been created successfully.",
      });
      // window.location.reload(); // Refresh the window
      if (navgateto) {
        navigate("/quote/history");
      }
    } catch (error: any) {
      const errorMessage = error.message;
      toast({
        variant: "destructive",
        title: errorMessage,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  };

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={toggleDialog}>
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent className="m-0 h-[100vh] overflow-y-auto p-0 lg:max-h-[80vh]">
          <div className="flex w-full flex-col items-center sm:flex-row">
            <div className="hidden h-full w-full flex-shrink-0 sm:w-1/2 md:block">
              <img
                src={DialogImage}
                className="w-full overflow-hidden rounded-l-3xl brightness-75 md:h-[80vh]"
                alt="Dialog"
              />
              <div className="absolute inset-0 flex flex-col pl-8 pt-6">
                <img
                  src={FocalLogo}
                  className="left-0 top-0 m-5 w-[100px] rounded-lg"
                  alt="Focal Logo"
                />
                <p className="font-cinzel text-4xl font-bold leading-relaxed text-white sm:text-7xl">
                  Craft
                  <br />
                  From
                  <br />
                  Heart
                </p>
              </div>
            </div>
            <div className="m-auto flex h-[80vh] w-[80%] flex-col justify-center px-12">
              <h1 className="font-cinzel py-5 text-center text-2xl font-bold">
                LOG IN
              </h1>
              <div className="flex flex-col space-y-2 pt-6">
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
                  className="w-full rounded-full bg-black px-4 py-2 font-secondary font-light text-white transition duration-200"
                  onClick={handleLogin}
                >
                  Sign In
                </button>
                <div className="my-4 w-full text-center">
                  <p className="font-secondary text-base text-gray-400">
                    - Or Login with -
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="mb-4 flex w-full items-center justify-center space-x-2 rounded-3xl border-2 border-gray-300 p-2 transition duration-200 hover:bg-gray-100"
                  onClick={handleGoogleLogin}
                >
                  <img
                    src={GoogleIcon}
                    className="h-6 w-6 object-contain"
                    alt="Google Icon"
                  />
                  <span className="font-semibold text-gray-700">
                    Login with Google
                  </span>
                </Button>
                <div className="mt-4 text-center text-sm">
                  Don't have an account?{" "}
                  <button
                    className="underline"
                    onClick={() => {
                      toggleDialog(false);
                      toggleSignUpDialog(true);
                    }}
                  >
                    Sign up
                  </button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
