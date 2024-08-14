import { useParams, Link, Navigate } from "react-router-dom";
import Footer from "@/components/footer/footer";
import Navbar from "@/components/nav/navbar";
import portfolios from "@/data/portfolio";
import { ChevronLeft } from "lucide-react";

const SinglePortfolio = () => {
  const { portfolioId } = useParams<{ portfolioId: string }>();

  // Ensure portfolioId is a string
  if (!portfolioId) {
    return <Navigate to="/404" />;
  }

  const portfolio = portfolios.find((p) => p.id === parseInt(portfolioId));

  if (!portfolio) {
    return <Navigate to="/404" />;
  }

  return (
    <div className="m-auto flex w-[100%] flex-col items-center">
      <Navbar />
      <div className="flex w-[70%] flex-col pt-10">
        <Link to="/portfolio" className="flex flex-row items-center pt-10">
          <ChevronLeft className="h-8 w-8 pt-1" />
          <span className="m-5 p-2 text-2xl">Back to Portfolio</span>
        </Link>
        <h1 className="w-full py-5 text-start font-secondary text-6xl text-gray-500">
          {portfolio.title}
        </h1>
        <div className="flex flex-col">
          <img
            src={portfolio.imgURL}
            alt={portfolio.title}
            className="h-[400px] w-full rounded-xl object-cover"
          />
          {portfolio.detailedContent}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SinglePortfolio;
