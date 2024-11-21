import Footer from "@/components/footer/footer";
import Navbar from "@/components/nav/navbar";
import Rectangle from "@/assets/rectangle.png";
import SmallClock from "@/assets/small-clock.png";
import SocialsImageII from "@/assets/socials-2.png";
import { Input } from "@/components/_ui/input";
import { Link, useNavigate, useParams } from "react-router-dom";
import { scrollToTop } from "@/utils/helpers";
import { ChevronLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { getBlogById } from "@/services/blogs";

const SingleBlog: React.FC = () => {
  const { blogId } = useParams<{ blogId?: string }>();
  const [blog, setBlog] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      if (blogId) {
        setIsLoading(true);
        try {
          const fetchedBlog = await getBlogById(blogId);
          if (fetchedBlog) {
            setBlog(fetchedBlog);
          } else {
            setError("Blog not found.");
          }
        } catch (err) {
          console.error("Error fetching blog: ", err);
          setError("Failed to fetch blog.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchBlog();
  }, [blogId]);

  if (isLoading) {
    return;
    <></>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!blog) {
    return <p>No blog available.</p>;
  }

  return (
    <div className="m-auto flex w-[100%] flex-col">
      <Navbar />
      <div className="relative m-auto min-h-[70vh] w-full bg-cover bg-center p-10 px-[5%] font-secondary text-white md:mt-[8%]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${blog.previewImage})`,
            filter: "brightness(0.7)",
            zIndex: 0,
          }}
        ></div>
        <div className="spacing-y-10 relative z-10">
          <Link to="/blogs" className="flex flex-row items-center">
            <ChevronLeft className="h-8 w-8 pt-1" />
            <span className="m-5 p-2 text-2xl">back to blogs</span>
          </Link>

          <h1 className="mx-5 mb-1 mt-24 w-[60%] font-secondary text-6xl capitalize">
            {blog.title}
          </h1>
          <h2 className="mx-5 w-[60%] py-5 font-secondary text-xl">
            {blog.description}
          </h2>
          <div className="mx-5 flex flex-row items-center font-light">
            <p>{blog.author}</p>
            <img
              src={Rectangle}
              alt="rectangle"
              className="mx-2 h-[1px] w-[20px] bg-white"
            />
            <img
              src={SmallClock}
              alt="small-clock"
              className="h-[20px] w-[20px]"
            />
            <p>{blog.readTime} reads</p>
          </div>
        </div>
      </div>

      <div className="flex w-screen flex-row">
        <div className="flex w-[70%] flex-col items-center space-y-4 bg-slate-50 px-10 pt-10">
          {blog.content.map((item: any, index: number) => {
            switch (item.type) {
              case "title":
                return (
                  <h1
                    key={index}
                    className="w-full text-start font-primary text-xl text-gray-800"
                  >
                    {item.content}
                  </h1>
                );
              case "paragraph":
                return (
                  <p
                    key={index}
                    className="my-2 text-start indent-4 font-secondary text-lg"
                  >
                    {item.content}
                  </p>
                );
              case "image":
                return (
                  <>
                    <img
                      key={index}
                      src={item.imgURL}
                      className="h-[400px] w-[80%] rounded-3xl object-cover shadow-2xl"
                    />
                    <p className="text-lg italic text-gray-600">
                      {item?.subtitle}
                    </p>
                  </>
                );
              default:
                return null;
            }
          })}
        </div>
        <div className="w-[30%] space-y-10 px-[5%]">
          <p className="pt-16 font-secondary text-xl">Follow Us</p>
          <img src={SocialsImageII} alt="socials" className="h-auto w-full" />
          <p className="font-secondary">{}</p>
          <Input placeholder="Enter your email" />
          <button
            className="m-auto mt-5 flex min-w-full items-center justify-center rounded-full bg-black px-6 py-2 md:px-10 md:py-3"
            onClick={() => {
              navigate("/portfolio");
              scrollToTop();
            }}
          >
            <p className="font-secondary font-extralight text-white md:text-base">
              SUBSCRIBE NOW
            </p>
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SingleBlog;
