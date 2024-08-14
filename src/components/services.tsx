import { useNavigate } from "react-router-dom";
import { ServicesMovingCards } from "./moving-cards/services-moving-cards";
import { scrollToTop } from "@/utils/helpers";

const Services = () => {
  const navigate = useNavigate();
  return (
    <div className="">
      <div className="m-auto w-[60%]">
        <h1 className="font-secondary text-2xl text-gray-500">Our Services</h1>
        <p className="font-cinzel text-5xl">
          Comfortable & <br /> Transparent{" "}
          <span className="font-bold">Services</span>
        </p>
      </div>
      <div>
        <ServicesMovingCards direction="right" speed="slow" />
      </div>
      <button
        className="m-auto mt-5 flex min-w-12 items-center justify-center rounded-full bg-black px-6 py-2 md:px-10 md:py-3"
        onClick={() => {
          navigate("/services");
          scrollToTop();
        }}
      >
        <p className="font-secondary font-extralight text-white md:text-base">
          SEE ALL SERVICES
        </p>
      </button>
    </div>
  );
};

export default Services;
