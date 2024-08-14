import img1 from "@/assets/portfolio-home/img-1.jpeg";
import img2 from "@/assets/portfolio-home/img-3.jpeg";
import img3 from "@/assets/portfolio-home/img-2.jpeg";
import { scrollToTop } from "@/utils/helpers";
import { useNavigate } from "react-router-dom";

const Portfolio = () => {
  const navigate = useNavigate();
  return (
    <div className="mx-auto w-4/5 py-8">
      <h1 className="font-cinzel mb-4 text-center text-4xl">What we do</h1>
      <h1 className="font-cinzel mb-8 text-center text-5xl">
        Our <span>Portfolio</span>
      </h1>
      <div className="flex w-full justify-center gap-4 py-4">
        <div className="flex h-auto w-1/4 flex-col items-center py-[5vw]">
          <img
            src={img1}
            className="mb-4 h-auto w-[90%] rounded-[5%] object-cover"
          />
          <div className="text-center">
            <p className="font-cinzel mb-2 text-start text-xl font-bold">
              STEEL PENDANT LIGHTS
            </p>
            <p className="mb-2 text-start text-md">
              One-off pair of lighting for a Speargrass Flat project.
            </p>
          </div>
        </div>
        <div className="flex h-auto w-1/2 flex-col items-center">
          <img
            src={img2}
            className="mb-4 h-auto w-[90%] rounded-[5%] object-cover"
          />
          <div className="text-center">
            <p className="font-cinzel mb-2 text-start text-2xl font-bold">
              SHOP FIT-OUTS
            </p>
            <p className="mb-2 text-start text-lg">
              A sample of shop fit-outs that we have completed.
            </p>
          </div>
        </div>
        <div className="flex h-auto w-1/4 flex-col items-center space-x-5 py-[10vw]">
          <img
            src={img3}
            className="mb-4 h-auto w-[90%] rounded-[5%] object-cover"
          />
          <div className="text-center">
            <p className="font-cinzel mb-2 text-start text-xl font-bold">
            BESPOKE FIREPLACES
            </p>
            <p className="mb-2 text-start text-sm">
            A sample of fireplaces that we have completed.
            </p>
          </div>
        </div>
      </div>
      <button
        className="m-auto mt-5 flex min-w-12 items-center justify-center rounded-full bg-black px-6 py-2 md:px-10 md:py-3"
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
  );
};

export default Portfolio;
