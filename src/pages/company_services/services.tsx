import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FeatureDescriptionWithImageToLeft from "@/components/feature-description-with-image-to-left";
import FeatureDescriptionWithImageToRight from "@/components/feature-description-with-image-to-right";
import Footer from "@/components/footer/footer";
import Navbar from "@/components/nav/navbar";
import { SignUpDialog } from "@/components/dialogs/sign-up-dialog";
import { LoginDialog } from "@/components/dialogs/login-dialog";
import { scrollToTop } from "@/utils/helpers";
import { getServicesFromDb } from "@/services/services";

const Services = () => {

  const [isSignUpDialogOpen, setIsSignUpDialogOpen] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

  const [services, setServices] = useState<any>([]);
  const toggleSignUpDialog = (isOpen: boolean) => {
    setIsSignUpDialogOpen(isOpen);
    if (isOpen) setIsLoginDialogOpen(false);
  };

  const toggleLoginDialog = (isOpen: boolean) => {
    setIsLoginDialogOpen(isOpen);
    if (isOpen) setIsSignUpDialogOpen(false);
  };

  const handleLinkClick = () => {
    scrollToTop();
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const services = await getServicesFromDb();
        setServices(services);
      } catch (error) {
        console.log(error);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="m-auto w-[90%] pt-16">
      <Navbar />
      <div className="m-auto space-y-5 pb-16 md:pt-[10%]">
        <h1 className="font-secondary text-2xl text-gray-400">Our Services</h1>
        <h1 className="font-cinzel text-6xl">
          Comfortable & <br />
          Transparent{" "}
          <span className="font-secondary font-medium">Services</span>
        </h1>
      </div>
      <div className="space-y-16 pb-10">
        {services.map((service: any, index: number) =>
          index % 2 !== 0 ? (
            <Link
              key={service.id}
              to={`/services/${service.firestoreId}`}
              onClick={handleLinkClick}
            >
              <FeatureDescriptionWithImageToLeft
                title={service.title}
                description={
                  <p>
                    {service.shortDescription}...
                    <Link
                      to={`/services/${service.firestoreId}`}
                      onClick={handleLinkClick}
                      className="text-blue-600 hover:underline"
                    >
                      Read more
                    </Link>
                  </p>
                }
                img={service.imgURL}
              />
            </Link>
          ) : (
            <Link
              key={service.id}
              to={`/services/${service.firestoreId}`}
              onClick={handleLinkClick}
            >
              <FeatureDescriptionWithImageToRight
                title={service.title}
                description={
                  <p>
                    {service.shortDescription}...
                    <Link
                      to={`/services/${service.firestoreId}`}
                      onClick={handleLinkClick}
                      className="text-blue-600 hover:underline"
                    >
                      Read more
                    </Link>
                  </p>
                }
                img={service.imgURL}
              />
            </Link>
          ),
        )}
      </div>
      <div className="flex flex-col space-y-6 pt-6">
        <h1 className="text-center font-primary text-2xl">
          Precision Engineering and Design Services at Focal{" "}
        </h1>
        <p className="font-secondary text-sm">
          Here at Focal, we provide precision-engineered design solutions by
          utilizing Autodesk's Inventor 3D modeling tools. Each project is
          original and functionally optimized because our methodology combines
          cutting-edge technology with creative design experience.
          <br />
          <br />
          Our fabrication services are customized to cater to our client's
          unique requirements, guaranteeing top-notch outcomes by paying close
          attention to every detail. All the way from the first idea to the
          finished result, our talented crew ensures long-lasting craftsmanship.
          <br />
          <br />
          Utilizing a state-of-the-art{" "}
          <strong>CNC Profile Cutting Machine</strong>, Count on us for cutting
          services that are both accurate and quick. This technology allows us
          to work with a wide range of materials, ensuring clean cuts and exact
          measurements every time.
        </p>
      </div>
      <LoginDialog
        isDialogOpen={isLoginDialogOpen}
        toggleSignUpDialog={toggleSignUpDialog}
        toggleDialog={toggleLoginDialog}
      />
      <SignUpDialog
        isDialogOpen={isSignUpDialogOpen}
        toggleLoginDialog={toggleLoginDialog}
        toggleDialog={toggleSignUpDialog}
      >
        <button className="m-auto mt-5 flex min-w-12 items-center justify-center rounded-full bg-black px-6 py-2 md:px-10 md:py-3">
          <p className="font-secondary font-extralight text-white md:text-base">
            GET STARTED
          </p>
        </button>
      </SignUpDialog>
      <Footer />
    </div>
  );
};

export default Services;
