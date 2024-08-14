import { scrollToTop } from "@/utils/helpers";
import { Link } from "react-router-dom";

const PortfolioCard = ({ id, title, description, imgURL }: any) => {
  return (
    <div className="overflow-hidden rounded-3xl text-start">
      <img src={imgURL} alt="Room Driver" className="h-full w-full" />
      <div className="py-4">
        <h3 className="mb-2 font-secondary text-xl font-semibold">{title}</h3>
        <p className="mb-4 text-gray-600">{description}</p>
        <Link
          to={`/portfolio/${id}`}
          className="border-black text-black hover:border-blue-500 hover:text-blue-500"
          onClick={scrollToTop}
        >
          <p className="font-cinzel text-xl font-extralight underline">
            View Project
          </p>
        </Link>
      </div>
    </div>
  );
};

export default PortfolioCard;
