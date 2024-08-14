import Footer from "@/components/footer/footer";
import Navbar from "@/components/nav/navbar";

const PrivacyPolicy = () => {
  return (
    <div className="m-auto flex w-[80%] flex-col items-center pt-16">
      <Navbar />
      <div className="container mx-auto mt-16 px-4 py-8">
        <h1 className="font-cinzel mb-4 text-center text-6xl">
          Privacy Policy
        </h1>
        <div className="space-y-4 font-secondary font-normal text-gray-600">
          <p>
            We collect personal information from you, including information
            about your:
          </p>
          <ul className="list-inside list-disc pl-4">
            <li>name</li>
            <li>contact information</li>
            <li>location</li>
            <li>interactions with us</li>
          </ul>
          <p>We collect your personal information in order to:</p>
          <ul className="list-inside list-disc pl-4">
            <li>plan sales and marketing campaigns</li>
          </ul>
          <p>Besides our staff, we share this information with:</p>
          <ul className="list-inside list-disc pl-4">
            <li>
              Google and Squarespace in order to plan and generate our sales and
              marketing campaigns to target people that may be interested in our
              business.
            </li>
          </ul>
          <p>
            We keep your information safe by storing it securely on our internal
            systems or websites that are safe and only allowing certain staff to
            access it.
          </p>
          <p>
            You have the right to ask for a copy of any personal information we
            hold about you, and to ask for it to be corrected if you think it is
            wrong. If you’d like to ask for a copy of your information, or to
            have it corrected, please contact us at:
          </p>
          <ul className="list-inside list-disc pl-4">
            <li>george@focalqt.com</li>
            <li>022 324 6182</li>
            <li>19 Margaret Place, Queenstown, New Zealand</li>
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
