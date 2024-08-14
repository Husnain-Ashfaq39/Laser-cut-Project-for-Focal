import { useParams, Link } from "react-router-dom";
import Footer from "@/components/footer/footer";
import Navbar from "@/components/nav/navbar";
import services from "@/data/services";
import { ChevronLeft } from "lucide-react";

const SingleService = () => {
  const { serviceId } = useParams<{ serviceId: string }>();

  // Ensure serviceId is a string
  if (!serviceId) {
    return <p>Service not found</p>;
  }

  const service = services.find((s) => s.id === parseInt(serviceId));

  if (!service) {
    return <p>Service not found</p>;
  }

  return (
    <div className="m-auto flex w-[100%] flex-col">
      <Navbar />
      <div className="flex flex-row">
        <div className="m-auto my-6 w-[70%] pt-10">
          <Link to="/services" className="flex flex-row items-center pt-10">
            <ChevronLeft className="h-8 w-8 pt-1" />
            <span className="m-5 p-2 text-2xl">Back to Our Services</span>
          </Link>
          <div className="m-auto space-y-5 pb-16">
            <h1 className="font-cinzel text-6xl">{service.title}</h1>
          </div>
          <div className="space-y-16 pb-10">
            <div className="flex flex-col items-start md:flex-row md:space-x-8">
              <div className="md:w-1/2">
                <p className="font-secondary text-lg">{service.description}</p>
              </div>
              <div className="md:w-1/2">
                <img
                  src={service.imgURL}
                  alt={service.title}
                  className="mb-5 w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SingleService;
