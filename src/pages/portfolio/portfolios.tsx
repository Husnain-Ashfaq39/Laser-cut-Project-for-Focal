import Footer from "@/components/footer/footer";
import Navbar from "@/components/nav/navbar";
import PortfolioCard from "@/components/portfolio-card";
import { Outlet} from "react-router-dom";
import { ContactUsDialog } from "@/components/dialogs/contact-us-dialog";
import { useEffect, useState } from "react";
import {
  getPortfolioFromDb,
  // pushPortfolioItemsToDb,
} from "@/services/portfolio";

const Portfolio = () => {
  const handlePushingToDb = () => {
    // pushPortfolioItemsToDb();
  };

  const [portfolios, setPortfolios] = useState([]);
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const portfolioDb = await getPortfolioFromDb();
        setPortfolios(portfolioDb);
        console.log(portfolioDb);
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
        <h1 className="font-secondary text-2xl text-gray-400">Portfolio</h1>
        <h1 className="font-cinzel text-6xl">
          Explore our
          <br />
          successful{" "}
          <span className="font-secondary font-medium">PROJECTS</span>
        </h1>
      </div>
      {/* <Button onClick={handlePushingToDb}>Push portfolio to db</Button> */}
      <div className="grid grid-cols-1 gap-4 pb-10 md:grid-cols-2">
        {portfolios.map((portfolio) => (
          <div className="p-4" key={portfolio.title}>
            <PortfolioCard
              id={portfolio.firestoreId}
              title={portfolio.title}
              description={portfolio.description}
              imgURL={portfolio.imgURL}
            />
          </div>
        ))}
      </div>
      <ContactUsDialog>
        <button className="m-auto mt-5 flex min-w-12 items-center justify-center rounded-full bg-black px-6 py-2 md:px-10 md:py-3">
          <p className="font-secondary font-extralight text-white md:text-base">
            GET IN TOUCH
          </p>
        </button>
      </ContactUsDialog>
      <Footer />
      <Outlet />
    </div>
  );
};

export default Portfolio;
