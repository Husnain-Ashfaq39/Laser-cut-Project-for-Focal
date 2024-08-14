import heroImage from "@/assets/hero-img-1.png";
// import { SignUpDialog } from "./dialogs/sign-up-dialog";
// import { useState } from "react";
// import { LoginDialog } from "./dialogs/login-dialog";

import { useNavigate } from "react-router-dom";

// should contain the logo, nav bar, the search bar, the
const hero = () => {
  // const [isSignUpDialogOpen, setIsSignUpDialogOpen] = useState(false);
  // const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const navigate=useNavigate();

  // const toggleSignUpDialog = (isOpen: boolean) => {
  //   setIsSignUpDialogOpen(isOpen);
  //   if (isOpen) setIsLoginDialogOpen(false);
  // };

  // const toggleLoginDialog = (isOpen: boolean) => {
  //   setIsLoginDialogOpen(isOpen);
  //   if (isOpen) setIsSignUpDialogOpen(false);
  // };
  return (
    <div className="flex min-h-screen flex-col">
      <img
        src={heroImage}
        className="absolute -top-5 mb-10 min-h-[110vh] overflow-hidden rounded-3xl object-cover brightness-50"
        alt="Hero"
      />
      <div className="relative mx-auto flex h-screen w-[90%] flex-col justify-center space-y-10 px-4 py-20 text-left">
        <h1 className="mt-16 pt-16 font-secondary uppercase text-white md:text-4xl 2xl:mt-0 2xl:text-5xl">
          Focal
        </h1>
        <h1 className="font-primary text-4xl uppercase text-white md:text-5xl 2xl:text-7xl">
          LUXURY METAL FABRICATION
        </h1>
        <p className="my-8 font-secondary text-base text-white sm:max-w-2xl md:text-xl">
          For projects that demand excellence, <br /> trust the experts.
        </p>
        {/* <LoginDialog
        navgateto={true}
          isDialogOpen={isLoginDialogOpen}
          toggleSignUpDialog={toggleSignUpDialog}
          toggleDialog={toggleLoginDialog}
        />
        <SignUpDialog
          isDialogOpen={isSignUpDialogOpen}
          toggleLoginDialog={toggleLoginDialog}
          toggleDialog={toggleSignUpDialog}
        >
        </SignUpDialog> */}
          <div>
            <button className="mt-5 rounded-full bg-white px-6 py-2 md:px-10 md:py-3" onClick={()=>{navigate("/start-quoting")}}>
              <h1 className="font-secondary text-base font-normal text-black md:text-xl">
                GET YOUR QUOTES NOW
              </h1>
            </button>
          </div>
      </div>
    </div>
  );
};

export default hero;
