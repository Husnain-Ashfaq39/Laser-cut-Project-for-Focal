import { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";

const Button: FunctionComponent = () => {
  const navigate = useNavigate();
  return (
    <button
      className="flex cursor-pointer items-start gap-2 rounded-full border-none bg-black px-4 py-2 shadow-md"
      onClick={() => navigate("/quotes/new-quote")}
    >
      <div className="flex items-start pt-0.5">
        <img className="h-4 w-4" alt="" src="/add.svg" />
      </div>
      <div className="text-sm font-medium font-secondary text-white">Create a new quote</div>
    </button>
  );
};

export default Button;
