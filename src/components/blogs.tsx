import img1 from "@/assets/blogs/home-img-1.png";
import img2 from "@/assets/blogs/home-img-2.png";
import img3 from "@/assets/blogs/home-img-3.png";
import { scrollToTop } from "@/utils/helpers";
import { Link, useNavigate } from "react-router-dom";

const posts = [
  {
    id: 1,
    img: img1,
    title: "Luxury metal fabrication on high end architectural homes.",
    description:
      "Focal recently had the pleasure of working on a beautiful high-end architectural project in Queenstown. Have a read to find out about the project and see images.",
  },
  {
    id: 2,
    img: img2,
    title: "Patagonia- high end commercial shop fit-out.",
    description:
      "A write up on a recently completed shop fit-out for Patagonia clothing company.",
  },
  {
    id: 6,
    img: img3,
    title: "Antique and patina finishing on metals",
    description:
      "A quick write up on how we antique finish or force rust some of our products.",
  },
];

const Blogs = () => {
  const navigate = useNavigate();
  return (
    <div className="mx-auto w-[90%] py-8">
      <h1 className="mb-4 text-start font-secondary text-3xl text-gray-500">
        Blogs
      </h1>
      <h1 className="font-cinzel mb-8 text-start text-6xl">
        Read About <br /> Design &{" "}
        <span className="font-secondary font-semibold">TRENDS</span>
      </h1>

      <div className="flex w-full items-start justify-center gap-4 py-4">
        {posts.map((post, index) => (
          <div
            key={index}
            className="flex h-auto w-1/3 flex-col items-center justify-center py-[5vw]"
          >
            <img
              src={post.img}
              className="mb-4 h-[350px] w-[95%] rounded-[5%] object-cover"
            />
            <div className="flex h-[250px] w-[95%] flex-col space-y-2">
              <p className="mb-2 h-2/5 text-start font-secondary text-3xl font-normal">
                {post.title}
              </p>
              <p className="text-md mb-2 h-2/5 text-start font-body font-medium text-gray-500">
                {post.description}
              </p>
              <Link to={`/blogs/${post.id}`} onClick={scrollToTop}>
                <p className="font-cinzel h-1/5 py-2 underline">Read More</p>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <button
        className="m-auto mt-5 flex min-w-12 items-center justify-center rounded-full bg-black px-6 py-2 md:px-10 md:py-3"
        onClick={() => {
          navigate("/blogs");
          scrollToTop();
        }}
      >
        <p className="font-secondary font-extralight text-white md:text-base">
          READ MORE
        </p>
      </button>
    </div>
  );
};

export default Blogs;
