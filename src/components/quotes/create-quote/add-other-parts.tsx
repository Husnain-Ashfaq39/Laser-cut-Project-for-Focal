import AddPartButton from "./add-part-button";

const AddOtherParts = () => {
  return (
    <div className="m-auto my-5 flex space-y-10">
      <div className="flex w-full justify-between">
        <div className="">
          <AddPartButton
            label="+ Add from your part library"
            takesTo="part-library"
          />
        </div>
        <div className="flex-1 pl-12">
          <AddPartButton
            label="+ Add from parametric library"
            takesTo="parametric-library"
          />
        </div>
      </div>
    </div>
  );
};

export default AddOtherParts;
