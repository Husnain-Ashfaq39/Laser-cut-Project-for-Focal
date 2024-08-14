import RectangleImage from "@/assets/rectangle.png";
import { scrollToTop } from "@/utils/helpers";
import { Link } from "react-router-dom";
const BlogCard = ({
  id,
  title,
  description,
  imgURL,
  author = "Hoanna Wellik",
  date = "June 28, 2018",
}: any) => {
  return (
    <>
      <div className="overflow-hidden rounded-3xl">
        <img
          src={imgURL}
          alt="Room Driver"
          className="h-[350px] w-full object-cover"
        />
      </div>
      <div className="pt-8">
        <h3 className="mb-2 font-secondary text-4xl font-medium">{title}</h3>
        <div className="flex flex-row">
          <p className="font-secondary text-lg">{author}</p>
          <img src={RectangleImage} className="object-contain px-4" />
          <span className="font-secondary text-base text-gray-500"> {date}</span>
        </div>
        <p className="mb-4 text-gray-600">{description}</p>
        <Link
          to={`/blogs/${id}`}
          className="border-black text-black hover:border-blue-500 hover:text-blue-500"
          onClick={scrollToTop}
        >
          <p className="font-cinzel text-xl font-extralight underline">
            View Project
          </p>
        </Link>
      </div>
    </>
  );
};

export default BlogCard;
