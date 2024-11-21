/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/_ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/_ui/dialog";
import { Input } from "@/components/_ui/input";
import { Label } from "@/components/_ui/label";
import { useEffect, useState } from "react";
import DialogImage from "@/assets/dialogs-img.png";
import GoogleIcon from "@/assets/icons/google-icon.png";
import FocalLogo from "@/assets/focal-logo-2.png";

// Firebase imports
import { auth, googleProvider } from "@/firebase.config";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

// Toast imports
import { useToast } from "@/components/_ui/toast/use-toast";
import { ToastAction } from "@/components/_ui/toast/toast";

// Firestore imports
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase.config";
import { AddClient, AddContact, FetchClients } from "@/services/webflow-services";
import { fetchDocuments } from "@/services/db-services";

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
  const [firstName, setFirstName] = useState<string>(""); // Separate state for First Name
  const [lastName, setLastName] = useState<string>("");   // Separate state for Last Name
  const [address, setAddress] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [position, setPosition] = useState<string>(""); // New state for Position
  const [selectedClientID, setselectedClientID] = useState<string>("");
  const [selectedContactID, setselectedContactID] = useState<string>("");
  const [isCompanyAssociated, setIsCompanyAssociated] = useState<boolean | null>(null); // Changed to allow null (unselected)
  const [clients, setClients] = useState<any[]>([]);
  const [companySuggestions, setCompanySuggestions] = useState<any[]>([]);
  const [mobile, setMobile] = useState<string>("");
  const [showdatalist, setshowdatalist] = useState(false);
  const [showCompanyDialog, setShowCompanyDialog] = useState<boolean>(false);

  // New loading state
  const [isSigningUp, setIsSigningUp] = useState<boolean>(false);

  const { toast } = useToast();

  useEffect(() => {
    const fetchClientsData = async (attempt = 1) => {
      try {
        const response:any = await FetchClients(); // Ensure FetchClients is properly defined and imported
        
        if (response.success) {
          setClients(response.data);
        } else {
          // console.error(`Failed to fetch clients on attempt ${attempt}:`, response.message);
          
          if (attempt < 2) { // Retry only once
            fetchClientsData(attempt + 1);
          }
        }
      } catch (error) {
        // console.error(`Error fetching clients on attempt ${attempt}:`, error);
        
        if (attempt < 2) { // Retry only once
          fetchClientsData(attempt + 1);
        }
      }
    };

    fetchClientsData();
  }, []);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);
  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFirstName(e.target.value); // Handler for First Name
  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setLastName(e.target.value); // Handler for Last Name
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setAddress(e.target.value);
  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userInput = e.target.value; // Keep original input with spaces
    setCompany(userInput);

    const trimmedInput = userInput.trim(); // Use trimmed input for filtering

    if (!isCompanyAssociated || trimmedInput.length < 1) {
      // Only filter suggestions if associated and at least one character is entered
      setCompanySuggestions([]);
      setshowdatalist(false);
      return;
    }

    // Filter company suggestions based on input and limit to 3
    const filteredSuggestions = clients
      .filter((client) => {
        const clientName = Array.isArray(client.Name) ? client.Name[0] : client.Name;
        return clientName?.toLowerCase().includes(trimmedInput.toLowerCase());
      })
      .slice(0, 3); // Limit to 3 suggestions

    console.log('filteredSuggestions', filteredSuggestions);
    setCompanySuggestions(filteredSuggestions);

    if (filteredSuggestions.length > 0) {
      setshowdatalist(true);
    } else {
      setshowdatalist(false);
    }
  };
  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setMobile(e.target.value);
  const handlePositionChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPosition(e.target.value); // Handler for Position

  const handleSignUp = async () => {
    setIsSigningUp(true); // Start loading
    try {
      if (!selectedClientID && isCompanyAssociated) {
        toast({
          title: "Selected company does not exist",
          description:
            "Please select a company exactly from the provided list.",
          duration: 5000,
        });
        setIsSigningUp(false);
        return;
      }

      // Additional validation for company name when not associated
      if (!isCompanyAssociated && !company.trim()) {
        toast({
          variant: "destructive",
          title: "Company name is required",
          description: "Please enter your company name.",
          duration: 5000,
        });
        setIsSigningUp(false);
        return;
      }




      const filter = [
        { field: 'email', operator: '==', value: email }, // Filter by customerID
      ];
      const userfromdb = await fetchDocuments('Users', filter);
      console.log(userfromdb);


      let user;
      if (userfromdb.length !== 0) {
        toast({
          variant: "destructive",
          title: "Email is already in Use",
          description: "Please use different Email",
          duration: 4000,
        });
        return;
      }
      else {
        try {
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          user = userCredential.user;

        } catch (error) {
         //
        }
      }
      if (user === undefined) {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );
        user = userCredential.user;
      }
      console.log('user data from auth ' + user);
      console.log('user data from auth ' + JSON.stringify(user));


      let clientID = '';
      let contactID;
      if (isCompanyAssociated) {
        const contact = {
          address: address,
          clientUUID: selectedClientID,
          email: email,
          mobile: mobile,
          name: `${firstName} ${lastName}`,
          phone: mobile,
          position: position || "", // Use position from state
        };
        contactID = await AddContact(contact);
        console.log('contactID ', contactID);
        setselectedContactID(contactID);
      } else {
        const client = {
          address: address,
          firstName: firstName || "",
          lastName: lastName || "",
          name: company,
        };
        clientID = await AddClient(client);
        console.log('clientID ', clientID);
        setselectedClientID(clientID);

        const contact = {
          address: address,
          clientUUID: clientID,
          email: email,
          mobile: mobile,
          name: `${firstName} ${lastName}`,
          phone: mobile,
          position: position || "", // Use position from state
        };
        contactID = await AddContact(contact);
        console.log('contactID ', contactID);
        setselectedContactID(contactID);
      }

      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          firstName: firstName || "",
          lastName: lastName || "",
          company: company || "", // Always set company to entered value
          address: address || "",
          profileImage: "",
          role: "customer",
          clientID: clientID !== '' ? clientID : selectedClientID,
          contactID: contactID || '',
          mobile: mobile || '',
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
      // Reset form fields
      setEmail("");
      setPassword("");
      setFirstName(""); // Reset First Name
      setLastName("");  // Reset Last Name
      setAddress("");
      setMobile("");
      setCompany("");
      setPosition(""); // Reset position
      setIsCompanyAssociated(null); // Reset association
    } catch (error: any) {
      const errorMessage = error.message;
      setIsSigningUp(false);
      if (errorMessage === "Firebase: Error (auth/email-already-in-use).") {
        toast({
          variant: "destructive",
          title: "Email already in use",
          description: "The email address is already in use by another account.",
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
    setIsSigningUp(true); // Start loading
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;
      const userRef = doc(db, "Users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        toast({
          variant: "destructive",
          title: "Email is already in Use",
          description: "Please use different Email",
          duration: 4000,
        });
        return;
      }

      if (user) {
        const displayName = user?.displayName || "";


        const [firstName, lastName] = displayName.split(" ");
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          firstName: firstName || "",
          lastName: lastName || "",
          mobile: "",
          company: "",
          address: "",
          contactID: "",
          clientID: "",
          profileImage: "",
          role: "customer",

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
    setIsSigningUp(false); // End loading
  };

  return (
    <>
      {!showCompanyDialog && (
        <Dialog open={isDialogOpen} onOpenChange={toggleDialog}>
          <DialogTrigger asChild>{children}</DialogTrigger>
          <DialogContent className="m-0 h-[100vh] overflow-y-auto p-0 lg:max-h-[90vh]">
            <div className="flex w-full flex-col items-center md:flex-row">
              <div className="bg-red relative hidden h-full w-full flex-shrink-0 md:w-1/2 lg:block">
                <img
                  src={DialogImage}
                  className="h-[122vh] w-full object-cover brightness-75"
                  alt="Dialog"
                />
                <div className="absolute inset-0 flex flex-col space-y-16 pl-8 pt-6">
                  <img src={FocalLogo} className="left-0 top-0 m-5 w-[100px]" alt="Focal Logo" />
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
                  disabled={isSigningUp} // Disable during loading
                >
                  <img
                    src={GoogleIcon}
                    className="h-6 w-6 object-contain"
                    alt="Google Icon"
                  />
                  <span className="font-medium text-gray-700">
                    {isSigningUp ? "Signing Up..." : "Sign up with Google"}
                  </span>
                </Button>
                <div className="my-4 w-full text-center">
                  <p className="secondary text-base text-gray-400">- OR -</p>
                </div>
                <div className="grid gap-2 mb-4">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="First Name"
                    value={firstName}
                    onChange={handleFirstNameChange}
                    required
                    disabled={isSigningUp} // Disable during loading
                  />
                </div>
                <div className="grid gap-2 mb-4">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={handleLastNameChange}
                    required
                    disabled={isSigningUp} // Disable during loading
                  />
                </div>
                <div className="grid gap-2 mb-4">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={handleEmailChange}
                    required
                    disabled={isSigningUp} // Disable during loading
                  />
                </div>
                <div className="grid gap-2 mb-4">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                    disabled={isSigningUp} // Disable during loading
                  />
                </div>
                {/* Mobile field */}
                <div className="grid gap-2 mb-4">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input
                    id="mobile"
                    placeholder="Mobile Number"
                    value={mobile}
                    onChange={handleMobileChange}
                    disabled={isSigningUp} // Disable during loading
                  />
                </div>
                <div className="grid gap-2 mb-4">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="Address"
                    value={address}
                    onChange={handleAddressChange}
                    disabled={isSigningUp} // Disable during loading
                  />
                </div>
                <div className="grid gap-2 mb-4">
                  <Label>Are you associated with a Company?</Label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="companyAssociation"
                        value="yes"
                        checked={isCompanyAssociated === true}
                        onChange={() => setIsCompanyAssociated(true)}
                        className="mr-2"
                        disabled={isSigningUp} // Disable during loading
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="companyAssociation"
                        value="no"
                        checked={isCompanyAssociated === false}
                        onChange={() => setIsCompanyAssociated(false)}
                        className="mr-2"
                        disabled={isSigningUp} // Disable during loading
                      />
                      No
                    </label>
                  </div>
                </div>

                {/* Conditionally render Company and Position fields */}
                {isCompanyAssociated !== null && (
                  <>

                    <div className="grid gap-2 relative">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        placeholder="Company"
                        value={company}
                        onChange={handleCompanyChange}
                        onFocus={() => {
                          if (isCompanyAssociated && company.trim().length >= 1 && companySuggestions.length > 0) {
                            setshowdatalist(true);
                          }
                        }}
                        onBlur={() => setTimeout(() => setshowdatalist(false), 200)}
                        className="focus:outline-none focus:ring focus:border-blue-500 mt-2 mb-4"
                        disabled={isSigningUp} // Disable during loading
                      />

                      {showdatalist && companySuggestions.length > 0 && (
                        <ul className="absolute z-10 bg-white border border-gray-300 rounded-md shadow-md max-h-48 overflow-auto w-full mt-16">
                          {companySuggestions.map((suggestion, index) => {
                            const suggestionName = Array.isArray(suggestion.Name)
                              ? suggestion.Name[0]
                              : suggestion.Name;

                            return (
                              <li
                                key={index}
                                onMouseDown={() => {
                                  setselectedClientID(suggestion.UUID[0]);
                                  setCompany(suggestion.Name[0]);
                                  console.log("selected client id", suggestion.UUID[0]);
                                  setshowdatalist(false); // Hide suggestions after selection
                                }}
                                className="px-2 py-1 hover:bg-gray-100 cursor-pointer transition-all duration-200"
                              >
                                {suggestionName}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                    <div className="grid gap-2 mb-4">
                      <Label htmlFor="position">Position</Label>
                      <Input
                        id="position"
                        placeholder="Position"
                        value={position}
                        onChange={handlePositionChange}
                        disabled={isSigningUp} // Disable during loading
                      />
                    </div>
                  </>
                )}

                <button
                  type="button"
                  className={`secondary w-full rounded-full px-4 py-2 font-light text-white transition duration-200 ${isSigningUp
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-black hover:bg-gray-800"
                    }`}
                  onClick={handleSignUp}
                  disabled={isSigningUp} // Disable during loading
                >
                  {isSigningUp ? "Signing Up..." : "Sign Up"}
                </button>
                <div className="mt-4 text-center text-sm">
                  Already have an account?{" "}
                  <button
                    className="underline"
                    onClick={() => {
                      if (!isSigningUp) { // Prevent switching dialogs during loading
                        toggleDialog(false);
                        toggleLoginDialog(true);
                      }
                    }}
                    disabled={isSigningUp} // Disable during loading
                  >
                    Log in
                  </button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
