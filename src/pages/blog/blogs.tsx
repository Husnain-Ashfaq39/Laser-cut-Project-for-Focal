import Footer from "@/components/footer/footer";
import Navbar from "@/components/nav/navbar";
import BlogCard from "@/components/blog-card";
import { useState, useEffect } from "react";
import { LoginDialog } from "@/components/dialogs/login-dialog";
import { SignUpDialog } from "@/components/dialogs/sign-up-dialog";
import { getBlogsFromDb } from "@/services/blogs"; // Assuming you have this service for fetching blogs


const Blogs = () => {
  const [blogsContent, setBlogsContent] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true); // For handling loading state
  const [isSignUpDialogOpen, setIsSignUpDialogOpen] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null); // For feedback to the user

  // Fetch blogs from the database on component mount
  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      try {
        const blogs = await getBlogsFromDb();
        setBlogsContent(blogs);
      } catch (error) {
        console.error("Error fetching blogs: ", error);
        setFeedbackMessage("Error fetching blogs from the database.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

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
      {feedbackMessage && (
        <p className={`mt-4 ${feedbackMessage.startsWith("Error") ? "text-red-500" : "text-green-500"}`}>
          {feedbackMessage}
        </p>
      )}

      <div className="grid w-[110%] grid-cols-1 gap-4 pb-10 md:grid-cols-3">
        {blogsContent.map((blog) => (
          <div className="p-4" key={blog.id}>
            <BlogCard
              id={blog.firestoreId}
              title={blog.title}
              date={blog.date}
              author={blog.author}
              description={blog.description}
              imgURL={blog.previewImage}
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
