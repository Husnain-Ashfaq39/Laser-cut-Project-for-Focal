import TriangleDownImage from "@/assets/quotes/triangle-down-svg.svg";

const stepsCustomer = [
  {
    step: 1,
    name: "Add Parts",
    isActive: true,
  },
  {
    step: 2,
    name: "Summary of Quote Price",
    isActive: false,
  },
];

const stepsAdmin = [
  {
    step: 1,
    name: "Add Details",
    isActive: true,
  },
  {
    step: 2,
    name: "Add Parts",
    isActive: false,
  },
  {
    step: 3,
    name: "Summary of Quote Price",
    isActive: false,
  },
];

interface CreateNewQuoteSteperProps {
  currentStep: number;
  admin?: boolean;
}

const CreateNewQuoteSteper = ({ currentStep, admin = false }: CreateNewQuoteSteperProps) => {
  const steps = admin ? stepsAdmin : stepsCustomer;
  
  const updatedSteps = steps.map((step) => ({
    ...step,
    isActive: step.step === currentStep,
  }));

  return (
    <div className="m-auto my-10 h-[100px] rounded-t-2xl border-[1px] border-blue-100 bg-white hidden sm:block">
      <div className="flex h-full flex-row divide-x-[1px]">
        {updatedSteps.map((step) => (
          <div
            className="flex h-full w-[320px] flex-col justify-between"
            key={step.step}
          >
            <div className="m-2 flex h-full flex-row items-center space-x-4 pl-5">
              <div
                className={`flex h-[32px] w-[32px] items-center justify-center rounded-full border border-gray-700 ${
                  step.isActive ? "bg-black text-white" : "bg-white text-black"
                }`}
              >
                {step.step}
              </div>
              <div>
                <p className="text-gray-500">Step {step.step}:</p>
                <p>{step.name}</p>
              </div>
            </div>
            <div className="w-full">
              {step.isActive && (
                <div className="h-[4px] w-full bg-black">
                  <img
                    src={TriangleDownImage}
                    className="m-auto w-6 object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreateNewQuoteSteper;
