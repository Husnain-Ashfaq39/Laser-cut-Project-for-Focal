import OrDividerImage from "@/assets/quotes/or-devider.svg";
import AddPartButton from "./add-part-button";

const AddOtherParts = () => {
  return (
    <div className="m-auto my-10 flex flex-col items-center justify-center space-y-10">
      <img src={OrDividerImage} className="w-[180px]" />
      <AddPartButton label="+ Add from your part library" takesTo="part-library" />
      <img src={OrDividerImage} className="w-[180px]" />
      <AddPartButton label="+ Add from parametric library" takesTo="parametric-library" />
    </div>
  );
};

export default AddOtherParts;
