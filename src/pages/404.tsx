import NotFoundImage from "@/assets/images/not-found.svg";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="m-auto flex h-screen w-[80%] flex-col items-center justify-center space-y-10">
      <img src={NotFoundImage} alt="404" className="w-[50%]" />
      <h1 className="font-primary text-6xl capitalize">Page Not found</h1>
      <p className="font-body text-2xl text-gray-400 md:max-w-[50%]">
        It's looking like you may have taken a wrong turn. Don't worry... it
        happens to the best of us.
      </p>
      <Link to="/">
        <div className="rounded-full bg-black py-3 px-6">
          <span className="font-secondary text-2xl capitalize text-white">
            back to home
          </span>
        </div>
      </Link>
    </div>
  );
};

export default PageNotFound;
