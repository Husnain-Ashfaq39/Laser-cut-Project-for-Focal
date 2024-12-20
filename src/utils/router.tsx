import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/home";
import Services from "@/pages/company_services/services";
import Portfolio from "@/pages/portfolio/portfolios";
import Blogs from "@/pages/blog/blogs";
import About from "@/pages/about";
import SinglePortfolio from "@/pages/portfolio/single-portfolio";
import SingleBlog from "@/pages/blog/single-blog";
import PageNotFound from "@/pages/404";
import StartQuoting from "@/pages/start-quoting";
import PrivacyPolicy from "@/pages/privacy-policy";
import FAQ from "@/pages/FAQ";
import SingleService from "@/pages/company_services/single-service";

// quotes
import QuoteHistory from "@/pages/quotes/quotes-history";
import AddParts from "@/pages/quotes/create-quote";
import QuoteSummary from "@/pages/quotes/quote-summary";
import QuickPart from "@/pages/quotes/quick-part";
import ParametricLibrary from "@/pages/quotes/parametric-library";
import PartLibrary from "@/pages/part-library";
import AddDetails from "@/pages/admin-pages/add-details";
import CuttingTechs from "@/pages/admin-pages/cutting-techs";
import CustomerList from "@/pages/admin-pages/customer-list";
import ProfileDetails from "@/pages/profile-details";
import Material from "@/pages/admin-pages/materials/materials";
import RateTable from "@/pages/admin-pages/rate-table";
import ThankyouPage from "@/components/thank-you";
import Dashboard from "@/pages/dashboard/Dashboard";
import Quotes from "@/pages/admin-pages/quotes";
import NotificationsPage from "@/pages/notifications/notifications-page";
import AuthSuccessPage from "@/components/auth-success";
import CompanyDialog from "@/components/dialogs/company-dialog";

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
  {
    path: "quotes/history",
    element: <QuoteHistory />,
  },
  {
    path: "quotes/new-quote/confirmation",
    element: <ThankyouPage />,
  },
  {
    path: "/notifications",
    element: <NotificationsPage />,
  },
];

const adminUrls = [
  {
    path: "admin/add-details",
    element: <AddDetails />,
  },
  {
    path: "admin/add-cutting-techs",
    element: <CuttingTechs />,
  },
  {
    path: "admin/customer-list",
    element: <CustomerList />,
  },
  {
    path: "admin/quotes",
    element: <Quotes />,
  },
  {
    path: "admin/material",
    element: <Material />,
  },
  {
    path: "admin/rate-table",
    element: <RateTable />,
  },
  {
    path: "admin/quotes",
    element: <Quotes />,
  },
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
  {
    path: "/profile-details",
    element: <ProfileDetails />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/callback",
    element: <AuthSuccessPage />,
  },
  {
    path: "/set-company",
    element: <CompanyDialog />,
  },
  // quotes routes
  ...quotesUrls,

  //admin routes
  ...adminUrls,
]);
