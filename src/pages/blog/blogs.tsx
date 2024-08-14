import Footer from "@/components/footer/footer";
import Navbar from "@/components/nav/navbar";

// images
import BlogImage1 from "@/assets/blogs-images/blog-img-1.png";
import BlogImage2 from "@/assets/blogs-images/blog-img-2.png";
import BlogImage3 from "@/assets/blogs-images/blog-img-3.png";
import BlogImage4 from "@/assets/blogs-images/blog-img-4.png";
import BlogImage5 from "@/assets/blogs-images/blog-img-5.png";
import BlogImage6 from "@/assets/blogs-images/blog-img-6.png";

import BlogCard from "@/components/blog-card";
import { useState } from "react";
import { LoginDialog } from "@/components/dialogs/login-dialog";
import { SignUpDialog } from "@/components/dialogs/sign-up-dialog";

const blogsContent = [
  {
    id: 1,
    imgURL: BlogImage1,
    title: "Luxury metal fabrication on high end architectural homes.",
    author: "George Hayden",
    date: "9/07/24",
    description:
      "Focal recently had the pleasure of working on a beautiful high-end architectural project in Queenstown. Have a read to find out about the project and see images.",
    link: "/",
  },
  {
    id: 2,
    imgURL: BlogImage2,
    title: "Patagonia- high end commercial shop fit-out.",
    author: "George Hayden",
    date: "5/07/24",
    description:
      "A write up on a recently completed shop fit-out for Patagonia clothing company.",
    link: "/",
  },
  {
    id: 3,
    imgURL: BlogImage3,
    title: "3D modelling for decorative and bespoke metal work.",
    author: "George Hayden",
    date: "22/05/24",
    description:
      "In-house 3D modelling by Focal for all decorative and bespoke metal products.",
    link: "/",
  },
  {
    id: 4,
    imgURL: BlogImage4,
    title: "CNC Profile cutting",
    author: " George Hayden",
    date: "16/05/24",
    description: "Our current in-house CNC profile cutting capabilities.",
    link: "/",
  },
  {
    id: 5,
    imgURL: BlogImage5,
    title: "Focal’s metal options.",
    author: "George Hayden",
    date: "14/05/24",
    description:
      "A write up on the differences in materials available from Focal.",
    link: "/",
  },
  {
    id: 6,
    imgURL: BlogImage6,
    title: "Antique and patina finishing on metals",
    author: "George Hayden",
    date: "9/04/24",
    description:
      "A quick write up on how we antique finish or force rust some of our products.",
    link: "/",
  },
];

const Blogs = () => {
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
    <div className="m-auto flex w-[90%] flex-col items-center pt-16">
      <Navbar />
      <div className="m-auto w-[100%] space-y-5 pb-16 md:pt-[10%]">
        <h1 className="font-secondary text-2xl text-gray-400">Blogs</h1>
        <h1 className="font-cinzel text-6xl">
          Read about <br />
          design & <span className="font-secondary font-medium">TRENDS</span>
        </h1>
      </div>
      <div className="grid w-[110%] grid-cols-1 gap-4 pb-10 md:grid-cols-3">
        {blogsContent.map((blog) => (
          <div className="p-4" key={blog.id}>
            <BlogCard
              id={blog.id}
              title={blog.title}
              date={blog.date}
              author={blog.author}
              description={blog.description}
              imgURL={blog.imgURL}
            />
          </div>
        ))}
      </div>

      <LoginDialog
        isDialogOpen={isLoginDialogOpen}
        toggleSignUpDialog={toggleSignUpDialog}
        toggleDialog={toggleLoginDialog}
      />
      <SignUpDialog
        isDialogOpen={isSignUpDialogOpen}
        toggleLoginDialog={toggleLoginDialog}
        toggleDialog={toggleSignUpDialog}
      >
        <div>
          <button className="m-auto mt-5 flex min-w-12 items-center justify-center rounded-full bg-black px-6 py-2 md:px-10 md:py-3">
            <p className="font-secondary font-extralight text-white md:text-base">
              GET STARTED
            </p>
          </button>
        </div>
      </SignUpDialog>
      <Footer />
    </div>
  );
};

export default Blogs;
