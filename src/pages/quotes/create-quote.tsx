import { FunctionComponent } from "react";
import FileUpload from "@/components/quotes/create-quote/file-upload";
import FooterAdmin from "@/components/footer/fouter-admin";
import NavbarAdmin from "@/components/nav/navbar-admin";
import { useNavigate } from "react-router-dom";
import CreateNewQuoteSteper from "@/components/quotes/create-quote/steper";
import Part from "@/components/quotes/create-quote/part/part";
import AddOtherParts from "@/components/quotes/create-quote/add-other-parts";
import HorizontalDevider from "@/assets/quotes/horizontal-devider.svg";
import { Button } from "@/components/_ui/button";

const AddParts: FunctionComponent = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full bg-slate-100">
      <NavbarAdmin />
      <main className="m-auto flex min-h-screen flex-col px-[5%] py-5">
        <h1 className="text-center font-primary text-3xl">
          Create a new quote
        </h1>
        <CreateNewQuoteSteper currentStep={1} />
        <h2 className="font-primary text-2xl">Add Parts</h2>
        <div className="mt-4 flex min-h-[650px] min-w-[500px] flex-col rounded-xl border bg-white shadow-sm">
          <FileUpload />
          <AddOtherParts />
          <img src={HorizontalDevider} className="px-6" />
          <Part />
        </div>
        <div className="m-auto flex w-full flex-row justify-end space-x-4 py-8 pr-5">
          <Button variant="secondary" className="rounded-full border bg-white">
            Cancel
          </Button>
          <button
            className="rounded-full bg-black px-5 text-white"
            onClick={() => {
              navigate("/quotes/new-quote/summary");
            }}
          >
            Next
          </button>
        </div>
      </main>
      <FooterAdmin />
    </div>
  );
};

export default AddParts;
