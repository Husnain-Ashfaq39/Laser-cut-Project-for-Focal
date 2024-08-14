import ExploreMoreButton from "@/assets/explore-more.png";
import { scrollToTop } from "@/utils/helpers";
import { Link } from "react-router-dom";

const Description = () => {
  return (
    <div className="relative m-auto w-[90%] rounded-3xl bg-white border">
      <div className="z-40 mx-5 mt-10 flex h-full flex-col space-y-5 py-10 pt-20 md:mx-10 md:flex-row md:space-x-5 md:space-y-0">
        <div className="flex h-full w-full flex-col pt-5 md:w-1/2 md:pl-10">
          <h1 className="font-secondary text-3xl font-normal text-[#6D6D6D]">
            About FOCAL
          </h1>
          <h1 className="pt-5 font-cinzel text-4xl font-medium md:text-5xl">
            Experience
            <br />
            The Difference
          </h1>
          <Link to="/about" onClick={scrollToTop}>
            <img
              src={ExploreMoreButton}
              alt="Explore More"
              className="mt-10 w-1/2 md:w-1/3"
            />
          </Link>
        </div>

        <div className="h-full w-full pt-5 md:w-1/2 md:pr-10 md:pt-0">
          <p className="font-body text-base sm:hidden md:block md:text-[16px] 2xl:text-xl">
            Welcome to Focal, your premier destination for luxury metal
            fabrication and decorative metalwork. With our exceptional skills,
            we transform ordinary spaces into stunning masterpieces featuring
            custom-made metal elements.
            <br />
            <br />
            At Focal, true luxury lies in the details. Our talented craftsmen
            create unique metal pieces that perfectly match your space and
            style. Whether you're looking to add a touch of elegance to your
            home or business, our designs are tailored just for you. <br />
            We offer a range of services including decorative cladding, custom
            fences, gates, furniture pieces, and sculptures. Each piece is
            meticulously crafted using the finest materials, ensuring precision
            and care in every detail. Our commitment to quality guarantees a
            beautiful, long-lasting product. Discover decorative metalwork like
            never before.
            <br />
            <br />
            Explore our portfolio or contact us to discuss your project. At
            Focal, we bring your visions to life with high-end creative artistry
            and <span className="font-bold">Metal Fabrication For Architectural.</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Description;
