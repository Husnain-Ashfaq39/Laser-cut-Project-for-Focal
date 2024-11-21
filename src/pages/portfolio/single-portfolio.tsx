import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Footer from "@/components/footer/footer";
import Navbar from "@/components/nav/navbar";
import { ChevronLeft } from "lucide-react";
import { getSinglePortfolioById } from "@/services/portfolio"; // Assuming you created this service

const SinglePortfolio = () => {
  const { portfolioId } = useParams<{ portfolioId: string }>();
  const [portfolio, setPortfolio] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (portfolioId) {
        setIsLoading(true);
        try {
          const fetchedPortfolio = await getSinglePortfolioById(portfolioId);
          if (fetchedPortfolio) {
            setPortfolio(fetchedPortfolio);
          } else {
            setError("Portfolio not found.");
          }
        } catch (err) {
          console.error("Error fetching portfolio: ", err);
          setError("Failed to fetch portfolio.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchPortfolio();
  }, [portfolioId]);

  if (isLoading) {
    return <></>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!portfolio) {
    return <p>No portfolio available.</p>;
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
          {portfolio.detailedContent.map((item: any, index: number) => {
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
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SinglePortfolio;
