import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/home";
import Services from "@/pages/service/services";
import Portfolio from "@/pages/portfolio/portfolios";
import Blogs from "@/pages/blog/blogs";
import About from "@/pages/about";
import SinglePortfolio from "@/pages/portfolio/single-portfolio";
import SingleBlog from "@/pages/blog/single-blog";
import PageNotFound from "@/pages/404";
import StartQuoting from "@/pages/start-quoting";
import PrivacyPolicy from "@/pages/privacy-policy";
import FAQ from "@/pages/FAQ";
import SingleService from "@/pages/service/single-service";

// quotes
import QuoteHistory from "@/pages/quotes/quotes-history";
import AddParts from "@/pages/quotes/create-quote";
import QuoteSummary from "@/pages/quotes/quote-summary";
import QuickPart from "@/pages/quotes/quick-part";
import ParametricLibrary from "@/pages/quotes/parametric-library";
import PartLibrary from "@/pages/part-library";
import AddDetails from "@/pages/admin-pages/add-details";

const quotesUrls = [
  {
    path: "quotes/history",
    element: <QuoteHistory />,
  },
  {
    path: "quotes/new-quote",
    element: <AddParts />,
  },
  {
    path: "quotes/new-quote/summary",
    element: <QuoteSummary />,
  },
  {
    path: "quotes/new-quote/quick-part/:shape-name",
    element: <QuickPart />,
  },

  {
    path: "quotes/new-quote/parametric-library",
    element: <ParametricLibrary />,
  },
  {
    path: "quotes/new-quote/part-library",
    element: <PartLibrary />,
  },
];

const adminUrls=[

  {
    path: "admin/add-details",
    element: <AddDetails />,
  }


];

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <PageNotFound />,
  },
  {
    path: "/services",
    element: <Services />,
  },
  {
    path: "/services/:serviceId",
    element: <SingleService />,
  },
  {
    path: "/portfolio",
    element: <Portfolio />,
  },
  {
    path: "/portfolio/:portfolioId",
    element: <SinglePortfolio />,
  },
  {
    path: "/blogs",
    element: <Blogs />,
  },
  {
    path: "/blogs/:blogId",
    element: <SingleBlog />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/start-quoting",
    element: <StartQuoting />,
  },
  {
    path: "/privacy-policy",
    element: <PrivacyPolicy />,
  },
  {
    path: "/faq",
    element: <FAQ />,
  },
  // quotes routes
  ...quotesUrls,

  //admin routes
  ...adminUrls,
]);
