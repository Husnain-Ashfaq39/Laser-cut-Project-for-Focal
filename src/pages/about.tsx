import Footer from "@/components/footer/footer";
import Navbar from "@/components/nav/navbar";

// images
import Image1 from "@/assets/images/about/img-1.jpeg";
import Image2 from "@/assets/images/about/img-2.jpeg";
import Image4 from "@/assets/images/about/img-4.png";
import { ContactUsDialog } from "@/components/dialogs/contact-us-dialog";

const About = () => {
  return (
    <div className="m-auto flex w-[90%] flex-col items-center pt-16">
      <Navbar />
      <div className="m-auto w-[100%] space-y-5 pb-16 md:pt-[10%]">
        <h1 className="font-secondary text-2xl text-gray-400">About us</h1>
        <h1 className="font-cinzel text-6xl">
          Who We <br />
          <span className="font-secondary font-normal">ARE</span>
        </h1>
      </div>
      <div className="flex w-screen">
        <img src={Image1} className="my-10 h-[400px] w-1/2 object-cover" />
        <img src={Image2} className="my-10 h-[400px] w-1/2 object-cover" />
      </div>
      <div className="flex w-[90%] pt-10">
        <div className="w-1/2">
          <h1 className="font-cinzel py-2 pb-10 text-5xl font-semibold">
            OUR STORY
          </h1>
          <p className="w-[60%] font-secondary font-normal">
            Focal started in 2020 after founder George Hayden saw a large gap in
            the market for providers of high-quality decorative metal work in
            the Central Otago region.
            <br />
            <br />
            Fast forward four years and George has now teamed up with Robbie
            Craig-Brown as well as a great team of skilled professionals after
            listening to the needs of our clients.
            <br />
            <br />
            We strive to provide quality products at the scale required for the
            high-end architectural homes that are being built in the Central
            Otago region and are passionate about investing in great teams and
            equipment.
            <br />
            <br />
            Focal has quickly become the standard for decorative metal work in
            the region and trusted by builders, architects and interior
            designers alike
          </p>
        </div>
        <div className="w-1/2">
          <img src={Image4} className="w-full object-cover" />
        </div>
      </div>
      <div>
        <ContactUsDialog>
          <button className="m-auto mt-5 flex min-w-12 items-center justify-center rounded-full bg-black px-6 py-2 md:px-10 md:py-3">
            <p className="font-secondary font-extralight text-white md:text-base">
              {" "}
              GET IN TOUCH NOW
            </p>
          </button>
        </ContactUsDialog>
        </div>
      <Footer />
    </div>
  );
};

export default About;
