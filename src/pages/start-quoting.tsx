
import { useState } from "react";

import Footer from "@/components/footer/footer";
import Navbar from "@/components/nav/navbar";
import QuotingPicture from "@/assets/quoting.jfif";
import { SignUpDialog } from "@/components/dialogs/sign-up-dialog";
import { LoginDialog } from "@/components/dialogs/login-dialog";

const StartQuoting = () => {
  const [isSignUpDialogOpen, setIsSignUpDialogOpen] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

  
  const toggleSignUpDialog = (isOpen: boolean) => {
    setIsSignUpDialogOpen(isOpen);
    if (isOpen) setIsLoginDialogOpen(false);
  };

  const toggleLoginDialog = (isOpen: boolean) => {
    setIsLoginDialogOpen(isOpen);
    if (isOpen) setIsSignUpDialogOpen(false);
  };

  return (
    <div className="m-auto flex w-[80%] flex-col items-center pt-16">
      <Navbar />
      <div className="flex w-[100%] pb-16 pt-16 md:pt-[10%]">
        <div className="flex w-1/2 flex-col justify-center space-y-4">
          <h1 className="font-cinzel text-6xl">
            Start <br />
            <span className="font-secondary font-normal">Quoting</span>
          </h1>
          <p className="mr-10 mt-4 font-secondary font-normal text-gray-600">
            Begin your journey with our advanced laser cut automatic quoting
            system to receive precise estimates for your projects. You can also
            place orders for parts to be expertly laser-cut, and we’ll handle
            the rest. Our dedicated team is here to provide you with all the
            assistance and information you need.
          </p>

          <SignUpDialog
            isDialogOpen={isSignUpDialogOpen}
            toggleLoginDialog={toggleLoginDialog}
            toggleDialog={toggleSignUpDialog}
          >
            <div><button className="mt-15 mr-10 w-auto rounded-full bg-black px-6 py-2 text-white md:px-10 md:py-3">
              <h1 className="font-secondary text-base font-normal md:text-xl">
                Start Quoting Now!
              </h1>
            </button></div>
          </SignUpDialog>
            
          <LoginDialog
            navgateto={true}
            isDialogOpen={isLoginDialogOpen}
            toggleSignUpDialog={toggleSignUpDialog}
            toggleDialog={toggleLoginDialog}
          >
            
          </LoginDialog>
        </div>
        <div className="w-1/2">
          <img
            src={QuotingPicture}
            className="my-10 h-[400px] w-screen rounded-3xl object-cover"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StartQuoting;