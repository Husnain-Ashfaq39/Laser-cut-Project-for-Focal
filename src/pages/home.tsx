import Description from "@/components/about";
import Hero from "@/components/hero";
// import { InfiniteMovingCards } from "@/components/inifinite-moving-cards"
import { ProjectsMovingCards } from "@/components/moving-cards/projects-moving-cards";
import Navbar from "@/components/nav/navbar";
import ImgAboutUs from "@/assets/img-about-us.png";
import Services from "@/components/services";
import Portfolio from "@/components/portfolio";
import Blogs from "@/components/blogs";
import Footer from "@/components/footer/footer";
import Testimonials from "@/components/testimonials";
import { useNavigate } from "react-router-dom";
import { scrollToTop } from "@/utils/helpers";
// import { SignUpDialog } from "@/components/dialogs/sign-up-dialog";
// import { LoginDialog } from "@/components/dialogs/login-dialog";
// import { useState } from "react";

const Home = () => {
  const navigate = useNavigate();
  // const [isSignUpDialogOpen, setIsSignUpDialogOpen] = useState(false);
  // const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

  // const toggleSignUpDialog = (isOpen: boolean) => {
  //   setIsSignUpDialogOpen(isOpen);
  //   if (isOpen) setIsLoginDialogOpen(false);
  // };

  // const toggleLoginDialog = (isOpen: boolean) => {
  //   setIsLoginDialogOpen(isOpen);
  //   if (isOpen) setIsSignUpDialogOpen(false);
  // };

  return (
    <div className="overflow-y-auto no-scrollbar">
      <Navbar />
      <Hero />
      <Description />
      <div className="relative mt-10 flex h-[30rem] flex-col items-center justify-start overflow-hidden rounded-md bg-white antialiased dark:bg-black dark:bg-grid-white/[0.05]">
        <ProjectsMovingCards direction="left" speed="slow" />
      </div>
      <div className="mb-10 flex justify-center">
        <button
          className="mb-10 mt-5 flex items-center justify-center rounded-full bg-black px-6 py-2 md:px-10 md:py-3"
          onClick={() => {
            navigate("/portfolio");
            scrollToTop();
          }}
        >
          <p className="font-secondary font-extralight text-white md:text-base">
            SEE ALL PROJECTS
          </p>
        </button>
      </div>
      <div className="m-auto w-[65%]">
        <h1 className="text-center font-cinzel text-5xl">
          We believe in investing in teams, relationships and equipment to
          reliably provide value to projects.
        </h1>
      </div>
      <div className="m-auto w-full pt-16">
        <img src={ImgAboutUs} className="h-[30rem] w-full object-contain" />
      </div>
      <div className="mb-10 flex justify-center">

        {/* <SignUpDialog
          isDialogOpen={isSignUpDialogOpen}
          toggleLoginDialog={toggleLoginDialog}
          toggleDialog={toggleSignUpDialog}
        >
        </SignUpDialog> */}
        <div>
          <button className="mt-5 flex items-center justify-center rounded-full bg-black px-6 py-2 md:px-10 md:py-3" onClick={()=>{navigate("/start-quoting")}}>
            <p className="font-secondary font-extralight text-white md:text-base">
              GET YOUR QUOTES NOW
            </p>
          </button>
        </div>
        {/* <LoginDialog
          navgateto={true}
          isDialogOpen={isLoginDialogOpen}
          toggleSignUpDialog={toggleSignUpDialog}
          toggleDialog={toggleLoginDialog}
        /> */}
      </div>
      <Services />
      <Portfolio />
      <Blogs />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Home;
