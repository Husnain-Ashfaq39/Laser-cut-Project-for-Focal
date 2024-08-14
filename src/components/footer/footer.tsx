import FooterLogo from "@/assets/focal-logo-2.png";
import FullLine from "@/assets/full-line.png";
import { AdvancedInput } from "../_ui/advanced-input";
import { Link } from "react-router-dom";
import { ContactUsDialog } from "../dialogs/contact-us-dialog";
import { scrollToTop } from "@/utils/helpers";

const Footer = () => {
  const placeholders = ["Enter your email"];

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Portfolio", path: "/portfolio" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <footer className="bg-white py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="m-auto grid grid-cols-1 gap-8">
          <img src={FullLine} className="relative left-0 py-5" />
          <div className="flex flex-col items-center justify-center md:flex-row md:items-center md:justify-center">
            <h2 className="font-cinzel text-center text-5xl md:w-3/5">
              SUBSCRIBE TO <br />
              <span className="font-secondary font-semibold">NEWSLETTER</span>
            </h2>
            <div className="mt-4 w-full rounded-full md:mt-0 md:w-2/5">
              <AdvancedInput
                placeholders={placeholders}
                onChange={handleChange}
                onSubmit={onSubmit}
              />
            </div>
          </div>

          <img src={FullLine} className="relative left-0 py-5" />
          <div className="spacing-y-12 mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col items-start">
              <img src={FooterLogo} className="-m-6 w-[60%]" />
              <p className="mt-2 py-2 text-center font-secondary md:text-left">
                We provide a full range of interior design, architectural
                design.
              </p>
              <div className="mt-4 flex space-x-10">
                <a
                  href="https://www.instagram.com/focalqt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-900"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-instagram"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <h2 className="font-secondary text-2xl text-gray-500">
                Important Links
              </h2>
              <ul className="mt-2 space-y-2">
                {" "}
                {/* Adjusted the space-y class */}
                {navItems.map((item) => (
                  <li key={item.path} onClick={scrollToTop}>
                    <Link
                      to={item.path}
                      className="font-secondary font-normal hover:text-gray-900"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
                <ContactUsDialog>
                  <button className="font-secondary font-normal hover:text-gray-900">
                    Contact
                  </button>
                </ContactUsDialog>
                <li onClick={scrollToTop}>
                  <Link
                    to="/privacy-policy"
                    className="font-secondary font-normal hover:text-gray-900"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li onClick={scrollToTop}>
                  <Link
                    to="/faq"
                    className="font-secondary font-normal hover:text-gray-900"
                  >
                    FAQs
                  </Link>
                </li>
              </ul>
            </div>

            <div className="flex flex-col items-center space-y-5 md:items-start">
              <h2 className="font-secondary text-2xl text-gray-500">Contact</h2>
              <div className="flex flex-row items-center space-x-5 py-2">
                <svg
                  width="45"
                  height="45"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19.3612 17C20.1072 17.4561 20.5 17.9734 20.5 18.5C20.5 19.0266 20.1072 19.5439 19.3612 20C18.6152 20.4561 17.5422 20.8348 16.25 21.0981C14.9578 21.3614 13.4921 21.5 12 21.5C10.5079 21.5 9.04216 21.3614 7.75 21.0981C6.45784 20.8348 5.38482 20.4561 4.63878 20C3.89275 19.5439 3.5 19.0266 3.5 18.5C3.5 17.9734 3.89275 17.4561 4.63878 17"
                    stroke="#222222"
                    stroke-linecap="round"
                  />
                  <path
                    d="M19.5 10C19.5 15.018 14.0117 18.4027 12.4249 19.2764C12.1568 19.424 11.8432 19.424 11.5751 19.2764C9.98831 18.4027 4.5 15.018 4.5 10C4.5 5.5 8.13401 2.5 12 2.5C16 2.5 19.5 5.5 19.5 10Z"
                    stroke="#222222"
                  />
                  <circle cx="12" cy="10" r="3.5" stroke="#222222" />
                </svg>

                <p className="text-center font-secondary md:text-left">
                  19 Margaret Place, Frankton, Queenstown 9300, New Zealand
                </p>
              </div>
              <div className="flex flex-row items-center space-x-5 py-2">
                <svg
                  width="35"
                  height="35"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.7071 13.7071L20.3552 16.3552C20.7113 16.7113 20.7113 17.2887 20.3552 17.6448C18.43 19.57 15.3821 19.7866 13.204 18.153L11.6286 16.9714C9.88504 15.6638 8.33622 14.115 7.02857 12.3714L5.84701 10.796C4.21341 8.61788 4.43001 5.56999 6.35523 3.64477C6.71133 3.28867 7.28867 3.28867 7.64477 3.64477L10.2929 6.29289C10.6834 6.68342 10.6834 7.31658 10.2929 7.70711L9.27175 8.72825C9.10946 8.89054 9.06923 9.13846 9.17187 9.34373C10.3585 11.7171 12.2829 13.6415 14.6563 14.8281C14.8615 14.9308 15.1095 14.8905 15.2717 14.7283L16.2929 13.7071C16.6834 13.3166 17.3166 13.3166 17.7071 13.7071Z"
                    stroke="#222222"
                  />
                </svg>
                <p className="text-center font-secondary md:text-left">
                  (022) 324 6182
                </p>
              </div>
              <div className="flex flex-row items-center space-x-5 py-2">
                <svg
                  width="35"
                  height="35"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="4"
                    y="6"
                    width="16"
                    height="12"
                    rx="2"
                    stroke="#222222"
                  />
                  <path
                    d="M4 9L11.1056 12.5528C11.6686 12.8343 12.3314 12.8343 12.8944 12.5528L20 9"
                    stroke="#222222"
                  />
                </svg>
                <p className="text-center font-secondary md:text-left">
                  george@focalqt.com
                </p>
              </div>
            </div>
          </div>
        </div>
        <img src={FullLine} className="relative left-0 py-5" />
        <p className="mt-4 px-5 py-6 text-start text-xl">
          © 2024 Focal. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
