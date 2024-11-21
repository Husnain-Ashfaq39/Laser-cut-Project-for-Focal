import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Footer from "@/components/footer/footer";
import Navbar from "@/components/nav/navbar";
import { ChevronLeft } from "lucide-react";
import { getSingleServiceById } from "@/services/services"; // Assuming you created this service

const SingleService = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const [service, setService] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchService = async () => {
      if (serviceId) {
        setIsLoading(true);
        try {
          const fetchedService = await getSingleServiceById(serviceId);
          if (fetchedService) {
            setService(fetchedService);
          } else {
            setError("Service not found.");
          }
        } catch (err) {
          console.error("Error fetching service: ", err);
          setError("Failed to fetch service.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchService();
  }, [serviceId]);

  if (isLoading) {
    return <></>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!service) {
    return <p>No service available.</p>;
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
                <p className="font-secondary text-lg">
                  {service.description.map((item: any, index: number) => {
                    switch (item.type) {
                      case "title":
                        return (
                          <h1
                            key={index}
                            className="w-full text-start font-primary text-xl text-gray-800"
                          >
                            {item.content}
                          </h1>
                        );
                      case "paragraph":
                        return (
                          <p
                            key={index}
                            className="my-2 text-start indent-4 font-secondary text-lg"
                          >
                            {item.content}
                          </p>
                        );
                      case "image":
                        return (
                          <>
                            <img
                              key={index}
                              src={item.imgURL}
                              className="h-[400px] w-[80%] rounded-3xl object-cover shadow-2xl"
                            />
                            <p className="text-lg italic text-gray-600">
                              {item?.subtitle}
                            </p>
                          </>
                        );
                      default:
                        return null;
                    }
                  })}
                </p>
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
