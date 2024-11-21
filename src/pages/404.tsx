import NotFoundImage from "@/assets/images/not-found.svg";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handlenavigate = () => {
      navigate('/');
    };
    handlenavigate();
  }, [navigate]); // Use 'navigate' as a dependency to ensure proper rerendering

  return (
    <div className="m-auto flex h-screen w-[80%] flex-col items-center justify-center space-y-10">
      <img src={NotFoundImage} alt="404" className="w-[50%]" />
      <h1 className="font-primary text-6xl capitalize">Page Not Found</h1>
      <p className="font-body text-2xl text-gray-400 md:max-w-[50%]">
        It looks like you may have taken a wrong turn. Don't worry... it happens to the best of us.
      </p>
      <Link to="/">
        <div className="rounded-full bg-black py-3 px-6">
          <span className="font-secondary text-2xl capitalize text-white">
            Back to Home
          </span>
        </div>
      </Link>
    </div>
  );
};

export default PageNotFound;
